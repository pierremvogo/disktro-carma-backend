import { eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { Plan } from "../models";

export class PlanController {
  static create: RequestHandler = async (req, res, next) => {
    try {
      const { name, description, price, billingCycle } = req.body;
      if (!name || !price || !billingCycle) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      const [plan] = await db
        .insert(schema.plans)
        .values({
          name,
          description,
          price,
          billingCycle,
        })
        .$returningId();
      res
        .status(201)
        .json({ message: "Plan d'abonnement créer avec succes", data: plan });
    } catch (error) {
      res.status(500).json({ error: "Failed to create plan" });
      return;
    }
  };

  static FindPlans: RequestHandler = async (req, res, next) => {
    try {
      const allPlans = await db.select().from(schema.plans);
      res.status(200).json(allPlans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  };

  static FindPlanById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const { id } = req.params;
      const [plan] = await db
        .select()
        .from(schema.plans)
        .where(eq(schema.plans.id, id));
      if (!plan) {
        res.status(404).json({ error: "Plan not found" });
        return;
      }
      res.status(200).json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plan" });
      return;
    }
  };

  static UpdatePlan: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description, price, billingCycle } = req.body;
      const updatedFields: Partial<typeof schema.plans.$inferInsert> = {};

      if (name !== undefined) updatedFields.name = name;
      if (description !== undefined) updatedFields.description = description;
      if (price !== undefined) updatedFields.price = price;
      if (billingCycle !== undefined) updatedFields.billingCycle = billingCycle;

      // Update
      await db
        .update(schema.plans)
        .set(updatedFields)
        .where(eq(schema.plans.id, id));

      // Check if plan exists
      const [updatedPlan] = await db
        .select()
        .from(schema.plans)
        .where(eq(schema.plans.id, id));

      if (!updatedPlan) {
        res.status(404).json({ error: "Plan not found" });
        return;
      }

      res
        .status(200)
        .json({ message: "Plan updated successfully", data: updatedPlan });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update plan" });
    }
  };
  static DeletePlan: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const { id } = req.params;

      // Vérifier que le plan existe
      const [existingPlan] = await db
        .select()
        .from(schema.plans)
        .where(eq(schema.plans.id, id));

      if (!existingPlan) {
        res.status(404).json({ error: "Plan not found" });
        return;
      }

      // Supprimer le plan
      await db.delete(schema.plans).where(eq(schema.plans.id, id));

      res.status(200).json({ message: "Plan deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete plan" });
    }
  };
}
