import Stripe from "stripe";
import { RequestHandler } from "express";
import { and, eq, gt } from "drizzle-orm";
import { db } from "../db/db";
import * as schema from "../db/schema";

/**
 * STRIPE SETUP
 */
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-08-27.basil", // ✅ stable official version
});

/**
 * Helpers
 */
function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

function toDbStatus(stripeStatus: Stripe.Subscription.Status): string {
  // Map Stripe status to your DB status
  // Stripe: active, trialing, past_due, canceled, unpaid, incomplete, incomplete_expired, paused
  if (stripeStatus === "active" || stripeStatus === "trialing") return "active";
  if (stripeStatus === "canceled") return "cancelled";
  if (stripeStatus === "past_due" || stripeStatus === "unpaid")
    return "past_due";
  return "pending";
}

function getCurrentPeriodEndSeconds(sub: unknown): number {
  const v = (sub as any)?.current_period_end;
  if (typeof v !== "number") {
    throw new Error("Stripe subscription missing current_period_end");
  }
  return v;
}

export class StripeController {
  /**
   * POST /stripe/checkout/subscription
   * Auth required (fan)
   * body: { artistId: string, planId: string }
   *
   * Creates a Stripe Checkout session in subscription mode.
   * Redirect user to session.url.
   */
  static createSubscriptionCheckoutSession: RequestHandler = async (
    req,
    res
  ) => {
    try {
      const fanId = (req as any).user?.id as string | undefined;
      if (!fanId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }

      const { artistId, planId } = req.body as {
        artistId?: string;
        planId?: string;
      };

      if (!artistId || !planId) {
        res.status(400).send({ message: "Missing artistId or planId" });
        return;
      }

      // 1) Ensure artist exists (artist == users.type='artist' in your logic)
      const artist = await db.query.users.findFirst({
        where: eq(schema.users.id, artistId),
      });
      if (!artist || artist.type !== "artist") {
        res.status(404).send({ message: "Artist not found" });
        return;
      }

      // 2) Load plan -> stripePriceId
      const plan = await db.query.plans.findFirst({
        where: eq(schema.plans.id, planId),
      });
      if (!plan || !(plan as any).stripePriceId) {
        res
          .status(404)
          .send({ message: "Plan not found or missing stripePriceId" });
        return;
      }

      const stripePriceId = (plan as any).stripePriceId as string;

      // 3) Load fan + ensure Stripe customer exists
      const fan = await db.query.users.findFirst({
        where: eq(schema.users.id, fanId),
      });
      if (!fan) {
        res.status(404).send({ message: "Fan not found" });
        return;
      }

      let stripeCustomerId = (fan as any).stripeCustomerId as string | null;

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: fan.email ?? undefined,
          metadata: { fanId },
        });
        stripeCustomerId = customer.id;

        await db
          .update(schema.users)
          .set({ stripeCustomerId } as any)
          .where(eq(schema.users.id, fanId));
      }

      // 4) Optional: prevent duplicate active subscription (fan+artist)
      // If you want strict "one active sub per artist", check DB before creating session
      const now = new Date();
      const existing = await db.query.subscriptions.findFirst({
        where: and(
          eq(schema.subscriptions.artistId, artistId),
          eq(schema.subscriptions.userId, fanId),
          eq(schema.subscriptions.status, "active"),
          gt(schema.subscriptions.endDate, now)
        ),
      });
      if (existing) {
        res.status(200).send({
          message: "Already subscribed",
          data: { isSubscribed: true },
        });
        return;
      }

      // 5) Create checkout session (subscription mode)
      const FRONT_URL = getEnv("FRONT_URL");

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: stripeCustomerId,
        line_items: [{ price: stripePriceId, quantity: 1 }],
        success_url: `${FRONT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${FRONT_URL}/payment-cancel`,
        // IMPORTANT: keep metadata for webhook -> DB sync
        metadata: {
          fanId,
          artistId,
          planId,
        },
      });

      res.status(200).send({
        message: "Checkout session created",
        data: { url: session.url },
      });
    } catch (err: any) {
      console.error("StripeController.createSubscriptionCheckoutSession:", err);
      res.status(500).send({
        message: "Internal server error",
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
  static createCustomerPortalSession: RequestHandler = async (req, res) => {
    try {
      const fanId = (req as any).user?.id as string | undefined;
      if (!fanId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }

      const fan = await db.query.users.findFirst({
        where: eq(schema.users.id, fanId),
      });
      if (!fan) {
        res.status(404).send({ message: "Fan not found" });
        return;
      }

      const stripeCustomerId = (fan as any).stripeCustomerId as string | null;
      if (!stripeCustomerId) {
        res
          .status(400)
          .send({ message: "Stripe customer not found for this user" });
        return;
      }

      const FRONT_URL = getEnv("FRONT_URL");
      const returnUrl =
        (req.body?.returnUrl as string) || `${FRONT_URL}/account`;

      const portal = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: returnUrl,
      });

      res.status(200).send({
        message: "Portal session created",
        data: { url: portal.url },
      });
    } catch (err: any) {
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
  static cancelSubscriptionForArtist: RequestHandler<{ artistId: string }> =
    async (req, res) => {
      try {
        const fanId = (req as any).user?.id as string | undefined;
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

        const sub = await db.query.subscriptions.findFirst({
          where: and(
            eq(schema.subscriptions.artistId, artistId),
            eq(schema.subscriptions.userId, fanId),
            eq(schema.subscriptions.status, "active"),
            gt(schema.subscriptions.endDate, now)
          ),
        });

        if (!sub || !(sub as any).stripeSubscriptionId) {
          res.status(404).send({ message: "Active subscription not found" });
          return;
        }

        const stripeSubscriptionId = (sub as any)
          .stripeSubscriptionId as string;

        // Choose behavior:
        // A) Cancel immediately:
        // const cancelled = await stripe.subscriptions.cancel(stripeSubscriptionId);

        // B) Cancel at period end (recommended UX):
        const cancelled = (await stripe.subscriptions.update(
          stripeSubscriptionId,
          {
            cancel_at_period_end: true,
          }
        )) as Stripe.Subscription;

        // Update DB right away (webhook will also sync)
        await db
          .update(schema.subscriptions)
          .set({
            status: "cancelled",
            endDate: new Date(getCurrentPeriodEndSeconds(cancelled) * 1000),
          } as any)
          .where(eq(schema.subscriptions.id, (sub as any).id));

        res.status(200).send({
          message: "Subscription cancelled",
          data: { isSubscribed: false },
        });
      } catch (err: any) {
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
  static handleWebhook: RequestHandler = async (req, res) => {
    const sig = req.headers["stripe-signature"] as string | undefined;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      res.status(400).send("Missing Stripe signature or webhook secret.");
      return;
    }

    let event: Stripe.Event;

    try {
      // req.body MUST be raw buffer here
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error(
        "Stripe webhook signature verification failed:",
        err?.message
      );
      res.status(400).send(`Webhook Error: ${err?.message ?? String(err)}`);
      return;
    }

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const fanId = session.metadata?.fanId;
        const artistId = session.metadata?.artistId;
        const planId = session.metadata?.planId;

        const stripeSubscriptionId = session.subscription as string | null;
        const stripeCustomerId = session.customer as string | null;

        if (!fanId || !artistId || !planId || !stripeSubscriptionId) {
          console.warn(
            "checkout.session.completed missing metadata/subscription id"
          );
          res.status(200).send("OK");
          return;
        }

        // Fetch subscription to get status + period end
        const sub = (await stripe.subscriptions.retrieve(
          stripeSubscriptionId
        )) as Stripe.Subscription;
        sub.cancel_at_period_end;
        const dbStatus = toDbStatus(sub.status);
        const endDate = new Date(getCurrentPeriodEndSeconds(sub) * 1000);

        // Option: compute price from Stripe subscription item
        const unitAmount = sub.items.data[0]?.price?.unit_amount;
        const price = unitAmount ? unitAmount / 100 : 0;

        // Upsert by (fanId, artistId)
        const existing = await db.query.subscriptions.findFirst({
          where: and(
            eq(schema.subscriptions.artistId, artistId),
            eq(schema.subscriptions.userId, fanId)
          ),
        });
        if (existing) {
          await db
            .update(schema.subscriptions)
            .set({
              status: dbStatus,
              endDate,
              planId,
              price,
              stripeCustomerId: stripeCustomerId ?? undefined,
              stripeSubscriptionId,
              stripeCheckoutSessionId: session.id,
            } as any)
            .where(eq(schema.subscriptions.id, (existing as any).id));
        } else {
          await db.insert(schema.subscriptions).values({
            artistId,
            userId: fanId,
            planId,
            status: dbStatus,
            endDate,
            price,
            stripeCustomerId: stripeCustomerId ?? undefined,
            stripeSubscriptionId,
            stripeCheckoutSessionId: session.id,
            createdAt: new Date(),
          } as any);
        }

        res.status(200).send("OK");
        return;
      }

      if (event.type === "customer.subscription.updated") {
        const sub = event.data.object as unknown as Stripe.Subscription;

        const dbStatus = toDbStatus(sub.status);
        const endDate = new Date(getCurrentPeriodEndSeconds(sub) * 1000);

        await db
          .update(schema.subscriptions)
          .set({
            status: dbStatus,
            endDate,
          } as any)
          .where(eq(schema.subscriptions.stripeSubscriptionId as any, sub.id));

        res.status(200).send("OK");
        return;
      }

      if (event.type === "customer.subscription.deleted") {
        const sub = event.data.object as Stripe.Subscription;

        await db
          .update(schema.subscriptions)
          .set({
            status: "cancelled",
            endDate: new Date(),
          } as any)
          .where(eq(schema.subscriptions.stripeSubscriptionId as any, sub.id));

        res.status(200).send("OK");
        return;
      }

      // Unhandled events should still return 200
      res.status(200).send("Unhandled event");
    } catch (err: any) {
      console.error("Stripe webhook processing error:", err);
      res.status(500).send("Webhook handler failed");
      return;
    }
  };
}
