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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackStreamsStatsController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class TrackStreamsStatsController {
}
exports.TrackStreamsStatsController = TrackStreamsStatsController;
_a = TrackStreamsStatsController;
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
TrackStreamsStatsController.getStreamsStatsByArtistId = async (req, res, next) => {
    try {
        const { artistId } = req.params;
        // 1️⃣ Récupérer TOUS les tracks de cet artiste
        const artistTracks = await db_1.db.query.tracks.findMany({
            where: (0, drizzle_orm_1.eq)(schema.tracks.userId, artistId), // adapte à artistId si besoin
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
        const allStreams = await db_1.db.query.trackStreams.findMany({
            where: (0, drizzle_orm_1.inArray)(schema.trackStreams.trackId, trackIds),
        });
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        // 3️⃣ Total streams & monthly streams
        const totalStreams = allStreams.length;
        const monthlyStreams = allStreams.filter((s) => s.createdAt >= thirtyDaysAgo).length;
        // 4️⃣ Listeners (distinct userId)
        const listenersSet = new Set(allStreams
            .map((s) => s.userId)
            .filter((id) => !!id && id.length > 0));
        const listeners = listenersSet.size;
        const totalTracks = artistTracks.length;
        // 5️⃣ Agrégation par track
        const streamsCountByTrack = new Map();
        const locationByTrack = new Map(); // trackId -> (country -> streams)
        for (const s of allStreams) {
            // total par track
            const prev = streamsCountByTrack.get(s.trackId) ?? 0;
            streamsCountByTrack.set(s.trackId, prev + 1);
            // location par track
            const country = s.country || "Unknown";
            let trackLocMap = locationByTrack.get(s.trackId);
            if (!trackLocMap) {
                trackLocMap = new Map();
                locationByTrack.set(s.trackId, trackLocMap);
            }
            const prevLoc = trackLocMap.get(country) ?? 0;
            trackLocMap.set(country, prevLoc + 1);
        }
        // 6️⃣ Agrégation globale par location (tous les tracks de l’artiste)
        const globalLocationMap = new Map();
        for (const s of allStreams) {
            const country = s.country || "Unknown";
            const prev = globalLocationMap.get(country) ?? 0;
            globalLocationMap.set(country, prev + 1);
        }
        const totalByLocationStreams = Array.from(globalLocationMap.values()).reduce((sum, v) => sum + v, 0);
        const streamsByLocation = Array.from(globalLocationMap.entries())
            .map(([location, streams]) => ({
            location,
            streams,
            percentage: totalByLocationStreams > 0
                ? `${((streams / totalByLocationStreams) * 100).toFixed(1)}%`
                : "0%",
        }))
            .sort((a, b) => b.streams - a.streams);
        // 7️⃣ Construire les stats par track (TrackStat)
        const tracksStats = artistTracks.map((t) => {
            const trackStreamsCount = streamsCountByTrack.get(t.id) ?? 0;
            const locMapForTrack = locationByTrack.get(t.id) ?? new Map();
            const trackTotalLocStreams = Array.from(locMapForTrack.values()).reduce((sum, v) => sum + v, 0);
            const topLocations = Array.from(locMapForTrack.entries())
                .map(([loc, count]) => ({
                location: loc,
                streams: count,
                percentage: trackTotalLocStreams > 0
                    ? `${((count / trackTotalLocStreams) * 100).toFixed(1)}%`
                    : "0%",
            }))
                .sort((a, b) => b.streams - a.streams);
            let type = "single";
            if (t.type === "TRACK_EP")
                type = "ep";
            else if (t.type === "TRACK_ALBUM")
                type = "album";
            return {
                id: t.id,
                name: t.title,
                type,
                totalStreams: trackStreamsCount,
                topLocations,
            };
        });
        // 8️⃣ Top tracks par totalStreams
        const topTracks = [...tracksStats].sort((a, b) => b.totalStreams - a.totalStreams);
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
    }
    catch (err) {
        console.error("Error in getStreamsStatsByArtistId:", err);
        res.status(500).json({
            message: "Error occured when getting streams stats for artist",
        });
        return;
    }
};
