"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoyaltiesController = void 0;
const db_1 = require("../db/db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
class RoyaltiesController {
}
exports.RoyaltiesController = RoyaltiesController;
_a = RoyaltiesController;
/**
 * ✅ Royalties summary for logged-in artist
 * Route: GET /royalties/artist/me/summary
 */
RoyaltiesController.GetMyRoyaltiesSummary = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        // ✅ rate per stream (MVP)
        const rate = Number(process.env.ROYALTY_RATE_PER_STREAM ?? "0.003");
        if (!Number.isFinite(rate) || rate < 0) {
            res.status(500).send({ message: "Invalid ROYALTY_RATE_PER_STREAM" });
            return;
        }
        // 1) Total streams for this artist (all time)
        const totalRows = await db_1.db
            .select({
            totalStreams: (0, drizzle_orm_1.sql) `COUNT(*)`,
        })
            .from(schema_1.trackStreams)
            .innerJoin(schema_1.tracks, (0, drizzle_orm_1.eq)(schema_1.trackStreams.trackId, schema_1.tracks.id))
            .where((0, drizzle_orm_1.eq)(schema_1.tracks.userId, artistId));
        const totalStreams = totalRows[0]?.totalStreams ?? 0;
        // 2) Streams in last 30 days
        const monthRows = await db_1.db
            .select({
            monthlyStreams: (0, drizzle_orm_1.sql) `COUNT(*)`,
        })
            .from(schema_1.trackStreams)
            .innerJoin(schema_1.tracks, (0, drizzle_orm_1.eq)(schema_1.trackStreams.trackId, schema_1.tracks.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.tracks.userId, artistId), (0, drizzle_orm_1.gte)(schema_1.trackStreams.createdAt, thirtyDaysAgo)));
        const monthlyStreams = monthRows[0]?.monthlyStreams ?? 0;
        // 3) Total paid payouts
        const paidRows = await db_1.db
            .select({
            totalPaid: (0, drizzle_orm_1.sql) `COALESCE(SUM(${schema_1.royaltyPayouts.amount}), 0)`,
        })
            .from(schema_1.royaltyPayouts)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.royaltyPayouts.artistId, artistId), (0, drizzle_orm_1.eq)(schema_1.royaltyPayouts.status, "paid")));
        const totalPaid = paidRows[0]?.totalPaid ?? 0;
        // 4) Calcul revenues
        const totalRoyalties = totalStreams * rate;
        const thisMonth = monthlyStreams * rate;
        const pending = Math.max(0, totalRoyalties - totalPaid);
        res.status(200).send({
            message: "Royalties summary fetched successfully",
            data: {
                currency: "EUR",
                ratePerStream: rate,
                totalStreams,
                monthlyStreams,
                totalRoyalties: totalRoyalties.toFixed(2),
                thisMonth: thisMonth.toFixed(2),
                totalPaid: Number(totalPaid).toFixed(2),
                pending: pending.toFixed(2),
            },
        });
    }
    catch (err) {
        console.error("Error fetching royalties summary:", err);
        res.status(500).send({ message: "Internal server error" });
    }
};
/**
 * ✅ Revenue by track for logged-in artist
 * Route: GET /royalties/artist/me/by-track?limit=10
 */
RoyaltiesController.GetMyRoyaltiesByTrack = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const limitRaw = Number(req.query.limit ?? 10);
        const limit = Number.isFinite(limitRaw)
            ? Math.min(Math.max(limitRaw, 1), 50)
            : 10;
        const rate = Number(process.env.ROYALTY_RATE_PER_STREAM ?? "0.003");
        if (!Number.isFinite(rate) || rate < 0) {
            res.status(500).send({ message: "Invalid ROYALTY_RATE_PER_STREAM" });
            return;
        }
        const rows = await db_1.db
            .select({
            trackId: schema_1.tracks.id,
            title: schema_1.tracks.title,
            streams: (0, drizzle_orm_1.sql) `COUNT(*)`,
        })
            .from(schema_1.trackStreams)
            .innerJoin(schema_1.tracks, (0, drizzle_orm_1.eq)(schema_1.trackStreams.trackId, schema_1.tracks.id))
            .where((0, drizzle_orm_1.eq)(schema_1.tracks.userId, artistId))
            .groupBy(schema_1.tracks.id)
            .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sql) `COUNT(*)`))
            .limit(limit);
        const data = rows.map((r) => ({
            trackId: r.trackId,
            name: r.title,
            streams: r.streams ?? 0,
            revenue: ((r.streams ?? 0) * rate).toFixed(2),
            currency: "EUR",
        }));
        res.status(200).send({
            message: "Royalties by track fetched successfully",
            data,
        });
    }
    catch (err) {
        console.error("Error fetching royalties by track:", err);
        res.status(500).send({ message: "Internal server error" });
    }
};
