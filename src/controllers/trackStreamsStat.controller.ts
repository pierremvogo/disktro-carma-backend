import { RequestHandler } from "express";
import { eq, inArray } from "drizzle-orm";
import { db } from "../db/db";
import * as schema from "../db/schema";

type ReleaseType = "single" | "ep" | "album";

type LocationStat = {
  location: string;
  streams: number;
  percentage: string;
};

type TrackLocationStat = {
  location: string;
  streams: number;
  percentage: string;
};

type TrackStat = {
  id: string;
  name: string | null;
  type: ReleaseType;
  totalStreams: number;
  topLocations: TrackLocationStat[];
};

export class TrackStreamsStatsController {
  /**
   * Récupère toutes les stats streams pour un artiste :
   * - totalStreams
   * - monthlyStreams (30 derniers jours)
   * - listeners (nb distinct d'utilisateurs)
   * - totalTracks
   * - topTracks
   * - streamsByLocation (agrégé)
   * - tracks (avec topLocations par track)
   *
   * Route suggérée : GET /artists/:artistId/streams/stats
   */
  static getStreamsStatsByArtistId: RequestHandler<{ artistId: string }> =
    async (req, res, next) => {
      try {
        const { artistId } = req.params;

        // 1️⃣ Récupérer TOUS les tracks de cet artiste
        const artistTracks = await db.query.tracks.findMany({
          where: eq(schema.tracks.userId, artistId), // adapte à artistId si besoin
        });

        if (!artistTracks || artistTracks.length === 0) {
          res.status(200).json({
            totalStreams: 0,
            monthlyStreams: 0,
            listeners: 0,
            totalTracks: 0,
            topTracks: [],
            streamsByLocation: [],
            tracks: [],
          });
          return;
        }

        const trackIds = artistTracks.map((t) => t.id);

        // 2️⃣ Récupérer tous les streams pour ces tracks
        const allStreams = await db.query.trackStreams.findMany({
          where: inArray(schema.trackStreams.trackId, trackIds),
        });

        const now = new Date();
        const thirtyDaysAgo = new Date(
          now.getTime() - 30 * 24 * 60 * 60 * 1000
        );

        // 3️⃣ Total streams & monthly streams
        const totalStreams = allStreams.length;
        const monthlyStreams = allStreams.filter(
          (s) => s.createdAt >= thirtyDaysAgo
        ).length;

        // 4️⃣ Listeners (distinct userId)
        const listenersSet = new Set(
          allStreams
            .map((s) => s.userId)
            .filter((id): id is string => !!id && id.length > 0)
        );
        const listeners = listenersSet.size;

        const totalTracks = artistTracks.length;

        // 5️⃣ Agrégation par track
        const streamsCountByTrack = new Map<string, number>();
        const locationByTrack = new Map<string, Map<string, number>>(); // trackId -> (country -> streams)

        for (const s of allStreams) {
          // total par track
          const prev = streamsCountByTrack.get(s.trackId) ?? 0;
          streamsCountByTrack.set(s.trackId, prev + 1);

          // location par track
          const country = s.country || "Unknown";
          let trackLocMap = locationByTrack.get(s.trackId);
          if (!trackLocMap) {
            trackLocMap = new Map<string, number>();
            locationByTrack.set(s.trackId, trackLocMap);
          }
          const prevLoc = trackLocMap.get(country) ?? 0;
          trackLocMap.set(country, prevLoc + 1);
        }

        // 6️⃣ Agrégation globale par location (tous les tracks de l’artiste)
        const globalLocationMap = new Map<string, number>();
        for (const s of allStreams) {
          const country = s.country || "Unknown";
          const prev = globalLocationMap.get(country) ?? 0;
          globalLocationMap.set(country, prev + 1);
        }

        const totalByLocationStreams = Array.from(
          globalLocationMap.values()
        ).reduce((sum, v) => sum + v, 0);

        const streamsByLocation: LocationStat[] = Array.from(
          globalLocationMap.entries()
        )
          .map(([location, streams]) => ({
            location,
            streams,
            percentage:
              totalByLocationStreams > 0
                ? `${((streams / totalByLocationStreams) * 100).toFixed(1)}%`
                : "0%",
          }))
          .sort((a, b) => b.streams - a.streams);

        // 7️⃣ Construire les stats par track (TrackStat)
        const tracksStats: TrackStat[] = artistTracks.map((t) => {
          const trackStreamsCount = streamsCountByTrack.get(t.id) ?? 0;

          const locMapForTrack = locationByTrack.get(t.id) ?? new Map();
          const trackTotalLocStreams = Array.from(
            locMapForTrack.values()
          ).reduce((sum, v) => sum + v, 0);

          const topLocations: TrackLocationStat[] = Array.from(
            locMapForTrack.entries()
          )
            .map(([loc, count]) => ({
              location: loc,
              streams: count,
              percentage:
                trackTotalLocStreams > 0
                  ? `${((count / trackTotalLocStreams) * 100).toFixed(1)}%`
                  : "0%",
            }))
            .sort((a, b) => b.streams - a.streams);

          let type: ReleaseType = "single";
          if (t.type === "TRACK_EP") type = "ep";
          else if (t.type === "TRACK_ALBUM") type = "album";

          return {
            id: t.id,
            name: t.title,
            type,
            totalStreams: trackStreamsCount,
            topLocations,
          };
        });

        // 8️⃣ Top tracks par totalStreams
        const topTracks = [...tracksStats].sort(
          (a, b) => b.totalStreams - a.totalStreams
        );

        // 9️⃣ Réponse finale
        res.status(200).json({
          totalStreams,
          monthlyStreams,
          listeners,
          totalTracks,
          topTracks,
          streamsByLocation,
          tracks: tracksStats,
        });
        return;
      } catch (err) {
        console.error("Error in getStreamsStatsByArtistId:", err);
        res.status(500).json({
          message: "Error occured when getting streams stats for artist",
        });
        return;
      }
    };
}
