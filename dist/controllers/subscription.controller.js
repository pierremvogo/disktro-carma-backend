"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const db_1 = require("../db/db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const nanoid_1 = require("nanoid");
function computeEndDate(start, billingCycle) {
    const end = new Date(start);
    if (billingCycle === "monthly")
        end.setMonth(end.getMonth() + 1);
    if (billingCycle === "quarterly")
        end.setMonth(end.getMonth() + 3);
    if (billingCycle === "annual")
        end.setFullYear(end.getFullYear() + 1);
    return end;
}
function assertBillingCycle(v) {
    return v === "monthly" || v === "quarterly" || v === "annual";
}
class SubscriptionController {
}
exports.SubscriptionController = SubscriptionController;
_a = SubscriptionController;
/**
 * ✅ Create/Upsert subscription by planId (fan chooses plan)
 * Route: POST /subscription/create
 * body: { planId: string, autoRenew?: boolean }
 */
SubscriptionController.CreateSubscription = async (req, res) => {
    try {
        const fanId = req.user?.id ?? req.body.userId;
        const { planId, autoRenew } = req.body;
        if (!fanId || !planId) {
            res.status(400).json({ message: "userId and planId are required" });
            return;
        }
        // 1) Load plan
        const plan = await db_1.db.query.plans.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.plans.id, planId),
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
        const billingCycle = plan.billingCycle;
        if (!assertBillingCycle(billingCycle)) {
            res.status(400).json({ message: "Invalid billingCycle in plan" });
            return;
        }
        const endDate = computeEndDate(startDate, billingCycle);
        // 3) Upsert unique(userId, artistId)
        const existing = await db_1.db.query.subscriptions.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.subscriptions.userId, fanId), (0, drizzle_orm_1.eq)(schema_1.subscriptions.artistId, artistId)),
        });
        const finalAutoRenew = typeof autoRenew === "boolean" ? autoRenew : true;
        const currency = (plan.currency ?? "EUR").toUpperCase();
        if (existing) {
            await db_1.db
                .update(schema_1.subscriptions)
                .set({
                planId: plan.id,
                status: "active",
                startDate,
                endDate,
                price: plan.price,
                currency,
                autoRenew: finalAutoRenew,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.subscriptions.id, existing.id));
            const updated = await db_1.db.query.subscriptions.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.subscriptions.id, existing.id),
            });
            res.status(200).json({
                message: "Subscription updated successfully",
                data: updated,
            });
            return;
        }
        const id = (0, nanoid_1.nanoid)();
        await db_1.db.insert(schema_1.subscriptions).values({
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
        const created = await db_1.db.query.subscriptions.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.subscriptions.id, id),
        });
        res.status(201).json({
            message: "Subscription created successfully",
            data: created,
        });
    }
    catch (error) {
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
SubscriptionController.GetSubscriptionStatus = async (req, res) => {
    try {
        const fanId = req.user?.id;
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
        const sub = await db_1.db.query.subscriptions.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.subscriptions.artistId, artistId), (0, drizzle_orm_1.eq)(schema_1.subscriptions.userId, fanId), (0, drizzle_orm_1.eq)(schema_1.subscriptions.status, "active"), (0, drizzle_orm_1.gt)(schema_1.subscriptions.endDate, now)),
        });
        res.status(200).send({
            message: "Subscription status fetched",
            data: { isSubscribed: Boolean(sub) },
        });
    }
    catch (err) {
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
SubscriptionController.SubscribeToArtist = async (req, res) => {
    try {
        const fanId = req.user?.id;
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
        const artistUser = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, artistId),
            columns: { id: true, type: true },
        });
        if (!artistUser || artistUser.type !== "artist") {
            res.status(404).send({ message: "Artist not found" });
            return;
        }
        // Load plan and verify it belongs to the artist
        const plan = await db_1.db.query.plans.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.plans.id, planId),
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
        const billingCycle = plan.billingCycle;
        if (!assertBillingCycle(billingCycle)) {
            res.status(400).send({ message: "Invalid billingCycle in plan" });
            return;
        }
        const endDate = computeEndDate(now, billingCycle);
        const currency = (plan.currency ?? "EUR").toUpperCase();
        const finalAutoRenew = typeof autoRenew === "boolean" ? autoRenew : true;
        // Upsert (unique userId+artistId)
        const existing = await db_1.db.query.subscriptions.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.subscriptions.artistId, artistId), (0, drizzle_orm_1.eq)(schema_1.subscriptions.userId, fanId)),
        });
        if (existing) {
            await db_1.db
                .update(schema_1.subscriptions)
                .set({
                planId: plan.id,
                status: "active",
                startDate: now,
                endDate,
                price: plan.price,
                currency,
                autoRenew: finalAutoRenew,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.subscriptions.id, existing.id));
            res.status(200).send({
                message: "Subscribed successfully (updated)",
                data: { isSubscribed: true },
            });
            return;
        }
        const id = (0, nanoid_1.nanoid)();
        await db_1.db.insert(schema_1.subscriptions).values({
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
    }
    catch (err) {
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
SubscriptionController.UnsubscribeFromArtist = async (req, res) => {
    try {
        const fanId = req.user?.id;
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
        await db_1.db
            .update(schema_1.subscriptions)
            .set({
            status: "cancelled",
            autoRenew: false,
            endDate: now,
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.subscriptions.artistId, artistId), (0, drizzle_orm_1.eq)(schema_1.subscriptions.userId, fanId), (0, drizzle_orm_1.eq)(schema_1.subscriptions.status, "active"), (0, drizzle_orm_1.gt)(schema_1.subscriptions.endDate, now)));
        res.status(200).send({
            message: "Unsubscribed successfully",
            data: { isSubscribed: false },
        });
    }
    catch (err) {
        console.error("UnsubscribeFromArtist error:", err);
        res.status(500).send({
            message: "Internal server error",
            error: err?.message ?? String(err),
        });
    }
};
// Get all subscriptions
SubscriptionController.GetAllSubscriptions = async (_req, res) => {
    try {
        const result = await db_1.db.select().from(schema_1.subscriptions);
        res
            .status(200)
            .json({ message: "All subscription get successfully", data: result });
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to fetch subscriptions",
            details: error?.message ?? String(error),
        });
    }
};
// Get subscription by ID
SubscriptionController.GetSubscriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const [subscription] = await db_1.db
            .select()
            .from(schema_1.subscriptions)
            .where((0, drizzle_orm_1.eq)(schema_1.subscriptions.id, id));
        if (!subscription) {
            res.status(404).json({ error: "Subscription not found" });
            return;
        }
        res
            .status(200)
            .json({ message: "Subscription get successfully", data: subscription });
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to fetch subscription",
            details: error?.message ?? String(error),
        });
    }
};
// Get subscriptions by UserId
SubscriptionController.GetSubscriptionsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await db_1.db
            .select()
            .from(schema_1.subscriptions)
            .where((0, drizzle_orm_1.eq)(schema_1.subscriptions.userId, userId));
        res
            .status(200)
            .json({ message: "Subscription get successfully", data: result });
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to fetch subscriptions",
            details: error?.message ?? String(error),
        });
    }
};
// Get subscriptions by PlanId
SubscriptionController.GetSubscriptionsByPlanId = async (req, res) => {
    try {
        const { planId } = req.params;
        const result = await db_1.db
            .select()
            .from(schema_1.subscriptions)
            .where((0, drizzle_orm_1.eq)(schema_1.subscriptions.planId, planId));
        res
            .status(200)
            .json({ message: "Subscription get successfully", data: result });
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to fetch subscriptions",
            details: error?.message ?? String(error),
        });
    }
};
// Update subscription
SubscriptionController.UpdateSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string" || id.trim() === "") {
            res.status(400).json({ error: "Missing or invalid subscription id" });
            return;
        }
        const { startDate, endDate, status, planId } = req.body;
        const updatedFields = {};
        if (startDate !== undefined)
            updatedFields.startDate = new Date(startDate);
        if (endDate !== undefined)
            updatedFields.endDate = new Date(endDate);
        if (status !== undefined)
            updatedFields.status = status;
        if (planId !== undefined)
            updatedFields.planId = planId;
        await db_1.db
            .update(schema_1.subscriptions)
            .set(updatedFields)
            .where((0, drizzle_orm_1.eq)(schema_1.subscriptions.id, id));
        const [updatedSubscription] = await db_1.db
            .select()
            .from(schema_1.subscriptions)
            .where((0, drizzle_orm_1.eq)(schema_1.subscriptions.id, id));
        if (!updatedSubscription) {
            res.status(404).json({ error: "Subscription not found" });
            return;
        }
        res.status(200).json({
            message: "Subscription updated successfully",
            data: updatedSubscription,
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to update subscription",
            details: error?.message ?? String(error),
        });
    }
};
// Delete subscription
SubscriptionController.DeleteSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.db.delete(schema_1.subscriptions).where((0, drizzle_orm_1.eq)(schema_1.subscriptions.id, id));
        res.json({ message: "Subscription deleted successfully" });
    }
    catch (error) {
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
SubscriptionController.GetMyRecentActiveSubscribers = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const limitRaw = Number(req.query.limit ?? 5);
        const limit = Number.isFinite(limitRaw)
            ? Math.min(Math.max(limitRaw, 1), 50)
            : 5;
        const now = new Date();
        const rows = await db_1.db
            .select({
            subscriptionId: schema_1.subscriptions.id,
            fanId: schema_1.subscriptions.userId,
            subscribedAt: schema_1.subscriptions.createdAt,
            endDate: schema_1.subscriptions.endDate,
            name: schema_1.users.name,
            surname: schema_1.users.surname,
            username: schema_1.users.username,
            country: schema_1.users.country,
            profileImageUrl: schema_1.users.profileImageUrl,
        })
            .from(schema_1.subscriptions)
            .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.subscriptions.userId, schema_1.users.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.subscriptions.artistId, artistId), (0, drizzle_orm_1.eq)(schema_1.subscriptions.status, "active"), (0, drizzle_orm_1.gt)(schema_1.subscriptions.endDate, now)))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.subscriptions.createdAt))
            .limit(limit);
        res.status(200).send({
            message: "Recent active subscribers fetched successfully",
            data: rows,
        });
    }
    catch (err) {
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
SubscriptionController.GetMyActiveSubscriptionsByLocation = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const now = new Date();
        const rows = await db_1.db
            .select({
            location: schema_1.users.country,
            subscribers: (0, drizzle_orm_1.sql) `COUNT(DISTINCT ${schema_1.subscriptions.userId})`,
        })
            .from(schema_1.subscriptions)
            .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.subscriptions.userId, schema_1.users.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.subscriptions.artistId, artistId), (0, drizzle_orm_1.eq)(schema_1.subscriptions.status, "active"), (0, drizzle_orm_1.gt)(schema_1.subscriptions.endDate, now)))
            .groupBy(schema_1.users.country)
            .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sql) `COUNT(DISTINCT ${schema_1.subscriptions.userId})`));
        const total = rows.reduce((sum, r) => sum + (r.subscribers ?? 0), 0);
        const data = rows
            .map((r) => {
            const loc = r.location && r.location.length > 0 ? r.location : "Unknown";
            const subs = r.subscribers ?? 0;
            const pct = total > 0 ? `${((subs / total) * 100).toFixed(1)}%` : "0%";
            return { location: loc, subscribers: subs, percentage: pct };
        })
            .filter((x) => x.subscribers > 0);
        res.status(200).send({
            message: "Subscriptions by location fetched successfully",
            data,
        });
    }
    catch (err) {
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
SubscriptionController.GetMySubscriptionStats = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const activeAgg = await db_1.db
            .select({
            activeSubscribers: (0, drizzle_orm_1.sql) `COUNT(DISTINCT ${schema_1.subscriptions.userId})`,
            activeRevenue: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schema_1.subscriptions.price}), 0)`,
        })
            .from(schema_1.subscriptions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.subscriptions.artistId, artistId), (0, drizzle_orm_1.eq)(schema_1.subscriptions.status, "active"), (0, drizzle_orm_1.gt)(schema_1.subscriptions.endDate, now)));
        const activeSubscribers = activeAgg[0]?.activeSubscribers ?? 0;
        const activeRevenue = activeAgg[0]?.activeRevenue ?? 0;
        const totalAgg = await db_1.db
            .select({
            totalSubscribers: (0, drizzle_orm_1.sql) `COUNT(DISTINCT ${schema_1.subscriptions.userId})`,
            totalRevenue: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schema_1.subscriptions.price}), 0)`,
        })
            .from(schema_1.subscriptions)
            .where((0, drizzle_orm_1.eq)(schema_1.subscriptions.artistId, artistId));
        const totalSubscribers = totalAgg[0]?.totalSubscribers ?? 0;
        const totalRevenue = totalAgg[0]?.totalRevenue ?? 0;
        const prevThirtyDaysAgo = new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000);
        const last30Agg = await db_1.db
            .select({
            last30: (0, drizzle_orm_1.sql) `COUNT(DISTINCT ${schema_1.subscriptions.userId})`,
        })
            .from(schema_1.subscriptions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.subscriptions.artistId, artistId), (0, drizzle_orm_1.gt)(schema_1.subscriptions.createdAt, thirtyDaysAgo)));
        const prev30Agg = await db_1.db
            .select({
            prev30: (0, drizzle_orm_1.sql) `COUNT(DISTINCT ${schema_1.subscriptions.userId})`,
        })
            .from(schema_1.subscriptions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.subscriptions.artistId, artistId), (0, drizzle_orm_1.gt)(schema_1.subscriptions.createdAt, prevThirtyDaysAgo), (0, drizzle_orm_1.sql) `${schema_1.subscriptions.createdAt} <= ${thirtyDaysAgo}`));
        const last30 = last30Agg[0]?.last30 ?? 0;
        const prev30 = prev30Agg[0]?.prev30 ?? 0;
        const growthPct = prev30 > 0 ? ((last30 - prev30) / prev30) * 100 : last30 > 0 ? 100 : 0;
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
    }
    catch (err) {
        console.error("Error fetching subscription stats:", err);
        res.status(500).send({
            message: "Internal server error",
            error: err?.message ?? String(err),
        });
    }
};
