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
exports.EditorPlaylistController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class EditorPlaylistController {
    // Reuse: enrich tracks (coverUrl/collectionType/Id/Title)
    static async getTracksWithCover(trackIds) {
        if (!trackIds.length)
            return [];
        return db_1.db
            .select({
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
    }
}
exports.EditorPlaylistController = EditorPlaylistController;
_a = EditorPlaylistController;
/**
 * FAN: GET /editorPlaylist/getAll?locale=en&limit=20
 */
EditorPlaylistController.GetAllPublished = async (req, res) => {
    try {
        const limit = Number(req.query.limit ?? 20);
        const locale = String(req.query.locale ?? "en");
        const playlists = await db_1.db.query.editorPlaylists.findMany({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.editorPlaylists.isPublished, true), (0, drizzle_orm_1.eq)(schema.editorPlaylists.locale, locale)),
            orderBy: [
                (0, drizzle_orm_1.desc)(schema.editorPlaylists.priority),
                (0, drizzle_orm_1.desc)(schema.editorPlaylists.createdAt),
            ],
            limit,
            with: {
                tracks: true, // editorPlaylistTracks rows
            },
        });
        // For each playlist, fetch tracks details + keep order by position
        const data = await Promise.all(playlists.map(async (p) => {
            const pivot = (p.tracks ?? []).sort((a, b) => a.position - b.position);
            const trackIds = pivot.map((x) => x.trackId);
            const tracks = await _a.getTracksWithCover(trackIds);
            // preserve ordering by pivot
            const mapById = new Map(tracks.map((t) => [t.id, t]));
            const ordered = trackIds
                .map((id) => mapById.get(id))
                .filter(Boolean);
            return {
                id: p.id,
                name: p.name,
                description: p.description ?? "",
                coverUrl: p.coverUrl ?? null,
                songCount: ordered.length,
                tracks: ordered, // full tracks
            };
        }));
        res.status(200).send({ message: "Editor playlists fetched", data });
    }
    catch (err) {
        console.error("GetAllPublished error:", err);
        res.status(500).send({ message: err });
    }
};
/**
 * FAN: GET /editorPlaylist/getById/:id
 */
EditorPlaylistController.GetById = async (req, res) => {
    try {
        const p = await db_1.db.query.editorPlaylists.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.editorPlaylists.id, req.params.id),
            with: { tracks: true },
        });
        if (!p) {
            res.status(404).send({ message: "Editor playlist not found" });
            return;
        }
        const pivot = (p.tracks ?? []).sort((a, b) => a.position - b.position);
        const trackIds = pivot.map((x) => x.trackId);
        const tracks = await _a.getTracksWithCover(trackIds);
        const mapById = new Map(tracks.map((t) => [t.id, t]));
        const ordered = trackIds
            .map((id) => mapById.get(id))
            .filter(Boolean);
        res.status(200).send({
            message: "Editor playlist fetched",
            data: {
                id: p.id,
                name: p.name,
                description: p.description ?? "",
                coverUrl: p.coverUrl ?? null,
                isPublished: p.isPublished,
                priority: p.priority,
                locale: p.locale,
                songCount: ordered.length,
                tracks: ordered,
            },
        });
    }
    catch (err) {
        console.error("GetById error:", err);
        res.status(500).send({ message: err });
    }
};
/**
 * ADMIN: POST /editorPlaylist/create
 * body: { name, description?, coverUrl?, locale?, priority? }
 */
EditorPlaylistController.Create = async (req, res) => {
    try {
        const createdByUserId = req.user?.id;
        const { name, description, coverUrl, locale, priority } = req.body;
        if (!name || String(name).trim() === "") {
            res.status(400).send({ message: "name is required" });
            return;
        }
        const inserted = await db_1.db
            .insert(schema.editorPlaylists)
            .values({
            name: String(name),
            description: description ?? null,
            coverUrl: coverUrl ?? null,
            locale: locale ?? "en",
            priority: Number(priority ?? 0),
            isPublished: false,
            createdByUserId: createdByUserId ?? null,
        })
            .$returningId();
        const created = inserted[0];
        if (!created) {
            res.status(400).send({ message: "Error creating editor playlist" });
            return;
        }
        res
            .status(201)
            .send({ message: "Editor playlist created", data: created });
    }
    catch (err) {
        console.error("Create editor playlist error:", err);
        res.status(500).send({ message: err });
    }
};
/**
 * ADMIN: POST /editorPlaylist/:id/addTrack/:trackId
 * body: { position? }
 */
EditorPlaylistController.AddTrack = async (req, res) => {
    try {
        const { id, trackId } = req.params;
        const position = Number(req.body?.position ?? 0);
        // prevent duplicates via unique index; catch conflict if needed
        const inserted = await db_1.db
            .insert(schema.editorPlaylistTracks)
            .values({
            editorPlaylistId: id,
            trackId,
            position,
        })
            .$returningId();
        res
            .status(201)
            .send({ message: "Track added to editor playlist", data: inserted[0] });
    }
    catch (err) {
        console.error("AddTrack error:", err);
        res.status(500).send({ message: err });
    }
};
/**
 * ADMIN: POST /editorPlaylist/:id/publish
 */
EditorPlaylistController.Publish = async (req, res) => {
    try {
        await db_1.db
            .update(schema.editorPlaylists)
            .set({ isPublished: true })
            .where((0, drizzle_orm_1.eq)(schema.editorPlaylists.id, req.params.id));
        res.status(200).send({ message: "Editor playlist published" });
    }
    catch (err) {
        console.error("Publish error:", err);
        res.status(500).send({ message: err });
    }
};
