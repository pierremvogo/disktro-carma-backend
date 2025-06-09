import { RequestHandler } from "express";
import { db } from "../db/db";
import { subscriptions } from "../db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export class SubscriptionController {
  // Create subscription
  static CreateSubscription: RequestHandler = async (req, res) => {
    try {
      const { userId, planId, startDate, endDate, status, price, autoRenew } =
        req.body;

      const newSubscription = {
        id: nanoid(),
        userId,
        planId,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        status,
        price,
        autoRenew,
      };

      await db.insert(subscriptions).values(newSubscription);

      res.status(201).json({
        message: "Subscription created successfully",
        data: newSubscription,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  };

  // Get all subscriptions
  static GetAllSubscriptions: RequestHandler = async (_req, res) => {
    try {
      const result = await db.select().from(subscriptions);
      res
        .status(200)
        .json({ message: "All subscription get successfully", data: result });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  };

  // Get subscription by ID
  static GetSubscriptionById: RequestHandler<{ id: string }> = async (
    req,
    res
  ) => {
    try {
      const { id } = req.params;

      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, id));

      if (!subscription) {
        res.status(404).json({ error: "Subscription not found" });
        return;
      }

      res
        .status(200)
        .json({ message: "Subscription get successfully", data: subscription });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  };

  // Get subscriptions by UserId
  static GetSubscriptionsByUserId: RequestHandler<{ userId: string }> = async (
    req,
    res
  ) => {
    try {
      const { userId } = req.params;

      const result = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId));

      res
        .status(200)
        .json({ message: "Subscription get successfully", data: result });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  };

  // Get subscriptions by PlanId
  static GetSubscriptionsByPlanId: RequestHandler<{ planId: string }> = async (
    req,
    res
  ) => {
    try {
      const { planId } = req.params;

      const result = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.planId, planId));

      res
        .status(200)
        .json({ message: "Subscription get successfully", data: result });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  };

  // Update subscription
  static UpdateSubscription: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { startDate, endDate, status, planId } = req.body;

      const updatedFields: Partial<typeof subscriptions.$inferInsert> = {};

      if (startDate !== undefined)
        updatedFields.startDate = new Date(startDate);
      if (endDate !== undefined) updatedFields.endDate = new Date(endDate);
      if (status !== undefined) updatedFields.status = status;
      if (planId !== undefined) updatedFields.planId = planId;

      await db
        .update(subscriptions)
        .set(updatedFields)
        .where(eq(subscriptions.id, id));

      const [updatedSubscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, id));

      if (!updatedSubscription) {
        res.status(404).json({ error: "Subscription not found" });
        return;
      }

      res.status(200).json({
        message: "Subscription updated successfully",
        data: updatedSubscription,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update subscription" });
    }
  };

  // Delete subscription
  static DeleteSubscription: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;

      await db.delete(subscriptions).where(eq(subscriptions.id, id));

      res.json({ message: "Subscription deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete subscription" });
    }
  };
}
