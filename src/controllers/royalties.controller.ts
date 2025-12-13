import { RequestHandler } from "express";
import { db } from "../db/db";
import { tracks, trackStreams, royaltyPayouts } from "../db/schema";
import { eq, and, gte, desc, sql } from "drizzle-orm";

export class RoyaltiesController {
  /**
   * ✅ Royalties summary for logged-in artist
   * Route: GET /royalties/artist/me/summary
   */
  static GetMyRoyaltiesSummary: RequestHandler = async (req, res) => {
    try {
      const artistId = (req as any).user?.id as string | undefined;
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
      const totalRows = await db
        .select({
          totalStreams: sql<number>`COUNT(*)`,
        })
        .from(trackStreams)
        .innerJoin(tracks, eq(trackStreams.trackId, tracks.id))
        .where(eq(tracks.userId, artistId));

      const totalStreams = totalRows[0]?.totalStreams ?? 0;

      // 2) Streams in last 30 days
      const monthRows = await db
        .select({
          monthlyStreams: sql<number>`COUNT(*)`,
        })
        .from(trackStreams)
        .innerJoin(tracks, eq(trackStreams.trackId, tracks.id))
        .where(
          and(
            eq(tracks.userId, artistId),
            gte(trackStreams.createdAt, thirtyDaysAgo)
          )
        );

      const monthlyStreams = monthRows[0]?.monthlyStreams ?? 0;

      // 3) Total paid payouts
      const paidRows = await db
        .select({
          totalPaid: sql<number>`COALESCE(SUM(${royaltyPayouts.amount}), 0)`,
        })
        .from(royaltyPayouts)
        .where(
          and(
            eq(royaltyPayouts.artistId, artistId),
            eq(royaltyPayouts.status, "paid")
          )
        );

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
    } catch (err) {
      console.error("Error fetching royalties summary:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };

  /**
   * ✅ Revenue by track for logged-in artist
   * Route: GET /royalties/artist/me/by-track?limit=10
   */
  static GetMyRoyaltiesByTrack: RequestHandler = async (req, res) => {
    try {
      const artistId = (req as any).user?.id as string | undefined;
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

      const rows = await db
        .select({
          trackId: tracks.id,
          title: tracks.title,
          streams: sql<number>`COUNT(*)`,
        })
        .from(trackStreams)
        .innerJoin(tracks, eq(trackStreams.trackId, tracks.id))
        .where(eq(tracks.userId, artistId))
        .groupBy(tracks.id)
        .orderBy(desc(sql<number>`COUNT(*)`))
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
    } catch (err) {
      console.error("Error fetching royalties by track:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };
}
