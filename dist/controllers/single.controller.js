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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
const slugify_1 = __importDefault(require("slugify"));
class SingleController {
}
exports.SingleController = SingleController;
_a = SingleController;
SingleController.create = async (req, res, next) => {
    try {
        const { title, duration, userId, coverUrl, audioFileName, 
        // 👉 nouveaux champs
        audioUrl, coverFileName, authors, producers, lyricists, musiciansVocals, musiciansPianoKeyboards, musiciansWinds, musiciansPercussion, musiciansStrings, mixingEngineer, masteringEngineer, } = req.body;
        if (!title || !userId || !coverUrl) {
            res.status(400).json({
                message: "title, userId et coverUrl sont requis",
            });
            return;
        }
        const singleSlug = (0, slugify_1.default)(title, { lower: true, strict: true });
        const existingName = await db_1.db.query.singles.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.singles.slug, singleSlug),
        });
        if (existingName) {
            res
                .status(409)
                .json({ message: "A single with this name already exists" });
            return;
        }
        const single = await db_1.db
            .insert(schema.singles)
            .values({
            title,
            slug: singleSlug,
            userId,
            duration,
            coverUrl,
            coverFileName,
            audioFileName,
            // 🆕 nouveaux champs
            audioUrl,
            authors,
            producers,
            lyricists,
            musiciansVocals,
            musiciansPianoKeyboards,
            musiciansWinds,
            musiciansPercussion,
            musiciansStrings,
            mixingEngineer,
            masteringEngineer,
        })
            .$returningId();
        const createdSingle = single[0];
        if (!createdSingle) {
            res.status(400).send({
                message: "Error occurred when creating single",
            });
            return;
        }
        res.status(200).send({
            message: "Single created successfully",
            data: createdSingle,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Internal server error",
        });
    }
};
SingleController.FindAllSingles = async (req, res, next) => {
    try {
        const allSingles = await db_1.db.query.singles.findMany({
            columns: {
                id: true,
                title: true,
                slug: true,
                duration: true,
                coverUrl: true,
                coverFileName: true,
                audioFileName: true,
                // 🧩 tu peux décider si tu veux exposer ça ici ou pas :
                audioUrl: true,
                authors: true,
                producers: true,
                lyricists: true,
                mixingEngineer: true,
                masteringEngineer: true,
            },
        });
        if (allSingles.length === 0) {
            res.status(400).send({
                message: "No Singles found",
            });
            return;
        }
        res.status(200).send({
            data: allSingles,
            message: "Successfully get all singles",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Internal server error",
        });
    }
};
SingleController.FindSingleByArtistAndSlug = async (req, res, next) => {
    try {
        const coll = await db_1.db
            .select({
            id: schema.singles.id,
            title: schema.singles.title,
            slug: schema.singles.slug,
            duration: schema.singles.duration,
            coverUrl: schema.singles.coverUrl,
            coverFileName: schema.singles.coverFileName,
            audioUrl: schema.singles.audioUrl,
            audioFileName: schema.singles.audioFileName,
            authors: schema.singles.authors,
            producers: schema.singles.producers,
            lyricists: schema.singles.lyricists,
            musiciansVocals: schema.singles.musiciansVocals,
            musiciansPianoKeyboards: schema.singles.musiciansPianoKeyboards,
            musiciansWinds: schema.singles.musiciansWinds,
            musiciansPercussion: schema.singles.musiciansPercussion,
            musiciansStrings: schema.singles.musiciansStrings,
            mixingEngineer: schema.singles.mixingEngineer,
            masteringEngineer: schema.singles.masteringEngineer,
            tracks: schema.tracks,
        })
            .from(schema.singles)
            .innerJoin(schema.singleArtists, (0, drizzle_orm_1.eq)(schema.singles.id, schema.singleArtists.singleId))
            .innerJoin(schema.artists, (0, drizzle_orm_1.eq)(schema.artists.id, schema.singleArtists.artistId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.singles.slug, req.body.singleSlug), (0, drizzle_orm_1.eq)(schema.artists.slug, req.body.artistSlug)))
            .limit(1)
            .execute();
        if (!coll[0]) {
            res.status(404).send({
                message: "Single not found for this artist and slug",
            });
            return;
        }
        res.status(200).send({
            message: "Get single by artist and slug successfully",
            data: coll[0],
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Internal server error",
        });
    }
};
SingleController.FindSingleById = async (req, res, next) => {
    try {
        const single = await db_1.db.query.singles.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.singles.id, req.params.id),
            with: {
                trackSingles: {
                    with: {
                        track: true,
                    },
                },
                singleTags: {
                    with: {
                        tag: true,
                    },
                },
            },
        });
        if (!single) {
            res.status(400).send({
                message: `No single found with id ${req.params.id}.`,
            });
            return;
        }
        // ========== CALCUL STATS STREAMS POUR CE SINGLE ==========
        // Récupérer tous les trackIds liés à ce single
        const trackIds = single.trackSingles.map((ts) => ts.trackId);
        let streamsCount = 0;
        let monthlyStreamsCount = 0;
        let listenersCount = 0;
        let topLocations = [];
        if (trackIds.length > 0) {
            // 1️⃣ Récupérer tous les streams pour ces tracks
            const allStreams = await db_1.db.query.trackStreams.findMany({
                where: (0, drizzle_orm_1.inArray)(schema.trackStreams.trackId, trackIds),
            });
            const now = new Date();
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            // 2️⃣ total / monthly
            streamsCount = allStreams.length;
            monthlyStreamsCount = allStreams.filter((s) => s.createdAt >= thirtyDaysAgo).length;
            // 3️⃣ listeners distincts
            const listenersSet = new Set(allStreams
                .map((s) => s.userId)
                .filter((id) => !!id && id.length > 0));
            listenersCount = listenersSet.size;
            // 4️⃣ agrégation par pays
            const locationMap = new Map();
            for (const s of allStreams) {
                const country = s.country || "Unknown";
                const prev = locationMap.get(country) ?? 0;
                locationMap.set(country, prev + 1);
            }
            const totalByLocation = Array.from(locationMap.values()).reduce((sum, v) => sum + v, 0);
            topLocations = Array.from(locationMap.entries())
                .map(([location, streams]) => ({
                location,
                streams,
                percentage: totalByLocation > 0
                    ? `${((streams / totalByLocation) * 100).toFixed(1)}%`
                    : "0%",
            }))
                .sort((a, b) => b.streams - a.streams);
        }
        // ========== CONSTRUCTION DU SINGLE POUR LA RÉPONSE ==========
        const a = { ...single };
        if (a) {
            // tags & tracks comme avant
            a.tags = single.singleTags.map((a) => a.tag);
            a.tracks = single.trackSingles.map((t) => t.track);
            delete a.singleTags;
            delete a.trackSingles;
            // nouvelle partie : stats de streams
            a.streamsCount = streamsCount;
            a.monthlyStreamsCount = monthlyStreamsCount;
            a.listenersCount = listenersCount;
            a.topLocations = topLocations;
            res.status(200).send({
                message: `Successfully get Single`,
                single: a,
            });
            return;
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error.`,
        });
        return;
    }
};
SingleController.FindSinglesByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const artist = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, userId),
        });
        if (!artist) {
            res
                .status(404)
                .send({ message: "Artist not found with the given ID." });
            return;
        }
        const singles = await db_1.db.query.singles.findMany({
            where: (0, drizzle_orm_1.eq)(schema.singles.userId, userId),
            with: {
                user: true,
                trackSingles: {
                    with: {
                        track: true,
                    },
                },
            },
        });
        if (!singles || singles.length === 0) {
            res.status(200).send({
                message: "Successfully retrieved all singles for this artist.",
                singles: [],
            });
            return;
        }
        // Construire une version nettoyée + stats + mainTrackId
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const allTrackIds = singles.flatMap((s) => s.trackSingles.map((ts) => ts.trackId));
        const allStreams = allTrackIds.length === 0
            ? []
            : await db_1.db.query.trackStreams.findMany({
                where: (0, drizzle_orm_1.inArray)(schema.trackStreams.trackId, allTrackIds),
            });
        const singlesWithStats = singles.map((s) => {
            const singleTrackIds = s.trackSingles.map((ts) => ts.trackId);
            const streamsForSingle = allStreams.filter((st) => singleTrackIds.includes(st.trackId));
            const streamsCount = streamsForSingle.length;
            const monthlyStreamsCount = streamsForSingle.filter((st) => st.createdAt >= thirtyDaysAgo).length;
            const listenersSet = new Set(streamsForSingle
                .map((st) => st.userId)
                .filter((id) => !!id && id.length > 0));
            const listenersCount = listenersSet.size;
            const locationMap = new Map();
            for (const st of streamsForSingle) {
                const country = st.country || "Unknown";
                const prev = locationMap.get(country) ?? 0;
                locationMap.set(country, prev + 1);
            }
            const totalByLocation = Array.from(locationMap.values()).reduce((sum, v) => sum + v, 0);
            const topLocations = Array.from(locationMap.entries())
                .map(([location, streams]) => ({
                location,
                streams,
                percentage: totalByLocation > 0
                    ? `${((streams / totalByLocation) * 100).toFixed(1)}%`
                    : "0%",
            }))
                .sort((a, b) => b.streams - a.streams);
            // on expose en plus l'ID du premier track lié
            const mainTrackId = s.trackSingles && s.trackSingles.length > 0
                ? s.trackSingles[0].trackId
                : null;
            // on peut aussi exposer les tracks si tu veux côté front :
            const tracks = s.trackSingles.map((ts) => ts.track);
            const single = {
                ...s,
                tracks,
                mainTrackId,
                streamsCount,
                monthlyStreamsCount,
                listenersCount,
                topLocations,
            };
            // on enlève les relations brutes si tu veux cleaner la réponse
            delete single.trackSingles;
            return single;
        });
        res.status(200).send({
            message: "Successfully retrieved all singles for this artist.",
            singles: singlesWithStats,
        });
    }
    catch (err) {
        console.error("Error retrieving singles:", err);
        res.status(500).send({ message: "Internal server error." });
    }
};
SingleController.UpdateSingle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedFields = {};
        // Titre + slug uniquement si title fourni
        if (req.body.title !== undefined) {
            updatedFields.title = req.body.title;
            updatedFields.slug = (0, slugify_1.default)(req.body.title, {
                lower: true,
                strict: true,
            });
        }
        if (req.body.duration !== undefined)
            updatedFields.duration = req.body.duration;
        if (req.body.coverUrl !== undefined)
            updatedFields.coverUrl = req.body.coverUrl;
        // 🆕 champs supplémentaires
        if (req.body.audioUrl !== undefined)
            updatedFields.audioUrl = req.body.audioUrl;
        if (req.body.authors !== undefined)
            updatedFields.authors = req.body.authors;
        if (req.body.producers !== undefined)
            updatedFields.producers = req.body.producers;
        if (req.body.lyricists !== undefined)
            updatedFields.lyricists = req.body.lyricists;
        if (req.body.musiciansVocals !== undefined)
            updatedFields.musiciansVocals = req.body.musiciansVocals;
        if (req.body.musiciansPianoKeyboards !== undefined)
            updatedFields.musiciansPianoKeyboards =
                req.body.musiciansPianoKeyboards;
        if (req.body.musiciansWinds !== undefined)
            updatedFields.musiciansWinds = req.body.musiciansWinds;
        if (req.body.musiciansPercussion !== undefined)
            updatedFields.musiciansPercussion = req.body.musiciansPercussion;
        if (req.body.musiciansStrings !== undefined)
            updatedFields.musiciansStrings = req.body.musiciansStrings;
        if (req.body.mixingEngineer !== undefined)
            updatedFields.mixingEngineer = req.body.mixingEngineer;
        if (req.body.masteringEngineer !== undefined)
            updatedFields.masteringEngineer = req.body.masteringEngineer;
        // Mise à jour dans la base
        await db_1.db
            .update(schema.singles)
            .set(updatedFields)
            .where((0, drizzle_orm_1.eq)(schema.singles.id, id));
        // Récupérer le single mis à jour
        const updatedSingle = await db_1.db.query.singles.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.singles.id, id),
        });
        if (!updatedSingle) {
            res.status(404).send({ message: "Single not found" });
            return;
        }
        res.status(200).send({
            message: "Single updated successfully",
            data: updatedSingle,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error: ${err}`,
        });
    }
};
SingleController.DeleteSingle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const single = await db_1.db.query.singles.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.singles.id, id),
        });
        if (!single) {
            res.status(404).send({ message: "Single not found" });
            return;
        }
        await db_1.db.delete(schema.singles).where((0, drizzle_orm_1.eq)(schema.singles.id, id));
        res.status(200).send({ message: "Single deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error: ${err}`,
        });
    }
};
