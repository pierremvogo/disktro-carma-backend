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
exports.PlayListController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
const slugify_1 = __importDefault(require("slugify"));
class PlayListController {
    static async getTracksWithCover(trackIds) {
        if (!trackIds.length)
            return [];
        const rows = await db_1.db
            .select({
            // champs track existants
            id: schema.tracks.id,
            isrcCode: schema.tracks.isrcCode,
            title: schema.tracks.title,
            slug: schema.tracks.slug,
            type: schema.tracks.type,
            userId: schema.tracks.userId,
            duration: schema.tracks.duration,
            moodId: schema.tracks.moodId,
            audioUrl: schema.tracks.audioUrl,
            lyrics: schema.tracks.lyrics,
            signLanguageVideoUrl: schema.tracks.signLanguageVideoUrl,
            brailleFileUrl: schema.tracks.brailleFileUrl,
            createdAt: schema.tracks.createdAt,
            updatedAt: schema.tracks.updatedAt,
            // ✅ coverUrl + infos collection (single/ep/album)
            coverUrl: (0, drizzle_orm_1.sql) `
          COALESCE(${schema.singles.coverUrl}, ${schema.eps.coverUrl}, ${schema.albums.coverUrl})
        `.as("coverUrl"),
            collectionTitle: (0, drizzle_orm_1.sql) `
          COALESCE(${schema.singles.title}, ${schema.eps.title}, ${schema.albums.title})
        `.as("collectionTitle"),
            collectionId: (0, drizzle_orm_1.sql) `
          COALESCE(${schema.trackSingles.singleId}, ${schema.trackEps.epId}, ${schema.trackAlbums.albumId})
        `.as("collectionId"),
            collectionType: (0, drizzle_orm_1.sql) `
          CASE
            WHEN ${schema.trackSingles.singleId} IS NOT NULL THEN 'single'
            WHEN ${schema.trackEps.epId} IS NOT NULL THEN 'ep'
            WHEN ${schema.trackAlbums.albumId} IS NOT NULL THEN 'album'
            ELSE 'unknown'
          END
        `.as("collectionType"),
        })
            .from(schema.tracks)
            .leftJoin(schema.trackAlbums, (0, drizzle_orm_1.eq)(schema.trackAlbums.trackId, schema.tracks.id))
            .leftJoin(schema.albums, (0, drizzle_orm_1.eq)(schema.albums.id, schema.trackAlbums.albumId))
            .leftJoin(schema.trackEps, (0, drizzle_orm_1.eq)(schema.trackEps.trackId, schema.tracks.id))
            .leftJoin(schema.eps, (0, drizzle_orm_1.eq)(schema.eps.id, schema.trackEps.epId))
            .leftJoin(schema.trackSingles, (0, drizzle_orm_1.eq)(schema.trackSingles.trackId, schema.tracks.id))
            .leftJoin(schema.singles, (0, drizzle_orm_1.eq)(schema.singles.id, schema.trackSingles.singleId))
            .where((0, drizzle_orm_1.inArray)(schema.tracks.id, trackIds));
        return rows;
    }
}
exports.PlayListController = PlayListController;
_a = PlayListController;
PlayListController.Create = async (req, res, next) => {
    const playlistSlug = (0, slugify_1.default)(req.body.nom, { lower: true, strict: true });
    const existingPlayList = await db_1.db.query.playlists.findFirst({
        where: (0, drizzle_orm_1.eq)(schema.playlists.slug, playlistSlug),
    });
    if (existingPlayList) {
        res
            .status(409)
            .json({ message: "An playlist with this name already exists" });
        return;
    }
    const result = await db_1.db
        .insert(schema.playlists)
        .values({
        nom: req.body.nom,
        slug: playlistSlug,
        userId: req.body.userId,
    })
        .$returningId();
    const createdPlayList = result[0];
    if (!createdPlayList) {
        res.status(400).send({
            message: "Error while creating PlayList!",
        });
        return;
    }
    res.status(200).send({
        message: "Successfuly created PlayList",
        data: createdPlayList,
    });
};
PlayListController.FindAllPlayLists = async (req, res, next) => {
    const allPlayLists = await db_1.db.query.playlists.findMany({
        columns: {
            id: true,
            nom: true,
            slug: true,
            userId: true,
        },
    });
    if (!allPlayLists) {
        res.status(400).send({
            message: "Some error occurred: No PlayLists found",
        });
        return;
    }
    res.status(200).send({
        data: allPlayLists,
        message: "Successfully get all playlists",
    });
};
PlayListController.FindPlayListById = async (req, res, next) => {
    try {
        if (req.params.id == null) {
            res.status(400).send({
                message: "No playlist ID given.!",
            });
            return;
        }
        const result = await db_1.db.query.playlists.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.playlists.id, req.params.id),
            with: {
                trackPlayLists: {
                    with: {
                        track: true,
                    },
                },
            },
        });
        if (!result) {
            res.status(400).send({
                message: `no playlist with id ${req.params.id} found`,
            });
            return;
        }
        const playlist = { ...result };
        if (playlist == null) {
            res.status(400).send({
                message: `no playlist with id ${req.params.id} found`,
            });
            return;
        }
        else {
            const trackIds = result.trackPlayLists.map((tp) => tp.track.id);
            const enrichedTracks = await _a.getTracksWithCover(trackIds);
            playlist.tracks = enrichedTracks; // ou type Track & {coverUrl?:string}
            delete playlist.trackPlayLists;
            res.status(200).send({
                message: `Successfuly get playlist`,
                data: playlist,
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error`,
        });
    }
};
PlayListController.FindPlaylistsByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            res.status(400).send({
                message: "No user ID provided.",
            });
            return;
        }
        const results = await db_1.db.query.playlists.findMany({
            where: (0, drizzle_orm_1.eq)(schema.playlists.userId, userId),
            with: {
                trackPlayLists: {
                    with: {
                        track: true,
                    },
                },
            },
        });
        if (!results || results.length === 0) {
            res.status(404).send({
                message: `No playlists found for user with ID: ${userId}`,
            });
            return;
        }
        const playlists = await Promise.all(results.map(async (playlist) => {
            const trackIds = playlist.trackPlayLists.map((tp) => tp.track.id);
            const enrichedTracks = await _a.getTracksWithCover(trackIds);
            const { trackPlayLists, ...rest } = playlist;
            return {
                ...rest,
                tracks: enrichedTracks,
            };
        }));
        res.status(200).send({
            message: `Successfully retrieved ${playlists.length} playlist(s) for user ${userId}`,
            data: playlists,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Internal server error",
        });
    }
};
PlayListController.FindPlayListBySlug = async (req, res, next) => {
    try {
        if (req.params.slug == "") {
            res.status(400).send({
                message: `No playlist slug given.`,
            });
            return;
        }
        console.log(req.params.slug);
        const playlistBySlug = await db_1.db.query.playlists.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.playlists.slug, req.params.slug),
        });
        if (!playlistBySlug) {
            res.status(404).send({
                message: `PlayList by slug not found`,
            });
            return;
        }
        res.status(200).send({
            message: `Successfuly find playlist by slug.`,
            data: playlistBySlug,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server Error.`,
        });
    }
};
PlayListController.UpdatePlayList = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { nom } = req.body;
        if (!nom || nom.trim() === "") {
            res
                .status(400)
                .send({ message: "PlayList name is required for update." });
            return;
        }
        // Génère un nouveau slug à partir du nouveau nom
        const slug = (0, slugify_1.default)(nom, { lower: true, strict: true });
        // Vérifier que la playlist existe
        const existingPlayList = await db_1.db.query.playlists.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.playlists.id, id),
        });
        if (!existingPlayList) {
            res.status(404).send({ message: "PlayList not found." });
            return;
        }
        // Mettre à jour le playlist
        await db_1.db
            .update(schema.playlists)
            .set({ nom, slug })
            .where((0, drizzle_orm_1.eq)(schema.playlists.id, id));
        // Récupérer le playlist mis à jour
        const updatedPlayList = await db_1.db.query.playlists.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.playlists.id, id),
        });
        res.status(200).send({
            message: "PlayList updated successfully.",
            data: updatedPlayList,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error." });
    }
};
PlayListController.DeletePlayList = async (req, res, next) => {
    try {
        const id = req.params.id;
        // Vérifier que le playlist existe
        const existingPlayList = await db_1.db.query.playlists.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.playlists.id, id),
        });
        if (!existingPlayList) {
            res.status(404).send({ message: "PlayList not found." });
            return;
        }
        // Supprimer le playlist
        await db_1.db.delete(schema.playlists).where((0, drizzle_orm_1.eq)(schema.playlists.id, id));
        res.status(200).send({
            message: "PlayList deleted successfully.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error." });
    }
};
