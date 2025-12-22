import Stripe from "stripe";
import { eq, and } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";

type BillingCycle = "monthly" | "quarterly" | "annual";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: "2025-08-27.basil" });

function assertCycle(cycle: any): cycle is BillingCycle {
  return cycle === "monthly" || cycle === "quarterly" || cycle === "annual";
}

function toStripeRecurring(cycle: BillingCycle): {
  interval: "month" | "year";
  interval_count: number;
} {
  if (cycle === "monthly") return { interval: "month", interval_count: 1 };
  if (cycle === "quarterly") return { interval: "month", interval_count: 3 };
  return { interval: "year", interval_count: 1 };
}

function toStripeCurrency(currency: string): string {
  // Stripe wants lowercase currency codes
  return String(currency || "EUR").toLowerCase();
}

function toMinorUnits(amount: number): number {
  // EUR has 2 decimals -> cents
  return Math.round(amount * 100);
}

async function ensureStripeForPlan(params: {
  artistId: string;
  planId: string;
  planName: string;
  description?: string | null;
  currency: string;
  unitAmount: number; // major units
  billingCycle: BillingCycle;
  existingStripeProductId?: string | null;
  existingStripePriceId?: string | null;
}) {
  const {
    artistId,
    planId,
    planName,
    description,
    currency,
    unitAmount,
    billingCycle,
    existingStripeProductId,
  } = params;

  // 1) Product
  let stripeProductId = existingStripeProductId ?? null;

  if (!stripeProductId) {
    const product = await stripe.products.create({
      name: `${planName} (${billingCycle})`,
      description: description ?? undefined,
      metadata: { artistId, planId, billingCycle },
    });
    stripeProductId = product.id;
  } else {
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

export class PlanController {
  /**
   * ✅ Create a plan for the logged-in artist + create Stripe product/price
   * Route: POST /plan/create
   */
  static create: RequestHandler = async (req, res) => {
    try {
      const artistId = (req as any).user?.id as string | undefined;
      if (!artistId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const artist = await db.query.users.findFirst({
        where: eq(schema.users.id, artistId),
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

      const { name, description, price, billingCycle, currency, active } =
        req.body;

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

      // unique(artistId, billingCycle)
      const existing = await db.query.plans.findFirst({
        where: and(
          eq(schema.plans.artistId, artistId),
          eq(schema.plans.billingCycle, billingCycle)
        ),
      });

      if (existing) {
        res.status(409).json({
          message:
            "A plan for this billingCycle already exists for this artist",
        });
        return;
      }

      const planCurrency = (currency ?? "EUR").toUpperCase();

      // 1) Create plan row first
      const [createdId] = await db
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

      // 2) Create Stripe product/price and store ids
      const stripeData = await ensureStripeForPlan({
        artistId,
        planId: createdId.id,
        planName: String(name),
        description: description ?? null,
        currency: planCurrency,
        unitAmount: numericPrice,
        billingCycle,
      });

      await db
        .update(schema.plans)
        .set({
          stripeProductId: stripeData.stripeProductId,
          stripePriceId: stripeData.stripePriceId,
        } as any)
        .where(eq(schema.plans.id, createdId.id));

      const createdPlan = await db.query.plans.findFirst({
        where: eq(schema.plans.id, createdId.id),
      });

      res.status(201).json({
        message: "Plan created successfully",
        data: createdPlan,
      });
    } catch (error: any) {
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
  static FindPlansByArtistId: RequestHandler<{ artistId: string }> = async (
    req,
    res
  ) => {
    try {
      const { artistId } = req.params;

      if (!artistId) {
        res.status(400).json({ message: "Missing artistId" });
        return;
      }

      const artist = await db.query.users.findFirst({
        where: eq(schema.users.id, artistId),
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

      const activeOnly =
        req.query.activeOnly === undefined
          ? true
          : String(req.query.activeOnly) === "true";

      const plans = await db.query.plans.findMany({
        where: activeOnly
          ? and(
              eq(schema.plans.artistId, artistId),
              eq(schema.plans.active, true)
            )
          : eq(schema.plans.artistId, artistId),
      });

      const order: Record<string, number> = {
        monthly: 1,
        quarterly: 2,
        annual: 3,
      };

      const sorted = [...plans].sort(
        (a: any, b: any) =>
          (order[a.billingCycle] ?? 99) - (order[b.billingCycle] ?? 99)
      );

      res.status(200).json({
        message: "Plans fetched successfully",
        data: sorted,
      });
    } catch (error: any) {
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
  static FindPlans: RequestHandler = async (_req, res) => {
    try {
      const allPlans = await db.select().from(schema.plans);
      res.status(200).json({
        message: "Plans fetched successfully",
        data: allPlans,
      });
    } catch (error: any) {
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
  static FindMyPlans: RequestHandler = async (req, res) => {
    try {
      const artistId = (req as any).user?.id as string | undefined;
      if (!artistId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const plans = await db.query.plans.findMany({
        where: eq(schema.plans.artistId, artistId),
      });

      res.status(200).json({
        message: "Artist plans fetched successfully",
        data: plans,
      });
    } catch (error: any) {
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
  static FindPlanById: RequestHandler<{ id: string }> = async (req, res) => {
    try {
      const { id } = req.params;

      const plan = await db.query.plans.findFirst({
        where: eq(schema.plans.id, id),
      });

      if (!plan) {
        res.status(404).json({ error: "Plan not found" });
        return;
      }

      res
        .status(200)
        .json({ message: "Plan fetched successfully", data: plan });
    } catch (error: any) {
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
  static UpdatePlan: RequestHandler<{ id: string }> = async (req, res) => {
    try {
      const artistId = (req as any).user?.id as string | undefined;
      if (!artistId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { id } = req.params;

      const existingPlan = await db.query.plans.findFirst({
        where: eq(schema.plans.id, id),
      });

      if (!existingPlan) {
        res.status(404).json({ error: "Plan not found" });
        return;
      }

      if (existingPlan.artistId !== artistId) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      const { name, description, price, billingCycle, currency, active } =
        req.body;

      const updatedFields: Partial<typeof schema.plans.$inferInsert> = {};

      const nextName = name !== undefined ? String(name) : existingPlan.name;
      const nextDesc =
        description !== undefined
          ? (description ?? null)
          : (existingPlan.description ?? null);

      let nextCurrency = existingPlan.currency;
      if (currency !== undefined) nextCurrency = String(currency).toUpperCase();

      let nextCycle = existingPlan.billingCycle as BillingCycle;
      if (billingCycle !== undefined) {
        if (!assertCycle(billingCycle)) {
          res.status(400).json({ message: "Invalid billingCycle" });
          return;
        }

        // unique(artistId, billingCycle)
        const conflict = await db.query.plans.findFirst({
          where: and(
            eq(schema.plans.artistId, artistId),
            eq(schema.plans.billingCycle, billingCycle)
          ),
        });
        if (conflict && conflict.id !== id) {
          res.status(409).json({
            message:
              "A plan with this billingCycle already exists for this artist",
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

      if (name !== undefined) updatedFields.name = String(name);
      if (description !== undefined)
        updatedFields.description = description ?? null;
      if (currency !== undefined) updatedFields.currency = nextCurrency;
      if (typeof active === "boolean") updatedFields.active = active;

      // If any stripe-relevant fields changed, recreate price
      const cycleChanged = billingCycle !== undefined;
      const currencyChanged = currency !== undefined;

      if (
        priceChanged ||
        cycleChanged ||
        currencyChanged ||
        name !== undefined ||
        description !== undefined
      ) {
        const stripeData = await ensureStripeForPlan({
          artistId,
          planId: existingPlan.id,
          planName: nextName,
          description: nextDesc,
          currency: nextCurrency,
          unitAmount: nextPrice,
          billingCycle: nextCycle,
          existingStripeProductId:
            (existingPlan as any).stripeProductId ?? null,
          existingStripePriceId: (existingPlan as any).stripePriceId ?? null,
        });

        (updatedFields as any).stripeProductId = stripeData.stripeProductId;
        (updatedFields as any).stripePriceId = stripeData.stripePriceId;
      }

      await db
        .update(schema.plans)
        .set(updatedFields)
        .where(eq(schema.plans.id, id));

      const updatedPlan = await db.query.plans.findFirst({
        where: eq(schema.plans.id, id),
      });

      res.status(200).json({
        message: "Plan updated successfully",
        data: updatedPlan,
      });
    } catch (error: any) {
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
  static DeletePlan: RequestHandler<{ id: string }> = async (req, res) => {
    try {
      const artistId = (req as any).user?.id as string | undefined;
      if (!artistId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { id } = req.params;

      const existingPlan = await db.query.plans.findFirst({
        where: eq(schema.plans.id, id),
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
      await db.delete(schema.plans).where(eq(schema.plans.id, id));

      res.status(200).json({ message: "Plan deleted successfully" });
    } catch (error: any) {
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
  static UpsertMyPricing: RequestHandler = async (req, res) => {
    try {
      const artistId = (req as any).user?.id as string | undefined;
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

      const upsert = async (billingCycle: BillingCycle, price: number) => {
        const existing = await db.query.plans.findFirst({
          where: and(
            eq(schema.plans.artistId, artistId),
            eq(schema.plans.billingCycle, billingCycle)
          ),
        });

        if (!existing) {
          const [createdId] = await db
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

            await db
              .update(schema.plans)
              .set({
                stripeProductId: stripeData.stripeProductId,
                stripePriceId: stripeData.stripePriceId,
              } as any)
              .where(eq(schema.plans.id, createdId.id));
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
          existingStripeProductId: (existing as any).stripeProductId ?? null,
          existingStripePriceId: (existing as any).stripePriceId ?? null,
        });

        await db
          .update(schema.plans)
          .set({
            price: price.toFixed(2),
            currency,
            active: true,
            stripeProductId: stripeData.stripeProductId,
            stripePriceId: stripeData.stripePriceId,
          } as any)
          .where(eq(schema.plans.id, existing.id));
      };

      await upsert("monthly", monthly);
      await upsert("quarterly", quarterly);
      await upsert("annual", annual);

      // return updated plans
      const plans = await db.query.plans.findMany({
        where: eq(schema.plans.artistId, artistId),
      });

      res.status(200).json({
        message: "Pricing updated successfully",
        data: plans,
      });
    } catch (err: any) {
      console.error("UpsertMyPricing error:", err);
      res.status(500).json({
        message: "Failed to update pricing",
        details: err?.message ?? String(err),
      });
    }
  };
}
