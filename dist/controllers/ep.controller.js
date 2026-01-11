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
exports.EpController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
const slugify_1 = __importDefault(require("slugify"));
class EpController {
}
exports.EpController = EpController;
_a = EpController;
EpController.create = async (req, res, next) => {
    try {
        const { title, duration, userId, coverUrl, coverFileName, 
        // 👉 nouveaux champs
        authors, producers, lyricists, musiciansVocals, musiciansPianoKeyboards, musiciansWinds, musiciansPercussion, musiciansStrings, mixingEngineer, masteringEngineer, } = req.body;
        if (!title || !userId || !coverUrl) {
            res.status(400).json({
                message: "title, userId et coverUrl sont requis",
            });
            return;
        }
        const epSlug = (0, slugify_1.default)(title, { lower: true, strict: true });
        const existingName = await db_1.db.query.eps.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.eps.slug, epSlug),
        });
        if (existingName) {
            res
                .status(409)
                .json({ message: "An ep with this name already exists" });
            return;
        }
        const ep = await db_1.db
            .insert(schema.eps)
            .values({
            title,
            slug: epSlug,
            userId,
            duration,
            coverUrl,
            coverFileName,
            // 🆕 crédits
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
        const createdEp = ep[0];
        if (!createdEp) {
            res.status(400).send({
                message: "Error occurred when creating ep",
            });
            return;
        }
        res.status(200).send({
            message: "Ep created successfully",
            data: createdEp,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Internal server error",
        });
    }
};
EpController.FindAllEps = async (req, res, next) => {
    try {
        const allEps = await db_1.db.query.eps.findMany({
            columns: {
                id: true,
                title: true,
                slug: true,
                duration: true,
                coverUrl: true,
                coverFileName: true,
                // tu peux choisir ce que tu exposes
                authors: true,
                producers: true,
                mixingEngineer: true,
                masteringEngineer: true,
            },
        });
        if (allEps.length === 0) {
            res.status(400).send({
                message: "No Eps found",
            });
            return;
        }
        res.status(200).send({
            data: allEps,
            message: "Successfully get all eps",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Internal server error",
        });
    }
};
EpController.FindEpByArtistAndSlug = async (req, res, next) => {
    try {
        const coll = await db_1.db
            .select({
            id: schema.eps.id,
            title: schema.eps.title,
            slug: schema.eps.slug,
            duration: schema.eps.duration,
            coverUrl: schema.eps.coverUrl,
            coverFileName: schema.eps.coverFileName,
            // 🆕 crédits
            authors: schema.eps.authors,
            producers: schema.eps.producers,
            lyricists: schema.eps.lyricists,
            musiciansVocals: schema.eps.musiciansVocals,
            musiciansPianoKeyboards: schema.eps.musiciansPianoKeyboards,
            musiciansWinds: schema.eps.musiciansWinds,
            musiciansPercussion: schema.eps.musiciansPercussion,
            musiciansStrings: schema.eps.musiciansStrings,
            mixingEngineer: schema.eps.mixingEngineer,
            masteringEngineer: schema.eps.masteringEngineer,
            tracks: schema.tracks,
        })
            .from(schema.eps)
            .innerJoin(schema.epArtists, (0, drizzle_orm_1.eq)(schema.eps.id, schema.epArtists.epId))
            .innerJoin(schema.artists, (0, drizzle_orm_1.eq)(schema.artists.id, schema.epArtists.artistId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.eps.slug, req.body.epSlug), (0, drizzle_orm_1.eq)(schema.artists.slug, req.body.artistSlug)))
            .limit(1)
            .execute();
        if (!coll[0]) {
            res.status(404).send({
                message: "Ep not found for this artist and slug",
            });
            return;
        }
        res.status(200).send({
            message: "Get ep by artist and slug successfully",
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
EpController.FindEpById = async (req, res, next) => {
    try {
        const ep = await db_1.db.query.eps.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.eps.id, req.params.id),
            with: {
                trackEps: {
                    with: {
                        track: true,
                    },
                },
                epTags: {
                    with: {
                        tag: true,
                    },
                },
            },
        });
        if (!ep) {
            res.status(400).send({
                message: `No ep found with id ${req.params.id}.`,
            });
            return;
        }
        const a = { ...ep };
        if (a) {
            a.tags = ep?.epTags.map((a) => a.tag);
            a.tracks = ep?.trackEps.map((t) => t.track);
            delete a.epTags;
            delete a.trackEps;
            res.status(200).send({
                message: `Successfully get Ep`,
                ep: a,
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error.`,
        });
    }
};
EpController.FindEpsByUserId = async (req, res, next) => {
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
        const eps = await db_1.db.query.eps.findMany({
            where: (0, drizzle_orm_1.eq)(schema.eps.userId, userId),
            with: {
                user: true,
                trackEps: {
                    with: {
                        track: true,
                    },
                },
            },
        });
        if (!eps || eps.length === 0) {
            res.status(200).send({
                message: "Successfully retrieved all eps for this artist.",
                eps: [],
            });
            return;
        }
        // ========== STATS STREAMS POUR TOUS LES EPS ==========
        // Récupérer tous les trackIds de tous les EPs
        const allTrackIds = eps.flatMap((ep) => ep.trackEps.map((te) => te.trackId));
        // Si aucun track, on renvoie les eps tels quels, avec stats à zéro
        if (allTrackIds.length === 0) {
            const epsWithStats = eps.map((ep) => ({
                ...ep,
                streamsCount: 0,
                monthlyStreamsCount: 0,
                listenersCount: 0,
                topLocations: [],
            }));
            res.status(200).send({
                message: "Successfully retrieved all eps for this artist.",
                eps: epsWithStats,
            });
            return;
        }
        // 1️⃣ Récupérer tous les streams pour ces tracks
        const allStreams = await db_1.db.query.trackStreams.findMany({
            where: (0, drizzle_orm_1.inArray)(schema.trackStreams.trackId, allTrackIds),
        });
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        // 2️⃣ Pour chaque EP, calculer les stats à partir des streams
        const epsWithStats = eps.map((ep) => {
            const epTrackIds = ep.trackEps.map((te) => te.trackId);
            const streamsForEp = allStreams.filter((s) => epTrackIds.includes(s.trackId));
            const streamsCount = streamsForEp.length;
            const monthlyStreamsCount = streamsForEp.filter((s) => s.createdAt >= thirtyDaysAgo).length;
            const listenersSet = new Set(streamsForEp
                .map((s) => s.userId)
                .filter((id) => !!id && id.length > 0));
            const listenersCount = listenersSet.size;
            // Agrégation des streams par pays
            const locationMap = new Map();
            for (const s of streamsForEp) {
                const country = s.country || "Unknown";
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
            return {
                ...ep,
                streamsCount,
                monthlyStreamsCount,
                listenersCount,
                topLocations,
            };
        });
        res.status(200).send({
            message: "Successfully retrieved all eps for this artist.",
            eps: epsWithStats,
        });
    }
    catch (err) {
        console.error("Error retrieving eps:", err);
        res.status(500).send({ message: "Internal server error." });
    }
};
EpController.UpdateEp = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedFields = {};
        // Title + slug uniquement si title fourni
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
        // 🆕 crédits
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
            .update(schema.eps)
            .set(updatedFields)
            .where((0, drizzle_orm_1.eq)(schema.eps.id, id));
        // Récupérer l'ep mis à jour
        const updatedEp = await db_1.db.query.eps.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.eps.id, id),
        });
        if (!updatedEp) {
            res.status(404).send({ message: "Ep not found" });
            return;
        }
        res.status(200).send({
            message: "Ep updated successfully",
            data: updatedEp,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error: ${err}`,
        });
    }
};
EpController.DeleteEp = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ep = await db_1.db.query.eps.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.eps.id, id),
        });
        if (!ep) {
            res.status(404).send({ message: "Ep not found" });
            return;
        }
        await db_1.db.delete(schema.eps).where((0, drizzle_orm_1.eq)(schema.eps.id, id));
        res.status(200).send({ message: "Ep deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error: ${err}`,
        });
    }
};
