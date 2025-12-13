import { eq, and } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";

type BillingCycle = "monthly" | "quarterly" | "annual";

export class PlanController {
  /**
   * ✅ Create a plan for the logged-in artist
   * Route: POST /plan/create
   */
  static create: RequestHandler = async (req, res) => {
    try {
      const artistId = (req as any).user?.id as string | undefined;
      if (!artistId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Optional: check user is artist
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

      const cycle = billingCycle as BillingCycle;
      if (!["monthly", "quarterly", "annual"].includes(cycle)) {
        res.status(400).json({ message: "Invalid billingCycle" });
        return;
      }

      const numericPrice = Number(price);
      if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        res.status(400).json({ message: "Invalid price" });
        return;
      }

      // ⚠️ unique(artistId, billingCycle) => on évite doublon
      const existing = await db.query.plans.findFirst({
        where: and(
          eq(schema.plans.artistId, artistId),
          eq(schema.plans.billingCycle, cycle)
        ),
      });

      if (existing) {
        res.status(409).json({
          message:
            "A plan for this billingCycle already exists for this artist",
        });
        return;
      }

      const [created] = await db
        .insert(schema.plans)
        .values({
          artistId,
          name,
          description: description ?? null,
          price: numericPrice.toFixed(2),
          currency: (currency ?? "EUR").toUpperCase(),
          billingCycle: cycle,
          active: typeof active === "boolean" ? active : true,
        })
        .$returningId();

      res.status(201).json({
        message: "Plan created successfully",
        data: created,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create plan" });
    }
  };

  /**
   * ✅ Get all plans (admin/debug)
   */
  static FindPlans: RequestHandler = async (_req, res) => {
    try {
      const allPlans = await db.select().from(schema.plans);
      res
        .status(200)
        .json({ message: "Plans fetched successfully", data: allPlans });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plans" });
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
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch artist plans" });
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
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plan" });
    }
  };

  /**
   * ✅ Update a plan (only owner artist ideally)
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

      // 🔒 Optionnel: empêcher update si ce n’est pas le propriétaire
      if (existingPlan.artistId !== artistId) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      const { name, description, price, billingCycle, currency, active } =
        req.body;

      const updatedFields: Partial<typeof schema.plans.$inferInsert> = {};

      if (name !== undefined) updatedFields.name = name;
      if (description !== undefined) updatedFields.description = description;

      if (price !== undefined) {
        const numericPrice = Number(price);
        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
          res.status(400).json({ message: "Invalid price" });
          return;
        }
        updatedFields.price = numericPrice.toFixed(2);
      }

      if (currency !== undefined)
        updatedFields.currency = String(currency).toUpperCase();

      if (billingCycle !== undefined) {
        const cycle = billingCycle as BillingCycle;
        if (!["monthly", "quarterly", "annual"].includes(cycle)) {
          res.status(400).json({ message: "Invalid billingCycle" });
          return;
        }

        // ⚠️ vérifier unique(artistId, billingCycle) si cycle change
        const conflict = await db.query.plans.findFirst({
          where: and(
            eq(schema.plans.artistId, artistId),
            eq(schema.plans.billingCycle, cycle)
          ),
        });

        if (conflict && conflict.id !== id) {
          res.status(409).json({
            message:
              "A plan with this billingCycle already exists for this artist",
          });
          return;
        }

        updatedFields.billingCycle = cycle;
      }

      if (typeof active === "boolean") updatedFields.active = active;

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
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update plan" });
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

      await db.delete(schema.plans).where(eq(schema.plans.id, id));

      res.status(200).json({ message: "Plan deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete plan" });
    }
  };

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

      const monthly = monthlyPrice;
      const quarterly = monthlyPrice * 4;
      const annual = monthlyPrice * 12;

      const currency = "EUR";

      // helper upsert par cycle
      const upsert = async (
        billingCycle: "monthly" | "quarterly" | "annual",
        price: number
      ) => {
        const existing = await db.query.plans.findFirst({
          where: and(
            eq(schema.plans.artistId, artistId),
            eq(schema.plans.billingCycle, billingCycle)
          ),
        });

        if (!existing) {
          await db.insert(schema.plans).values({
            artistId,
            name: billingCycle[0].toUpperCase() + billingCycle.slice(1),
            description: null,
            billingCycle,
            price: price.toFixed(2),
            currency,
            active: true,
          });
        } else {
          await db
            .update(schema.plans)
            .set({
              price: price.toFixed(2),
              currency,
              active: true,
            })
            .where(eq(schema.plans.id, existing.id));
        }
      };

      await upsert("monthly", monthly);
      await upsert("quarterly", quarterly);
      await upsert("annual", annual);

      res.status(200).json({
        message: "Pricing updated successfully",
        data: {
          monthlyPrice: monthly.toFixed(2),
          quarterlyPrice: quarterly.toFixed(2),
          annualPrice: annual.toFixed(2),
          currency,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update pricing" });
    }
  };
}
