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
exports.TrackController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
const slugify_1 = __importDefault(require("slugify"));
class TrackController {
}
exports.TrackController = TrackController;
_a = TrackController;
TrackController.Create = async (req, res, next) => {
    function generateISRC(countryCode, registrantCode, year, serialNumber) {
        const yearPart = String(year).slice(-2);
        const serialPart = String(serialNumber).padStart(5, "0");
        return `${countryCode.toUpperCase()}${registrantCode.toUpperCase()}${yearPart}${serialPart}`;
    }
    async function getNextSerialNumber(year) {
        const startOfYear = new Date(`${year}-01-01T00:00:00Z`);
        const endOfYear = new Date(`${year}-12-31T23:59:59Z`);
        const result = await db_1.db
            .select({
            count: (0, drizzle_orm_1.sql) `COUNT(*)`,
        })
            .from(schema.tracks)
            .where((0, drizzle_orm_1.sql) `created_at BETWEEN ${startOfYear} AND ${endOfYear}`);
        return (result[0]?.count ?? 0) + 1;
    }
    try {
        const year = new Date().getFullYear();
        const serial = await getNextSerialNumber(year);
        const isrcCode = generateISRC("FR", "6V8", year, serial);
        const { title, userId, type, moodId, audioUrl, audioFileName, duration, 
        // 🆕 champs accessibilité / contenu
        lyrics, signLanguageVideoUrl, signLanguageFileName, brailleFileName, brailleFileUrl, } = req.body;
        const trackSlug = (0, slugify_1.default)(title, { lower: true, strict: true });
        const existingTitle = await db_1.db.query.tracks.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.tracks.slug, trackSlug),
        });
        if (existingTitle) {
            res
                .status(409)
                .json({ message: "A Track with this title already exists" });
            return;
        }
        const result = await db_1.db
            .insert(schema.tracks)
            .values({
            isrcCode,
            title,
            slug: trackSlug,
            userId,
            type,
            moodId,
            audioUrl,
            audioFileName,
            duration,
            // 🆕 champs
            lyrics,
            signLanguageVideoUrl,
            signLanguageFileName,
            brailleFileUrl,
            brailleFileName,
        })
            .$returningId();
        const createdTrack = result[0];
        if (!createdTrack) {
            res.status(400).send({
                message: "Error while creating Track!",
            });
            return;
        }
        res.status(200).send({
            message: "Successfully created Track",
            data: createdTrack,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error: ${err}`,
        });
    }
};
TrackController.FindAllTrack = async (req, res, next) => {
    try {
        const allTracks = await db_1.db.query.tracks.findMany({
            columns: {
                id: true,
                title: true,
                moodId: true,
                audioUrl: true,
                isrcCode: true,
                duration: true,
                signLanguageVideoUrl: true,
                lyrics: true,
                brailleFileUrl: true,
                userId: true,
                slug: true,
                type: true,
                // tu peux exposer plus si tu veux (audioUrl, moodId, etc.)
            },
        });
        if (allTracks.length === 0) {
            res.status(400).send({
                message: "No Tracks found",
            });
            return;
        }
        res.status(200).send({
            data: allTracks,
            message: "Successfully get all tracks",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error: ${err}`,
        });
    }
};
TrackController.FindTrackById = async (req, res, next) => {
    try {
        const result = await db_1.db.query.tracks.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.tracks.id, req.params.id),
        });
        if (!result) {
            res.status(400).send({
                message: `No track found with id ${req.params.id}.`,
            });
            return;
        }
        const trackById = { ...result };
        res.status(200).send(trackById);
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error: ${err}`,
        });
    }
};
TrackController.FindTrackByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const artist = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, userId),
        });
        if (!artist) {
            res.status(404).send({ message: "User not found with the given ID." });
            return;
        }
        const tracks = await db_1.db.query.tracks.findMany({
            where: (0, drizzle_orm_1.eq)(schema.tracks.userId, userId),
        });
        res.status(200).send({
            message: "Successfully retrieved all tracks for this artist.",
            tracks,
        });
    }
    catch (err) {
        console.error("Error retrieving tracks:", err);
        res.status(500).send({ message: "Internal server error." });
    }
};
TrackController.FindTracksByReleaseId = async (req, res, next) => {
    try {
        const tracksByRelease = await db_1.db.query.trackReleases.findMany({
            where: (0, drizzle_orm_1.eq)(schema.trackReleases.releaseId, req.params.releaseId),
        });
        if (tracksByRelease.length === 0) {
            res.status(400).send({
                message: `No Track found with releaseId ${req.params.releaseId}.`,
            });
            return;
        }
        res.status(200).send({
            data: tracksByRelease,
            message: "Successfully get tracksByRelease",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: `Internal server error: ${err}` });
    }
};
TrackController.FindTracksByAlbumId = async (req, res, next) => {
    try {
        const tracksOnAlbum = await db_1.db.query.trackAlbums.findMany({
            where: (0, drizzle_orm_1.eq)(schema.trackAlbums.albumId, req.params.albumId),
        });
        if (tracksOnAlbum.length === 0) {
            res.status(400).send({
                message: `No Track found with albumId ${req.params.albumId}.`,
            });
            return;
        }
        res.status(200).send({
            data: tracksOnAlbum,
            message: "Successfully get tracksOnAlbum",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: `Internal server error: ${err}` });
    }
};
TrackController.UpdateTrack = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { title, slug, duration, audioUrl, 
        // 🆕 champs modifiables
        lyrics, signLanguageVideoUrl, brailleFileUrl, type, moodId, userId, } = req.body;
        const existingTrack = await db_1.db.query.tracks.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.tracks.id, id),
        });
        if (!existingTrack) {
            res.status(404).send({ message: "Track not found." });
            return;
        }
        await db_1.db
            .update(schema.tracks)
            .set({
            title: title ?? existingTrack.title,
            slug: slug ?? existingTrack.slug,
            duration: duration ?? existingTrack.duration,
            audioUrl: audioUrl ?? existingTrack.audioUrl,
            // 🆕 champs accessibilité / contenu
            lyrics: lyrics ?? existingTrack.lyrics,
            signLanguageVideoUrl: signLanguageVideoUrl ?? existingTrack.signLanguageVideoUrl,
            brailleFileUrl: brailleFileUrl ?? existingTrack.brailleFileUrl,
            // éventuellement modifiables aussi
            type: type ?? existingTrack.type,
            moodId: moodId ?? existingTrack.moodId,
            userId: userId ?? existingTrack.userId,
        })
            .where((0, drizzle_orm_1.eq)(schema.tracks.id, id));
        const updatedTrack = await db_1.db.query.tracks.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.tracks.id, id),
        });
        res.status(200).send({
            message: "Track updated successfully.",
            data: updatedTrack,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: `Internal server error: ${err}` });
    }
};
TrackController.DeleteTrack = async (req, res, next) => {
    try {
        const id = req.params.id;
        const existingTrack = await db_1.db.query.tracks.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.tracks.id, id),
        });
        if (!existingTrack) {
            res.status(404).send({ message: "Track not found." });
            return;
        }
        await db_1.db.delete(schema.tracks).where((0, drizzle_orm_1.eq)(schema.tracks.id, id));
        res.status(200).send({
            message: "Track deleted successfully.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: `Internal server error: ${err}` });
    }
};
TrackController.FindTracksByArtistId = async (req, res) => {
    try {
        const artistId = req.params.artistId;
        // Vérifie que l'artiste existe
        const artist = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, artistId),
        });
        if (!artist) {
            res
                .status(404)
                .send({ message: "Artist not found with the given ID." });
            return;
        }
        // 1) Albums de l'artiste
        // ⚠️ adapte: albums.userId vs albums.artistId selon ton schema
        const artistAlbums = await db_1.db.query.albums.findMany({
            columns: { id: true },
            where: (0, drizzle_orm_1.eq)(schema.albums.userId, artistId),
        });
        const albumIds = artistAlbums.map((a) => a.id);
        const artistEps = await db_1.db.query.eps.findMany({
            columns: { id: true },
            where: (0, drizzle_orm_1.eq)(schema.eps.userId, artistId),
        });
        const epsIds = artistEps.map((r) => r.id);
        const artistSingles = await db_1.db.query.singles.findMany({
            columns: { id: true },
            where: (0, drizzle_orm_1.eq)(schema.singles.userId, artistId),
        });
        const singlesIds = artistSingles.map((r) => r.id);
        const trackIds = [];
        if (albumIds.length > 0) {
            const albumTrackLinks = await db_1.db.query.trackAlbums.findMany({
                columns: { trackId: true },
                where: (0, drizzle_orm_1.inArray)(schema.trackAlbums.albumId, albumIds),
            });
            trackIds.push(...albumTrackLinks.map((x) => x.trackId));
        }
        if (epsIds.length > 0) {
            const epTrackLinks = await db_1.db.query.trackEps.findMany({
                columns: { trackId: true },
                where: (0, drizzle_orm_1.inArray)(schema.trackEps.epId, epsIds),
            });
            trackIds.push(...epTrackLinks.map((x) => x.trackId));
        }
        if (singlesIds.length > 0) {
            const singleTrackLinks = await db_1.db.query.trackSingles.findMany({
                columns: { trackId: true },
                where: (0, drizzle_orm_1.inArray)(schema.trackReleases.releaseId, singlesIds),
            });
            trackIds.push(...singleTrackLinks.map((x) => x.trackId));
        }
        const uniqueTrackIds = Array.from(new Set(trackIds));
        if (uniqueTrackIds.length === 0) {
            res.status(200).send({
                message: "No tracks found for this artist.",
                tracks: [],
            });
            return;
        }
        // 4) Récupère les tracks
        const tracks = await db_1.db.query.tracks.findMany({
            where: (0, drizzle_orm_1.inArray)(schema.tracks.id, uniqueTrackIds),
            columns: {
                id: true,
                title: true,
                moodId: true,
                audioUrl: true,
                isrcCode: true,
                duration: true,
                signLanguageVideoUrl: true,
                lyrics: true,
                brailleFileUrl: true,
                userId: true,
                slug: true,
                type: true,
            },
        });
        res.status(200).send({
            message: "Successfully retrieved all tracks for this artist (strategy 1).",
            tracks,
        });
    }
    catch (err) {
        console.error("Error retrieving tracks (strategy 1):", err);
        res.status(500).send({ message: "Internal server error." });
    }
};
TrackController.FindTracksByGenreName = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            res
                .status(400)
                .send({ message: "Missing genre name in query (?name=...)" });
            return;
        }
        const genre = await db_1.db.query.tags.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.tags.name, String(name)),
        });
        if (!genre) {
            res.status(404).send({ message: "Genre not found." });
            return;
        }
        // 1) artists liés au genre
        const links = await db_1.db.query.artistTags.findMany({
            columns: { artistId: true },
            where: (0, drizzle_orm_1.eq)(schema.artistTags.tagId, genre.id),
        });
        const artistIds = Array.from(new Set(links.map((l) => l.artistId)));
        if (artistIds.length === 0) {
            res
                .status(200)
                .send({ message: "No artists for this genre.", tracks: [] });
            return;
        }
        // 2) pour chaque artiste -> récupérer les tracks via stratégie 1
        // => ici on fait en DB directement (plus propre) :
        // albums/release ids -> track ids -> tracks
        // Albums des artistes
        const albums = await db_1.db.query.albums.findMany({
            columns: { id: true },
            where: (0, drizzle_orm_1.inArray)(schema.albums.userId, artistIds),
        });
        const albumIds = albums.map((a) => a.id);
        // Eps des artistes
        const eps = await db_1.db.query.eps.findMany({
            columns: { id: true },
            where: (0, drizzle_orm_1.inArray)(schema.eps.userId, artistIds),
        });
        const epIds = eps.map((r) => r.id);
        // Singles des artistes
        const singles = await db_1.db.query.eps.findMany({
            columns: { id: true },
            where: (0, drizzle_orm_1.inArray)(schema.singles.userId, artistIds),
        });
        const singleIds = singles.map((r) => r.id);
        const trackIds = [];
        if (albumIds.length > 0) {
            const albumTrackLinks = await db_1.db.query.trackAlbums.findMany({
                columns: { trackId: true },
                where: (0, drizzle_orm_1.inArray)(schema.trackAlbums.albumId, albumIds),
            });
            trackIds.push(...albumTrackLinks.map((x) => x.trackId));
        }
        if (singleIds.length > 0) {
            const singleTrackLinks = await db_1.db.query.trackSingles.findMany({
                columns: { trackId: true },
                where: (0, drizzle_orm_1.inArray)(schema.trackSingles.singleId, singleIds),
            });
            trackIds.push(...singleTrackLinks.map((x) => x.trackId));
        }
        if (epIds.length > 0) {
            const epTrackLinks = await db_1.db.query.trackEps.findMany({
                columns: { trackId: true },
                where: (0, drizzle_orm_1.inArray)(schema.trackEps.epId, epIds),
            });
            trackIds.push(...epTrackLinks.map((x) => x.trackId));
        }
        const uniqueTrackIds = Array.from(new Set(trackIds));
        if (uniqueTrackIds.length === 0) {
            res
                .status(200)
                .send({ message: "No tracks found for this genre.", tracks: [] });
            return;
        }
        const tracks = await db_1.db.query.tracks.findMany({
            where: (0, drizzle_orm_1.inArray)(schema.tracks.id, uniqueTrackIds),
            columns: {
                id: true,
                title: true,
                moodId: true,
                audioUrl: true,
                isrcCode: true,
                duration: true,
                signLanguageVideoUrl: true,
                lyrics: true,
                brailleFileUrl: true,
                userId: true,
                slug: true,
                type: true,
            },
        });
        res.status(200).send({
            message: "Successfully retrieved tracks for this genre (strategy 1).",
            genre: { id: genre.id, name: genre.name, slug: genre.slug },
            tracks,
        });
    }
    catch (err) {
        console.error("Error retrieving tracks by genre (strategy 1):", err);
        res.status(500).send({ message: "Internal server error." });
    }
};
TrackController.FindTopStreamedTracksFeatured = async (req, res) => {
    try {
        const limit = Number(req.query.limit ?? 6);
        const rows = await db_1.db
            .select({
            id: schema.tracks.id,
            title: schema.tracks.title,
            audioUrl: schema.tracks.audioUrl,
            duration: schema.tracks.duration,
            lyrics: schema.tracks.lyrics,
            signLanguageVideoUrl: schema.tracks.signLanguageVideoUrl,
            brailleFileUrl: schema.tracks.brailleFileUrl,
            userId: schema.tracks.userId,
            // ✅ streams
            streamsCount: (0, drizzle_orm_1.sql) `COUNT(${schema.trackStreams.id})`.as("streamsCount"),
            // ✅ artist name (adapte le champ)
            artistName: schema.users.name, // ou schema.users.name
            // ✅ album/ep/single title + cover (priority: single > ep > album)
            collectionTitle: (0, drizzle_orm_1.sql) `
          COALESCE(${schema.singles.title}, ${schema.eps.title}, ${schema.albums.title})
        `.as("collectionTitle"),
            coverUrl: (0, drizzle_orm_1.sql) `
          COALESCE(${schema.singles.coverUrl}, ${schema.eps.coverUrl}, ${schema.albums.coverUrl})
        `.as("coverUrl"),
            collectionId: (0, drizzle_orm_1.sql) `
  COALESCE(${schema.trackSingles.singleId}, ${schema.trackEps.epId}, ${schema.trackAlbums.albumId})
`.as("collectionId"),
            collectionType: (0, drizzle_orm_1.sql) `
  CASE
    WHEN ${schema.trackSingles.singleId} IS NOT NULL THEN 'single'
    WHEN ${schema.trackEps.epId} IS NOT NULL THEN 'ep'
    ELSE 'album'
  END
`.as("collectionType"),
        })
            .from(schema.tracks)
            .leftJoin(schema.trackStreams, (0, drizzle_orm_1.eq)(schema.trackStreams.trackId, schema.tracks.id))
            .leftJoin(schema.users, (0, drizzle_orm_1.eq)(schema.users.id, schema.tracks.userId))
            // album join
            .leftJoin(schema.trackAlbums, (0, drizzle_orm_1.eq)(schema.trackAlbums.trackId, schema.tracks.id))
            .leftJoin(schema.albums, (0, drizzle_orm_1.eq)(schema.albums.id, schema.trackAlbums.albumId))
            // ep join
            .leftJoin(schema.trackEps, (0, drizzle_orm_1.eq)(schema.trackEps.trackId, schema.tracks.id))
            .leftJoin(schema.eps, (0, drizzle_orm_1.eq)(schema.eps.id, schema.trackEps.epId))
            // single join
            .leftJoin(schema.trackSingles, (0, drizzle_orm_1.eq)(schema.trackSingles.trackId, schema.tracks.id))
            .leftJoin(schema.singles, (0, drizzle_orm_1.eq)(schema.singles.id, schema.trackSingles.singleId))
            .groupBy(schema.tracks.id)
            .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sql) `streamsCount`))
            .limit(limit);
        res.status(200).send({
            message: "Successfully retrieved featured top-stream tracks.",
            tracks: rows,
        });
    }
    catch (err) {
        console.error("FindTopStreamedTracksFeatured error:", err);
        res.status(500).send({ message: "Internal server error." });
    }
};
// ...
TrackController.FindNewReleases = async (req, res) => {
    try {
        const limit = Number(req.query.limit ?? 12);
        const rows = await db_1.db
            .select({
            id: schema.tracks.id,
            title: schema.tracks.title,
            audioUrl: schema.tracks.audioUrl,
            duration: schema.tracks.duration,
            createdAt: schema.tracks.createdAt,
            lyrics: schema.tracks.lyrics,
            signLanguageVideoUrl: schema.tracks.signLanguageVideoUrl,
            brailleFileUrl: schema.tracks.brailleFileUrl,
            userId: schema.tracks.userId,
            // ✅ artist name (adapte le champ si tu as name/username)
            artistName: schema.users.username,
            // ✅ album/ep/single title + cover (priority single > ep > album)
            collectionTitle: (0, drizzle_orm_1.sql) `
            COALESCE(${schema.singles.title}, ${schema.eps.title}, ${schema.albums.title})
          `.as("collectionTitle"),
            coverUrl: (0, drizzle_orm_1.sql) `
            COALESCE(${schema.singles.coverUrl}, ${schema.eps.coverUrl}, ${schema.albums.coverUrl})
          `.as("coverUrl"),
            // ✅ pour que le player puisse charger toute la collection
            collectionId: (0, drizzle_orm_1.sql) `
            COALESCE(${schema.trackSingles.singleId}, ${schema.trackEps.epId}, ${schema.trackAlbums.albumId})
          `.as("collectionId"),
            collectionType: (0, drizzle_orm_1.sql) `
            CASE
              WHEN ${schema.trackSingles.singleId} IS NOT NULL THEN 'single'
              WHEN ${schema.trackEps.epId} IS NOT NULL THEN 'ep'
              ELSE 'album'
            END
          `.as("collectionType"),
        })
            .from(schema.tracks)
            .leftJoin(schema.users, (0, drizzle_orm_1.eq)(schema.users.id, schema.tracks.userId))
            .leftJoin(schema.trackAlbums, (0, drizzle_orm_1.eq)(schema.trackAlbums.trackId, schema.tracks.id))
            .leftJoin(schema.albums, (0, drizzle_orm_1.eq)(schema.albums.id, schema.trackAlbums.albumId))
            .leftJoin(schema.trackEps, (0, drizzle_orm_1.eq)(schema.trackEps.trackId, schema.tracks.id))
            .leftJoin(schema.eps, (0, drizzle_orm_1.eq)(schema.eps.id, schema.trackEps.epId))
            .leftJoin(schema.trackSingles, (0, drizzle_orm_1.eq)(schema.trackSingles.trackId, schema.tracks.id))
            .leftJoin(schema.singles, (0, drizzle_orm_1.eq)(schema.singles.id, schema.trackSingles.singleId))
            .orderBy((0, drizzle_orm_1.desc)(schema.tracks.createdAt))
            .limit(limit);
        res.status(200).send({
            message: "Successfully retrieved new releases.",
            tracks: rows,
        });
    }
    catch (err) {
        console.error("FindNewReleases error:", err);
        res.status(500).send({ message: "Internal server error." });
    }
};
TrackController.FindTracksByMoodName = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            res.status(400).send({
                message: "Missing mood name in query. Use ?name=happy",
            });
            return;
        }
        const moodName = String(name).trim();
        // robuste: on compare sur slug si tu en as, sinon on compare name
        const moodSlug = (0, slugify_1.default)(moodName, { lower: true, strict: true });
        // ⚠️ adapte selon ton schema mood :
        // - si schema.mood.slug existe -> utilise slug
        // - sinon fallback sur name
        const mood = await db_1.db.query.mood.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.mood.name, moodName),
        });
        if (!mood) {
            res.status(404).send({
                message: `Mood not found: ${moodName}`,
            });
            return;
        }
        const tracks = await db_1.db.query.tracks.findMany({
            where: (0, drizzle_orm_1.eq)(schema.tracks.moodId, mood.id),
            columns: {
                id: true,
                title: true,
                moodId: true,
                audioUrl: true,
                isrcCode: true,
                duration: true,
                signLanguageVideoUrl: true,
                lyrics: true,
                brailleFileUrl: true,
                userId: true,
                slug: true,
                type: true,
            },
        });
        res.status(200).send({
            message: "Successfully retrieved tracks by mood name.",
            mood: { id: mood.id, name: mood.name },
            tracks,
        });
    }
    catch (err) {
        console.error("Error retrieving tracks by mood name:", err);
        res.status(500).send({ message: "Internal server error." });
    }
};
