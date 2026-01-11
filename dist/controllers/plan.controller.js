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
exports.PlanController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
}
const stripe = new stripe_1.default(stripeSecretKey, { apiVersion: "2025-08-27.basil" });
function assertCycle(cycle) {
    return cycle === "monthly" || cycle === "quarterly" || cycle === "annual";
}
function toStripeRecurring(cycle) {
    if (cycle === "monthly")
        return { interval: "month", interval_count: 1 };
    if (cycle === "quarterly")
        return { interval: "month", interval_count: 3 };
    return { interval: "year", interval_count: 1 };
}
function toStripeCurrency(currency) {
    // Stripe wants lowercase currency codes
    return String(currency || "EUR").toLowerCase();
}
function toMinorUnits(amount) {
    // EUR has 2 decimals -> cents
    return Math.round(amount * 100);
}
async function ensureStripeForPlan(params) {
    const { artistId, planId, planName, description, currency, unitAmount, billingCycle, existingStripeProductId, } = params;
    // 1) Product
    let stripeProductId = existingStripeProductId ?? null;
    if (!stripeProductId) {
        const product = await stripe.products.create({
            name: `${planName} (${billingCycle})`,
            description: description ?? undefined,
            metadata: { artistId, planId, billingCycle },
        });
        stripeProductId = product.id;
    }
    else {
        // Optionnel : sync name/description
        await stripe.products.update(stripeProductId, {
            name: `${planName} (${billingCycle})`,
            description: description ?? undefined,
            metadata: { artistId, planId, billingCycle },
        });
    }
    // 2) Price (Stripe prices are immutable -> create new on any change)
    const recurring = toStripeRecurring(billingCycle);
    const price = await stripe.prices.create({
        currency: toStripeCurrency(currency),
        unit_amount: toMinorUnits(unitAmount),
        recurring,
        product: stripeProductId,
        metadata: { artistId, planId, billingCycle },
    });
    return { stripeProductId, stripePriceId: price.id };
}
class PlanController {
}
exports.PlanController = PlanController;
_a = PlanController;
/**
 * ✅ Create a plan for the logged-in artist + create Stripe product/price
 * Route: POST /plan/create
 */
PlanController.create = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const artist = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, artistId),
            columns: { type: true },
        });
        if (!artist) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (artist.type !== "artist") {
            res.status(403).json({ message: "Only artists can create plans" });
            return;
        }
        const { name, description, price, billingCycle, currency, active } = req.body;
        if (!name || price === undefined || !billingCycle) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        if (!assertCycle(billingCycle)) {
            res.status(400).json({ message: "Invalid billingCycle" });
            return;
        }
        const numericPrice = Number(price);
        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
            res.status(400).json({ message: "Invalid price" });
            return;
        }
        // Vérifie unicité du plan pour cet artist + billingCycle
        const existing = await db_1.db.query.plans.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.plans.artistId, artistId), (0, drizzle_orm_1.eq)(schema.plans.billingCycle, billingCycle)),
        });
        if (existing) {
            res.status(409).json({
                message: "A plan for this billingCycle already exists for this artist",
            });
            return;
        }
        const planCurrency = (currency ?? "EUR").toUpperCase();
        // 1) Crée le plan en DB
        const [createdId] = await db_1.db
            .insert(schema.plans)
            .values({
            artistId,
            name: String(name),
            description: description ?? null,
            price: numericPrice.toFixed(2),
            currency: planCurrency,
            billingCycle,
            active: typeof active === "boolean" ? active : true,
        })
            .$returningId();
        if (!createdId?.id) {
            res.status(400).json({ message: "Failed to create plan" });
            return;
        }
        // 2) Crée le produit Stripe
        const product = await stripe.products.create({
            name: String(name),
            description: description ?? undefined,
            metadata: { planId: createdId.id, artistId },
        });
        // 3) Crée le prix Stripe
        const interval = billingCycle === "monthly" ? "month" : "year"; // adapter si tu as d'autres cycles
        const priceStripe = await stripe.prices.create({
            product: product.id,
            unit_amount: Math.round(numericPrice * 100), // Stripe attend en cents
            currency: planCurrency.toLowerCase(),
            recurring: { interval },
            metadata: { planId: createdId.id, artistId },
        });
        // 4) Mets à jour le plan DB avec les IDs Stripe
        await db_1.db
            .update(schema.plans)
            .set({
            stripeProductId: product.id,
            stripePriceId: priceStripe.id,
        })
            .where((0, drizzle_orm_1.eq)(schema.plans.id, createdId.id));
        const createdPlan = await db_1.db.query.plans.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.plans.id, createdId.id),
        });
        res.status(201).json({
            message: "Plan created successfully",
            data: createdPlan,
        });
    }
    catch (error) {
        console.error("PlanController.create error:", error);
        res.status(500).json({
            error: "Failed to create plan",
            details: error?.message ?? String(error),
        });
    }
};
/**
 * ✅ Get plans for a specific artist (fan side)
 * Route: GET /plan/artist/:artistId?activeOnly=true
 */
PlanController.FindPlansByArtistId = async (req, res) => {
    try {
        const { artistId } = req.params;
        if (!artistId) {
            res.status(400).json({ message: "Missing artistId" });
            return;
        }
        const artist = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, artistId),
            columns: { id: true, type: true },
        });
        if (!artist) {
            res.status(404).json({ message: "Artist not found" });
            return;
        }
        if (artist.type !== "artist") {
            res.status(403).json({ message: "User is not an artist" });
            return;
        }
        const activeOnly = req.query.activeOnly === undefined
            ? true
            : String(req.query.activeOnly) === "true";
        const plans = await db_1.db.query.plans.findMany({
            where: activeOnly
                ? (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.plans.artistId, artistId), (0, drizzle_orm_1.eq)(schema.plans.active, true))
                : (0, drizzle_orm_1.eq)(schema.plans.artistId, artistId),
        });
        const order = {
            monthly: 1,
            quarterly: 2,
            annual: 3,
        };
        const sorted = [...plans].sort((a, b) => (order[a.billingCycle] ?? 99) - (order[b.billingCycle] ?? 99));
        res.status(200).json({
            message: "Plans fetched successfully",
            data: sorted,
        });
    }
    catch (error) {
        console.error("FindPlansByArtistId error:", error);
        res.status(500).json({
            error: "Failed to fetch artist plans",
            details: error?.message ?? String(error),
        });
    }
};
/**
 * ✅ Get all plans (admin/debug)
 */
PlanController.FindPlans = async (_req, res) => {
    try {
        const allPlans = await db_1.db.select().from(schema.plans);
        res.status(200).json({
            message: "Plans fetched successfully",
            data: allPlans,
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to fetch plans",
            details: error?.message ?? String(error),
        });
    }
};
/**
 * ✅ Get plans for logged-in artist
 * Route: GET /plan/artist/me
 */
PlanController.FindMyPlans = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const plans = await db_1.db.query.plans.findMany({
            where: (0, drizzle_orm_1.eq)(schema.plans.artistId, artistId),
        });
        res.status(200).json({
            message: "Artist plans fetched successfully",
            data: plans,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch artist plans",
            details: error?.message ?? String(error),
        });
    }
};
/**
 * ✅ Get a plan by id
 */
PlanController.FindPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await db_1.db.query.plans.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.plans.id, id),
        });
        if (!plan) {
            res.status(404).json({ error: "Plan not found" });
            return;
        }
        res
            .status(200)
            .json({ message: "Plan fetched successfully", data: plan });
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to fetch plan",
            details: error?.message ?? String(error),
        });
    }
};
/**
 * ✅ Update a plan + recreate Stripe price if price/cycle/currency changed
 * Route: PUT /plan/update/:id
 */
PlanController.UpdatePlan = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { id } = req.params;
        const existingPlan = await db_1.db.query.plans.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.plans.id, id),
        });
        if (!existingPlan) {
            res.status(404).json({ error: "Plan not found" });
            return;
        }
        if (existingPlan.artistId !== artistId) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        const { name, description, price, billingCycle, currency, active, stripeProductId, // ✅ NEW
        stripePriceId, // ✅ NEW
         } = req.body;
        const updatedFields = {};
        // ✅ allow manual stripe ids update
        const stripeProductIdProvided = stripeProductId !== undefined &&
            stripeProductId !== null &&
            String(stripeProductId).trim() !== "";
        const stripePriceIdProvided = stripePriceId !== undefined &&
            stripePriceId !== null &&
            String(stripePriceId).trim() !== "";
        if (stripeProductIdProvided)
            updatedFields.stripeProductId = String(stripeProductId);
        if (stripePriceIdProvided)
            updatedFields.stripePriceId = String(stripePriceId);
        const nextName = name !== undefined ? String(name) : existingPlan.name;
        const nextDesc = description !== undefined
            ? (description ?? null)
            : (existingPlan.description ?? null);
        let nextCurrency = existingPlan.currency;
        if (currency !== undefined)
            nextCurrency = String(currency).toUpperCase();
        let nextCycle = existingPlan.billingCycle;
        if (billingCycle !== undefined) {
            if (!assertCycle(billingCycle)) {
                res.status(400).json({ message: "Invalid billingCycle" });
                return;
            }
            // unique(artistId, billingCycle)
            const conflict = await db_1.db.query.plans.findFirst({
                where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.plans.artistId, artistId), (0, drizzle_orm_1.eq)(schema.plans.billingCycle, billingCycle)),
            });
            if (conflict && conflict.id !== id) {
                res.status(409).json({
                    message: "A plan with this billingCycle already exists for this artist",
                });
                return;
            }
            nextCycle = billingCycle;
            updatedFields.billingCycle = billingCycle;
        }
        let nextPrice = Number(existingPlan.price);
        let priceChanged = false;
        if (price !== undefined) {
            const numericPrice = Number(price);
            if (!Number.isFinite(numericPrice) || numericPrice < 0) {
                res.status(400).json({ message: "Invalid price" });
                return;
            }
            nextPrice = numericPrice;
            updatedFields.price = numericPrice.toFixed(2);
            priceChanged = true;
        }
        if (name !== undefined)
            updatedFields.name = String(name);
        if (description !== undefined)
            updatedFields.description = description ?? null;
        if (currency !== undefined)
            updatedFields.currency = nextCurrency;
        if (typeof active === "boolean")
            updatedFields.active = active;
        // If any stripe-relevant fields changed, recreate price...
        // ✅ ...BUT only if stripe ids were NOT manually provided
        const cycleChanged = billingCycle !== undefined;
        const currencyChanged = currency !== undefined;
        const shouldRecreateStripe = !stripePriceIdProvided && // if you provide priceId manually, do NOT overwrite it
            !stripeProductIdProvided && // same for product
            (priceChanged ||
                cycleChanged ||
                currencyChanged ||
                name !== undefined ||
                description !== undefined);
        if (shouldRecreateStripe) {
            const stripeData = await ensureStripeForPlan({
                artistId,
                planId: existingPlan.id,
                planName: nextName,
                description: nextDesc,
                currency: nextCurrency,
                unitAmount: nextPrice,
                billingCycle: nextCycle,
                existingStripeProductId: existingPlan.stripeProductId ?? null,
                existingStripePriceId: existingPlan.stripePriceId ?? null,
            });
            updatedFields.stripeProductId = stripeData.stripeProductId;
            updatedFields.stripePriceId = stripeData.stripePriceId;
        }
        await db_1.db
            .update(schema.plans)
            .set(updatedFields)
            .where((0, drizzle_orm_1.eq)(schema.plans.id, id));
        const updatedPlan = await db_1.db.query.plans.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.plans.id, id),
        });
        res.status(200).json({
            message: "Plan updated successfully",
            data: updatedPlan,
        });
    }
    catch (error) {
        console.error("UpdatePlan error:", error);
        res.status(500).json({
            error: "Failed to update plan",
            details: error?.message ?? String(error),
        });
    }
};
/**
 * ✅ Delete a plan (only owner artist ideally)
 */
PlanController.DeletePlan = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { id } = req.params;
        const existingPlan = await db_1.db.query.plans.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.plans.id, id),
        });
        if (!existingPlan) {
            res.status(404).json({ error: "Plan not found" });
            return;
        }
        if (existingPlan.artistId !== artistId) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        // Optional: you may want to deactivate Stripe price/product instead of deleting
        await db_1.db.delete(schema.plans).where((0, drizzle_orm_1.eq)(schema.plans.id, id));
        res.status(200).json({ message: "Plan deleted successfully" });
    }
    catch (error) {
        console.error("DeletePlan error:", error);
        res.status(500).json({
            error: "Failed to delete plan",
            details: error?.message ?? String(error),
        });
    }
};
/**
 * ✅ Upsert pricing (monthly + quarterly + annual) + ensure Stripe for each
 * Route: POST /plan/artist/me/pricing
 */
PlanController.UpsertMyPricing = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const monthlyPrice = Number(req.body.monthlyPrice);
        if (!Number.isFinite(monthlyPrice) || monthlyPrice < 0) {
            res.status(400).json({ message: "Invalid monthlyPrice" });
            return;
        }
        // business rule: quarterly=monthly*4, annual=monthly*12
        const monthly = monthlyPrice;
        const quarterly = monthlyPrice * 4;
        const annual = monthlyPrice * 12;
        const currency = "EUR";
        const upsert = async (billingCycle, price) => {
            const existing = await db_1.db.query.plans.findFirst({
                where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.plans.artistId, artistId), (0, drizzle_orm_1.eq)(schema.plans.billingCycle, billingCycle)),
            });
            if (!existing) {
                const [createdId] = await db_1.db
                    .insert(schema.plans)
                    .values({
                    artistId,
                    name: billingCycle[0].toUpperCase() + billingCycle.slice(1),
                    description: null,
                    billingCycle,
                    price: price.toFixed(2),
                    currency,
                    active: true,
                })
                    .$returningId();
                if (createdId?.id) {
                    const stripeData = await ensureStripeForPlan({
                        artistId,
                        planId: createdId.id,
                        planName: billingCycle[0].toUpperCase() + billingCycle.slice(1),
                        description: null,
                        currency,
                        unitAmount: price,
                        billingCycle,
                    });
                    await db_1.db
                        .update(schema.plans)
                        .set({
                        stripeProductId: stripeData.stripeProductId,
                        stripePriceId: stripeData.stripePriceId,
                    })
                        .where((0, drizzle_orm_1.eq)(schema.plans.id, createdId.id));
                }
                return;
            }
            // update price/currency/active and recreate Stripe price
            const stripeData = await ensureStripeForPlan({
                artistId,
                planId: existing.id,
                planName: existing.name,
                description: existing.description ?? null,
                currency,
                unitAmount: price,
                billingCycle,
                existingStripeProductId: existing.stripeProductId ?? null,
                existingStripePriceId: existing.stripePriceId ?? null,
            });
            await db_1.db
                .update(schema.plans)
                .set({
                price: price.toFixed(2),
                currency,
                active: true,
                stripeProductId: stripeData.stripeProductId,
                stripePriceId: stripeData.stripePriceId,
            })
                .where((0, drizzle_orm_1.eq)(schema.plans.id, existing.id));
        };
        await upsert("monthly", monthly);
        await upsert("quarterly", quarterly);
        await upsert("annual", annual);
        // return updated plans
        const plans = await db_1.db.query.plans.findMany({
            where: (0, drizzle_orm_1.eq)(schema.plans.artistId, artistId),
        });
        res.status(200).json({
            message: "Pricing updated successfully",
            data: plans,
        });
    }
    catch (err) {
        console.error("UpsertMyPricing error:", err);
        res.status(500).json({
            message: "Failed to update pricing",
            details: err?.message ?? String(err),
        });
    }
};
