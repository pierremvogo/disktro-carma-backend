"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
const nanoid_1 = require("nanoid");
/**
 * STRIPE SETUP
 */
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
}
const stripe = new stripe_1.default(stripeSecretKey, {
    apiVersion: "2025-08-27.basil", // ✅ stable official version
});
/**
 * Helpers
 */
function getEnv(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing env ${name}`);
    return v;
}
function toDbStatus(stripeStatus) {
    // Map Stripe status to your DB status
    // Stripe: active, trialing, past_due, canceled, unpaid, incomplete, incomplete_expired, paused
    if (stripeStatus === "active" || stripeStatus === "trialing")
        return "active";
    if (stripeStatus === "canceled")
        return "cancelled";
    if (stripeStatus === "past_due" || stripeStatus === "unpaid")
        return "past_due";
    return "pending";
}
async function getCurrentPeriodEndSeconds(stripe, subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (typeof subscription.current_period_end !== "number") {
        throw new Error("Stripe subscription missing current_period_end");
    }
    return subscription.current_period_end;
}
class StripeController {
}
exports.StripeController = StripeController;
_a = StripeController;
/**
 * POST /stripe/checkout/subscription
 * Auth required (fan)
 * body: { artistId: string, planId: string }
 *
 * Creates a Stripe Checkout session in subscription mode.
 * Redirect user to session.url.
 */
/**
 * ✅ Create Stripe Checkout Session (subscription)
 * NO stripeCustomerId column required
 */
StripeController.createSubscriptionCheckoutSession = async (req, res) => {
    try {
        const fanId = req.user?.id;
        if (!fanId) {
            res.status(401).send({ message: "Unauthorized Fan" });
            return;
        }
        const { artistId, planId } = req.body;
        if (!artistId || !planId) {
            res.status(400).send({ message: "Missing artistId or planId" });
            return;
        }
        // 1) Ensure artist exists
        const artist = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, artistId),
        });
        if (!artist || artist.type !== "artist") {
            res.status(404).send({ message: "Artist not found" });
            return;
        }
        // 2) Load plan -> stripePriceId
        const plan = await db_1.db.query.plans.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.plans.id, planId),
        });
        const stripePriceId = plan?.stripePriceId;
        if (!plan || !stripePriceId) {
            res
                .status(404)
                .send({ message: "Plan not found or missing stripePriceId" });
            return;
        }
        // 3) Load fan (email is useful for Stripe)
        const fan = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, fanId),
        });
        if (!fan) {
            res.status(404).send({ message: "Fan not found" });
            return;
        }
        if (!fan.email) {
            res.status(400).send({ message: "Fan email is required for checkout" });
            return;
        }
        // 4) Optional: prevent duplicate active subscription (fan+artist)
        const now = new Date();
        const existing = await db_1.db.query.subscriptions.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.subscriptions.artistId, artistId), (0, drizzle_orm_1.eq)(schema.subscriptions.userId, fanId), (0, drizzle_orm_1.eq)(schema.subscriptions.status, "active"), (0, drizzle_orm_1.gt)(schema.subscriptions.endDate, now)),
        });
        if (existing) {
            res.status(200).send({
                message: "Already subscribed",
                data: { isSubscribed: true },
            });
            return;
        }
        // 5) Create checkout session WITHOUT saving customer id in DB
        const FRONT_URL = getEnv("FRONT_URL");
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            // ✅ Stripe can create/link customer automatically using email
            customer_email: fan.email,
            // ✅ helps you identify the user later (optional but nice)
            client_reference_id: fanId,
            line_items: [{ price: stripePriceId, quantity: 1 }],
            success_url: `${FRONT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${FRONT_URL}/payment-cancel`,
            // ✅ Keep metadata for webhook -> DB sync
            metadata: { fanId, artistId, planId },
            subscription_data: { metadata: { fanId, artistId, planId } },
        });
        res.status(200).send({
            message: "Checkout session created",
            data: { url: session.url },
        });
    }
    catch (err) {
        console.error("StripeController.createSubscriptionCheckoutSession:", err);
        res.status(500).send({
            message: "Failed to create checkout session",
            error: err?.message ?? String(err),
        });
    }
};
/**
 * POST /stripe/portal
 * Auth required (fan)
 * Creates Stripe Customer Portal session so fan can manage billing.
 * body: { returnUrl?: string }
 */
StripeController.createCustomerPortalSession = async (req, res) => {
    try {
        const fanId = req.user?.id;
        if (!fanId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const fan = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, fanId),
        });
        if (!fan) {
            res.status(404).send({ message: "Fan not found" });
            return;
        }
        const stripeCustomerId = fan.stripeCustomerId;
        if (!stripeCustomerId) {
            res
                .status(400)
                .send({ message: "Stripe customer not found for this user" });
            return;
        }
        const FRONT_URL = getEnv("FRONT_URL");
        const returnUrl = req.body?.returnUrl || `${FRONT_URL}/account`;
        const portal = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: returnUrl,
        });
        res.status(200).send({
            message: "Portal session created",
            data: { url: portal.url },
        });
    }
    catch (err) {
        console.error("StripeController.createCustomerPortalSession:", err);
        res.status(500).send({
            message: "Internal server error",
            error: err?.message ?? String(err),
        });
    }
};
/**
 * POST /stripe/subscription/:artistId/cancel
 * Auth required (fan)
 * Cancels Stripe subscription for this fan+artist (if active).
 * If you prefer "cancel at period end", set cancel_at_period_end: true.
 */
StripeController.cancelSubscriptionForArtist = async (req, res) => {
    try {
        const fanId = req.user?.id;
        if (!fanId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const { artistId } = req.params;
        if (!artistId) {
            res.status(400).send({ message: "Missing artistId" });
            return;
        }
        const now = new Date();
        const sub = await db_1.db.query.subscriptions.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.subscriptions.artistId, artistId), (0, drizzle_orm_1.eq)(schema.subscriptions.userId, fanId), (0, drizzle_orm_1.eq)(schema.subscriptions.status, "active"), (0, drizzle_orm_1.gt)(schema.subscriptions.endDate, now)),
        });
        if (!sub || !sub.stripeSubscriptionId) {
            res.status(404).send({ message: "Active subscription not found" });
            return;
        }
        const stripeSubscriptionId = sub
            .stripeSubscriptionId;
        // ✅ Cancel at period end (recommended)
        await stripe.subscriptions.update(stripeSubscriptionId, {
            cancel_at_period_end: true,
        });
        // ✅ Fetch current_period_end properly
        const currentPeriodEndSeconds = await getCurrentPeriodEndSeconds(stripe, stripeSubscriptionId);
        // ✅ Update DB
        await db_1.db
            .update(schema.subscriptions)
            .set({
            status: "cancelled",
            endDate: new Date(currentPeriodEndSeconds * 1000),
        })
            .where((0, drizzle_orm_1.eq)(schema.subscriptions.id, sub.id));
        res.status(200).send({
            message: "Subscription cancelled",
            data: { isSubscribed: false },
        });
    }
    catch (err) {
        console.error("StripeController.cancelSubscriptionForArtist:", err);
        res.status(500).send({
            message: "Internal server error",
            error: err?.message ?? String(err),
        });
    }
};
/**
 * POST /stripe/webhook
 * IMPORTANT: this route MUST use express.raw({ type: 'application/json' })
 * or signature verification will fail.
 *
 * Handles:
 * - checkout.session.completed
 * - customer.subscription.updated
 * - customer.subscription.deleted
 */
StripeController.handleWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!sig || !endpointSecret) {
        res.status(400).send("Missing Stripe signature or webhook secret.");
        return;
    }
    let event;
    try {
        // ⚠️ req.body doit être RAW (express.raw)
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        console.error("Stripe webhook signature verification failed:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    try {
        /**
         * ================================
         * checkout.session.completed
         * ================================
         */
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const fanId = session.metadata?.fanId;
            const artistId = session.metadata?.artistId;
            const planId = session.metadata?.planId;
            const stripeSubscriptionId = session.subscription;
            const stripeCustomerId = session.customer;
            if (!fanId || !artistId || !planId || !stripeSubscriptionId) {
                console.warn("checkout.session.completed missing metadata");
                res.status(200).send("OK");
                return;
            }
            const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
            const dbStatus = toDbStatus(subscription.status);
            const endDate = new Date((await getCurrentPeriodEndSeconds(stripe, stripeSubscriptionId)) *
                1000);
            const unitAmount = subscription.items.data[0]?.price?.unit_amount ?? 0;
            const price = unitAmount / 100;
            const existing = await db_1.db.query.subscriptions.findFirst({
                where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.subscriptions.artistId, artistId), (0, drizzle_orm_1.eq)(schema.subscriptions.userId, fanId)),
            });
            if (existing) {
                await db_1.db
                    .update(schema.subscriptions)
                    .set({
                    status: dbStatus,
                    endDate,
                    planId,
                    price,
                    stripeCustomerId: stripeCustomerId ?? undefined,
                    stripeSubscriptionId,
                    stripeCheckoutSessionId: session.id,
                })
                    .where((0, drizzle_orm_1.eq)(schema.subscriptions.id, existing.id));
            }
            else {
                await db_1.db.insert(schema.subscriptions).values({
                    id: (0, nanoid_1.nanoid)(),
                    artistId,
                    userId: fanId,
                    planId,
                    status: dbStatus,
                    startDate: new Date(),
                    endDate,
                    price,
                    currency: "EUR",
                    autoRenew: true,
                    stripeCustomerId: stripeCustomerId ?? undefined,
                    stripeSubscriptionId,
                    stripeCheckoutSessionId: session.id,
                });
            }
            res.status(200).send("OK");
            return;
        }
        /**
         * ================================
         * customer.subscription.updated
         * ================================
         */
        if (event.type === "customer.subscription.updated") {
            const subscription = event.data.object;
            const dbStatus = toDbStatus(subscription.status);
            const endDate = new Date((await getCurrentPeriodEndSeconds(stripe, subscription.id)) * 1000);
            await db_1.db
                .update(schema.subscriptions)
                .set({
                status: dbStatus,
                endDate,
            })
                .where((0, drizzle_orm_1.eq)(schema.subscriptions.stripeSubscriptionId, subscription.id));
            res.status(200).send("OK");
            return;
        }
        /**
         * ================================
         * customer.subscription.deleted
         * ================================
         */
        if (event.type === "customer.subscription.deleted") {
            const subscription = event.data.object;
            await db_1.db
                .update(schema.subscriptions)
                .set({
                status: "cancelled",
                endDate: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema.subscriptions.stripeSubscriptionId, subscription.id));
            res.status(200).send("OK");
            return;
        }
        res.status(200).send("Unhandled event");
    }
    catch (err) {
        console.error("Stripe webhook processing error:", err);
        res.status(500).send("Webhook handler failed");
    }
};
