import { RequestHandler } from "express";
import { db } from "../db/db";
import { subscriptions, users, plans } from "../db/schema";
import { eq, desc, gt, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

type BillingCycle = "monthly" | "quarterly" | "annual";

function computeEndDate(start: Date, billingCycle: BillingCycle): Date {
  const end = new Date(start);
  if (billingCycle === "monthly") end.setMonth(end.getMonth() + 1);
  if (billingCycle === "quarterly") end.setMonth(end.getMonth() + 3);
  if (billingCycle === "annual") end.setFullYear(end.getFullYear() + 1);
  return end;
}

function assertBillingCycle(v: any): v is BillingCycle {
  return v === "monthly" || v === "quarterly" || v === "annual";
}

export class SubscriptionController {
  /**
   * ✅ Create/Upsert subscription by planId (fan chooses plan)
   * Route: POST /subscription/create
   * body: { planId: string, autoRenew?: boolean }
   */
  static CreateSubscription: RequestHandler = async (req, res) => {
    try {
      const fanId = (req as any).user?.id ?? req.body.userId;
      const { planId, autoRenew } = req.body;

      if (!fanId || !planId) {
        res.status(400).json({ message: "userId and planId are required" });
        return;
      }

      // 1) Load plan
      const plan = await db.query.plans.findFirst({
        where: eq(plans.id, planId),
        columns: {
          id: true,
          artistId: true,
          price: true,
          currency: true,
          billingCycle: true,
          active: true,
        },
      });

      if (!plan) {
        res.status(404).json({ message: "Plan not found" });
        return;
      }

      if (!plan.active) {
        res.status(400).json({ message: "Plan is not active" });
        return;
      }

      const artistId = plan.artistId;

      // 2) Validate cycle
      const startDate = new Date();
      const billingCycle = plan.billingCycle as BillingCycle;

      if (!assertBillingCycle(billingCycle)) {
        res.status(400).json({ message: "Invalid billingCycle in plan" });
        return;
      }

      const endDate = computeEndDate(startDate, billingCycle);

      // 3) Upsert unique(userId, artistId)
      const existing = await db.query.subscriptions.findFirst({
        where: and(
          eq(subscriptions.userId, fanId),
          eq(subscriptions.artistId, artistId)
        ),
      });

      const finalAutoRenew = typeof autoRenew === "boolean" ? autoRenew : true;
      const currency = (plan.currency ?? "EUR").toUpperCase();

      if (existing) {
        await db
          .update(subscriptions)
          .set({
            planId: plan.id,
            status: "active",
            startDate,
            endDate,
            price: plan.price,
            currency,
            autoRenew: finalAutoRenew,
          })
          .where(eq(subscriptions.id, existing.id));

        const updated = await db.query.subscriptions.findFirst({
          where: eq(subscriptions.id, existing.id),
        });

        res.status(200).json({
          message: "Subscription updated successfully",
          data: updated,
        });
        return;
      }

      const id = nanoid();

      await db.insert(subscriptions).values({
        id,
        userId: fanId,
        artistId,
        planId: plan.id,
        status: "active",
        startDate,
        endDate,
        price: plan.price,
        currency,
        autoRenew: finalAutoRenew,
      });

      const created = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.id, id),
      });

      res.status(201).json({
        message: "Subscription created successfully",
        data: created,
      });
    } catch (error: any) {
      console.error("CreateSubscription error:", error);
      res.status(500).json({
        error: "Failed to create subscription",
        details: error?.message ?? String(error),
      });
    }
  };

  /**
   * ✅ Fan checks if subscribed to artist
   * GET /subscription/artist/:artistId/status
   */
  static GetSubscriptionStatus: RequestHandler<{ artistId: string }> = async (
    req,
    res
  ) => {
    try {
      const fanId = (req as any).user?.id as string | undefined;
      const { artistId } = req.params;

      if (!fanId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }
      if (!artistId) {
        res.status(400).send({ message: "Missing artistId" });
        return;
      }

      const now = new Date();

      const sub = await db.query.subscriptions.findFirst({
        where: and(
          eq(subscriptions.artistId, artistId),
          eq(subscriptions.userId, fanId),
          eq(subscriptions.status, "active"),
          gt(subscriptions.endDate, now)
        ),
      });

      res.status(200).send({
        message: "Subscription status fetched",
        data: { isSubscribed: Boolean(sub) },
      });
    } catch (err: any) {
      console.error("GetSubscriptionStatus error:", err);
      res.status(500).send({
        message: "Internal server error",
        details: err?.message ?? String(err),
      });
    }
  };

  /**
   * ✅ Fan subscribes to artist USING a planId
   * POST /subscription/artist/:artistId/subscribe
   * body: { planId: string, autoRenew?: boolean }
   *
   * IMPORTANT: This must include planId because subscriptions.planId is NOT NULL.
   */
  static SubscribeToArtist: RequestHandler<{ artistId: string }> = async (
    req,
    res
  ) => {
    try {
      const fanId = (req as any).user?.id as string | undefined;
      const { artistId } = req.params;
      const { planId, autoRenew } = req.body;

      if (!fanId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }
      if (!artistId) {
        res.status(400).send({ message: "Missing artistId" });
        return;
      }
      if (!planId) {
        res.status(400).send({ message: "Missing planId (required)" });
        return;
      }

      // Verify artist exists
      const artistUser = await db.query.users.findFirst({
        where: eq(users.id, artistId),
        columns: { id: true, type: true },
      });
      if (!artistUser || artistUser.type !== "artist") {
        res.status(404).send({ message: "Artist not found" });
        return;
      }

      // Load plan and verify it belongs to the artist
      const plan = await db.query.plans.findFirst({
        where: eq(plans.id, planId),
        columns: {
          id: true,
          artistId: true,
          price: true,
          currency: true,
          billingCycle: true,
          active: true,
        },
      });

      if (!plan) {
        res.status(404).send({ message: "Plan not found" });
        return;
      }
      if (!plan.active) {
        res.status(400).send({ message: "Plan is not active" });
        return;
      }
      if (plan.artistId !== artistId) {
        res
          .status(400)
          .send({ message: "Plan does not belong to this artist" });
        return;
      }

      const now = new Date();
      const billingCycle = plan.billingCycle as BillingCycle;
      if (!assertBillingCycle(billingCycle)) {
        res.status(400).send({ message: "Invalid billingCycle in plan" });
        return;
      }

      const endDate = computeEndDate(now, billingCycle);
      const currency = (plan.currency ?? "EUR").toUpperCase();
      const finalAutoRenew = typeof autoRenew === "boolean" ? autoRenew : true;

      // Upsert (unique userId+artistId)
      const existing = await db.query.subscriptions.findFirst({
        where: and(
          eq(subscriptions.artistId, artistId),
          eq(subscriptions.userId, fanId)
        ),
      });

      if (existing) {
        await db
          .update(subscriptions)
          .set({
            planId: plan.id,
            status: "active",
            startDate: now,
            endDate,
            price: plan.price,
            currency,
            autoRenew: finalAutoRenew,
          })
          .where(eq(subscriptions.id, existing.id));

        res.status(200).send({
          message: "Subscribed successfully (updated)",
          data: { isSubscribed: true },
        });
        return;
      }

      const id = nanoid();

      await db.insert(subscriptions).values({
        id,
        artistId,
        userId: fanId,
        planId: plan.id,
        status: "active",
        startDate: now,
        endDate,
        price: plan.price,
        currency,
        autoRenew: finalAutoRenew,
      });

      res.status(201).send({
        message: "Subscribed successfully",
        data: { isSubscribed: true },
      });
    } catch (err: any) {
      console.error("SubscribeToArtist error:", err);
      res.status(500).send({
        message: "Internal server error",
        error: err?.message ?? String(err),
      });
    }
  };

  /**
   * ✅ Fan unsubscribes from artist
   * POST /subscription/artist/:artistId/unsubscribe
   */
  static UnsubscribeFromArtist: RequestHandler<{ artistId: string }> = async (
    req,
    res
  ) => {
    try {
      const fanId = (req as any).user?.id as string | undefined;
      const { artistId } = req.params;

      if (!fanId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }
      if (!artistId) {
        res.status(400).send({ message: "Missing artistId" });
        return;
      }

      const now = new Date();

      await db
        .update(subscriptions)
        .set({
          status: "cancelled",
          autoRenew: false,
          endDate: now,
        } as any)
        .where(
          and(
            eq(subscriptions.artistId, artistId),
            eq(subscriptions.userId, fanId),
            eq(subscriptions.status, "active"),
            gt(subscriptions.endDate, now)
          )
        );

      res.status(200).send({
        message: "Unsubscribed successfully",
        data: { isSubscribed: false },
      });
    } catch (err: any) {
      console.error("UnsubscribeFromArtist error:", err);
      res.status(500).send({
        message: "Internal server error",
        error: err?.message ?? String(err),
      });
    }
  };

  // Get all subscriptions
  static GetAllSubscriptions: RequestHandler = async (_req, res) => {
    try {
      const result = await db.select().from(subscriptions);
      res
        .status(200)
        .json({ message: "All subscription get successfully", data: result });
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to fetch subscriptions",
        details: error?.message ?? String(error),
      });
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
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to fetch subscription",
        details: error?.message ?? String(error),
      });
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
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to fetch subscriptions",
        details: error?.message ?? String(error),
      });
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
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to fetch subscriptions",
        details: error?.message ?? String(error),
      });
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
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to update subscription",
        details: error?.message ?? String(error),
      });
    }
  };

  // Delete subscription
  static DeleteSubscription: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;

      await db.delete(subscriptions).where(eq(subscriptions.id, id));

      res.json({ message: "Subscription deleted successfully" });
    } catch (error: any) {
      res.status(500).json({
        error: "Failed to delete subscription",
        details: error?.message ?? String(error),
      });
    }
  };

  /**
   * ✅ Get recent ACTIVE subscribers for the authenticated artist
   * Route: GET /subscription/artist/me/recent?limit=5
   */
  static GetMyRecentActiveSubscribers: RequestHandler = async (req, res) => {
    try {
      const artistId = (req as any).user?.id as string | undefined;
      if (!artistId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }

      const limitRaw = Number(req.query.limit ?? 5);
      const limit = Number.isFinite(limitRaw)
        ? Math.min(Math.max(limitRaw, 1), 50)
        : 5;

      const now = new Date();

      const rows = await db
        .select({
          subscriptionId: subscriptions.id,
          fanId: subscriptions.userId,
          subscribedAt: subscriptions.createdAt,
          endDate: subscriptions.endDate,

          name: users.name,
          surname: users.surname,
          username: users.username,
          country: users.country,
          profileImageUrl: users.profileImageUrl,
        })
        .from(subscriptions)
        .innerJoin(users, eq(subscriptions.userId, users.id))
        .where(
          and(
            eq(subscriptions.artistId, artistId),
            eq(subscriptions.status, "active"),
            gt(subscriptions.endDate, now)
          )
        )
        .orderBy(desc(subscriptions.createdAt))
        .limit(limit);

      res.status(200).send({
        message: "Recent active subscribers fetched successfully",
        data: rows,
      });
    } catch (err: any) {
      console.error("Error fetching recent active subscribers:", err);
      res.status(500).send({
        message: "Internal server error",
        error: err?.message ?? String(err),
      });
    }
  };

  /**
   * ✅ Get ACTIVE subscriptions grouped by fan country (artist = logged in)
   * Route: GET /subscription/artist/me/by-location
   */
  static GetMyActiveSubscriptionsByLocation: RequestHandler = async (
    req,
    res
  ) => {
    try {
      const artistId = (req as any).user?.id as string | undefined;
      if (!artistId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }

      const now = new Date();

      const rows = await db
        .select({
          location: users.country,
          subscribers: sql<number>`COUNT(DISTINCT ${subscriptions.userId})`,
        })
        .from(subscriptions)
        .innerJoin(users, eq(subscriptions.userId, users.id))
        .where(
          and(
            eq(subscriptions.artistId, artistId),
            eq(subscriptions.status, "active"),
            gt(subscriptions.endDate, now)
          )
        )
        .groupBy(users.country)
        .orderBy(desc(sql<number>`COUNT(DISTINCT ${subscriptions.userId})`));

      const total = rows.reduce((sum, r) => sum + (r.subscribers ?? 0), 0);

      const data = rows
        .map((r) => {
          const loc =
            r.location && r.location.length > 0 ? r.location : "Unknown";
          const subs = r.subscribers ?? 0;
          const pct =
            total > 0 ? `${((subs / total) * 100).toFixed(1)}%` : "0%";
          return { location: loc, subscribers: subs, percentage: pct };
        })
        .filter((x) => x.subscribers > 0);

      res.status(200).send({
        message: "Subscriptions by location fetched successfully",
        data,
      });
    } catch (err: any) {
      console.error("Error fetching subscriptions by location:", err);
      res.status(500).send({
        message: "Internal server error",
        error: err?.message ?? String(err),
      });
    }
  };

  /**
   * ✅ Subscription stats for logged-in artist
   * Route: GET /subscription/artist/me/stats
   */
  static GetMySubscriptionStats: RequestHandler = async (req, res) => {
    try {
      const artistId = (req as any).user?.id as string | undefined;
      if (!artistId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const activeAgg = await db
        .select({
          activeSubscribers: sql<number>`COUNT(DISTINCT ${subscriptions.userId})`,
          activeRevenue: sql<number>`COALESCE(SUM(${subscriptions.price}), 0)`,
        })
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.artistId, artistId),
            eq(subscriptions.status, "active"),
            gt(subscriptions.endDate, now)
          )
        );

      const activeSubscribers = activeAgg[0]?.activeSubscribers ?? 0;
      const activeRevenue = activeAgg[0]?.activeRevenue ?? 0;

      const totalAgg = await db
        .select({
          totalSubscribers: sql<number>`COUNT(DISTINCT ${subscriptions.userId})`,
          totalRevenue: sql<number>`COALESCE(SUM(${subscriptions.price}), 0)`,
        })
        .from(subscriptions)
        .where(eq(subscriptions.artistId, artistId));

      const totalSubscribers = totalAgg[0]?.totalSubscribers ?? 0;
      const totalRevenue = totalAgg[0]?.totalRevenue ?? 0;

      const prevThirtyDaysAgo = new Date(
        thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000
      );

      const last30Agg = await db
        .select({
          last30: sql<number>`COUNT(DISTINCT ${subscriptions.userId})`,
        })
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.artistId, artistId),
            gt(subscriptions.createdAt, thirtyDaysAgo)
          )
        );

      const prev30Agg = await db
        .select({
          prev30: sql<number>`COUNT(DISTINCT ${subscriptions.userId})`,
        })
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.artistId, artistId),
            gt(subscriptions.createdAt, prevThirtyDaysAgo),
            sql`${subscriptions.createdAt} <= ${thirtyDaysAgo}`
          )
        );

      const last30 = last30Agg[0]?.last30 ?? 0;
      const prev30 = prev30Agg[0]?.prev30 ?? 0;

      const growthPct =
        prev30 > 0 ? ((last30 - prev30) / prev30) * 100 : last30 > 0 ? 100 : 0;

      res.status(200).send({
        message: "Subscription stats fetched successfully",
        data: {
          currency: "EUR",
          totalRevenue: Number(totalRevenue).toFixed(2),
          totalSubscribers,
          activeSubscribers,
          growth: `${growthPct.toFixed(1)}%`,
        },
      });
    } catch (err: any) {
      console.error("Error fetching subscription stats:", err);
      res.status(500).send({
        message: "Internal server error",
        error: err?.message ?? String(err),
      });
    }
  };
}
