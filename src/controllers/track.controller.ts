import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import type { Track, TrackAlbum, TrackRelease } from "../models";
import slugify from "slugify";

export class TrackController {
  static Create: RequestHandler = async (req, res, next) => {
    function generateISRC(
      countryCode: string,
      registrantCode: string,
      year: number,
      serialNumber: number
    ): string {
      const yearPart = String(year).slice(-2);
      const serialPart = String(serialNumber).padStart(5, "0");

      return `${countryCode.toUpperCase()}${registrantCode.toUpperCase()}${yearPart}${serialPart}`;
    }

    async function getNextSerialNumber(year: number): Promise<number> {
      const startOfYear = new Date(`${year}-01-01T00:00:00Z`);
      const endOfYear = new Date(`${year}-12-31T23:59:59Z`);
      const result = await db
        .select({
          count: sql<number>`COUNT(*)`,
        })
        .from(schema.tracks)
        .where(sql`created_at BETWEEN ${startOfYear} AND ${endOfYear}`);

      return (result[0]?.count ?? 0) + 1;
    }

    try {
      const year = new Date().getFullYear();
      const serial = await getNextSerialNumber(year);

      const isrcCode = generateISRC("FR", "6V8", year, serial);

      const {
        title,
        userId,
        type,
        moodId,
        audioUrl,
        duration,

        // 🆕 champs accessibilité / contenu
        lyrics,
        signLanguageVideoUrl,
        brailleFileUrl,
      } = req.body;

      const trackSlug = slugify(title, { lower: true, strict: true });

      const existingTitle = await db.query.tracks.findFirst({
        where: eq(schema.tracks.slug, trackSlug),
      });

      if (existingTitle) {
        res
          .status(409)
          .json({ message: "A Track with this title already exists" });
        return;
      }

      const result = await db
        .insert(schema.tracks)
        .values({
          isrcCode,
          title,
          slug: trackSlug,
          userId,
          type,
          moodId,
          audioUrl,
          duration,

          // 🆕 champs
          lyrics,
          signLanguageVideoUrl,
          brailleFileUrl,
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
        data: createdTrack as Track,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error: ${err}`,
      });
    }
  };

  static FindAllTrack: RequestHandler = async (req, res, next) => {
    try {
      const allTracks = await db.query.tracks.findMany({
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
        data: allTracks as Track[],
        message: "Successfully get all tracks",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error: ${err}`,
      });
    }
  };

  static FindTrackById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const result = await db.query.tracks.findFirst({
        where: eq(schema.tracks.id, req.params.id),
      });

      if (!result) {
        res.status(400).send({
          message: `No track found with id ${req.params.id}.`,
        });
        return;
      }

      const trackById: Track = { ...result } as Track;

      res.status(200).send(trackById);
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error: ${err}`,
      });
    }
  };

  static FindTrackByUserId: RequestHandler<{ userId: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const userId = req.params.userId;

      const artist = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
      });

      if (!artist) {
        res.status(404).send({ message: "User not found with the given ID." });
        return;
      }

      const tracks = await db.query.tracks.findMany({
        where: eq(schema.tracks.userId, userId),
      });

      res.status(200).send({
        message: "Successfully retrieved all tracks for this artist.",
        tracks,
      });
    } catch (err) {
      console.error("Error retrieving tracks:", err);
      res.status(500).send({ message: "Internal server error." });
    }
  };

  static FindTracksByReleaseId: RequestHandler<{ releaseId: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const tracksByRelease = await db.query.trackReleases.findMany({
        where: eq(schema.trackReleases.releaseId, req.params.releaseId),
      });
      if (tracksByRelease.length === 0) {
        res.status(400).send({
          message: `No Track found with releaseId ${req.params.releaseId}.`,
        });
        return;
      }
      res.status(200).send({
        data: tracksByRelease as TrackRelease[],
        message: "Successfully get tracksByRelease",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: `Internal server error: ${err}` });
    }
  };

  static FindTracksByAlbumId: RequestHandler<{ albumId: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const tracksOnAlbum = await db.query.trackAlbums.findMany({
        where: eq(schema.trackAlbums.albumId, req.params.albumId),
      });
      if (tracksOnAlbum.length === 0) {
        res.status(400).send({
          message: `No Track found with albumId ${req.params.albumId}.`,
        });
        return;
      }
      res.status(200).send({
        data: tracksOnAlbum as TrackAlbum[],
        message: "Successfully get tracksOnAlbum",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: `Internal server error: ${err}` });
    }
  };

  static UpdateTrack: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const id = req.params.id;
      const {
        title,
        slug,
        duration,
        audioUrl,

        // 🆕 champs modifiables
        lyrics,
        signLanguageVideoUrl,
        brailleFileUrl,
        type,
        moodId,
        userId,
      } = req.body;

      const existingTrack = await db.query.tracks.findFirst({
        where: eq(schema.tracks.id, id),
      });
      if (!existingTrack) {
        res.status(404).send({ message: "Track not found." });
        return;
      }

      await db
        .update(schema.tracks)
        .set({
          title: title ?? existingTrack.title,
          slug: slug ?? existingTrack.slug,
          duration: duration ?? existingTrack.duration,
          audioUrl: audioUrl ?? existingTrack.audioUrl,

          // 🆕 champs accessibilité / contenu
          lyrics: lyrics ?? existingTrack.lyrics,
          signLanguageVideoUrl:
            signLanguageVideoUrl ?? existingTrack.signLanguageVideoUrl,
          brailleFileUrl: brailleFileUrl ?? existingTrack.brailleFileUrl,

          // éventuellement modifiables aussi
          type: type ?? existingTrack.type,
          moodId: moodId ?? existingTrack.moodId,
          userId: userId ?? existingTrack.userId,
        })
        .where(eq(schema.tracks.id, id));

      const updatedTrack = await db.query.tracks.findFirst({
        where: eq(schema.tracks.id, id),
      });

      res.status(200).send({
        message: "Track updated successfully.",
        data: updatedTrack as Track,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: `Internal server error: ${err}` });
    }
  };

  static DeleteTrack: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const id = req.params.id;

      const existingTrack = await db.query.tracks.findFirst({
        where: eq(schema.tracks.id, id),
      });
      if (!existingTrack) {
        res.status(404).send({ message: "Track not found." });
        return;
      }

      await db.delete(schema.tracks).where(eq(schema.tracks.id, id));

      res.status(200).send({
        message: "Track deleted successfully.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: `Internal server error: ${err}` });
    }
  };

  static FindTracksByArtistId: RequestHandler<{ artistId: string }> = async (
    req,
    res
  ) => {
    try {
      const artistId = req.params.artistId;

      // Vérifie que l'artiste existe
      const artist = await db.query.users.findFirst({
        where: eq(schema.users.id, artistId),
      });

      if (!artist) {
        res
          .status(404)
          .send({ message: "Artist not found with the given ID." });
        return;
      }

      // 1) Albums de l'artiste
      // ⚠️ adapte: albums.userId vs albums.artistId selon ton schema
      const artistAlbums = await db.query.albums.findMany({
        columns: { id: true },
        where: eq(schema.albums.userId, artistId),
      });
      const albumIds = artistAlbums.map((a) => a.id);

      const artistEps = await db.query.eps.findMany({
        columns: { id: true },
        where: eq(schema.eps.userId, artistId),
      });
      const epsIds = artistEps.map((r) => r.id);

      const artistSingles = await db.query.singles.findMany({
        columns: { id: true },
        where: eq(schema.singles.userId, artistId),
      });
      const singlesIds = artistSingles.map((r) => r.id);

      const trackIds: string[] = [];

      if (albumIds.length > 0) {
        const albumTrackLinks = await db.query.trackAlbums.findMany({
          columns: { trackId: true },
          where: inArray(schema.trackAlbums.albumId, albumIds),
        });
        trackIds.push(...albumTrackLinks.map((x) => x.trackId));
      }

      if (epsIds.length > 0) {
        const epTrackLinks = await db.query.trackEps.findMany({
          columns: { trackId: true },
          where: inArray(schema.trackEps.epId, epsIds),
        });
        trackIds.push(...epTrackLinks.map((x) => x.trackId));
      }

      if (singlesIds.length > 0) {
        const singleTrackLinks = await db.query.trackSingles.findMany({
          columns: { trackId: true },
          where: inArray(schema.trackReleases.releaseId, singlesIds),
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
      const tracks = await db.query.tracks.findMany({
        where: inArray(schema.tracks.id, uniqueTrackIds),
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
        message:
          "Successfully retrieved all tracks for this artist (strategy 1).",
        tracks,
      });
    } catch (err) {
      console.error("Error retrieving tracks (strategy 1):", err);
      res.status(500).send({ message: "Internal server error." });
    }
  };

  static FindTracksByGenreName: RequestHandler = async (req, res) => {
    try {
      const { name } = req.query;
      if (!name) {
        res
          .status(400)
          .send({ message: "Missing genre name in query (?name=...)" });
        return;
      }

      const genre = await db.query.tags.findFirst({
        where: eq(schema.tags.name, String(name)),
      });

      if (!genre) {
        res.status(404).send({ message: "Genre not found." });
        return;
      }

      // 1) artists liés au genre
      const links = await db.query.artistTags.findMany({
        columns: { artistId: true },
        where: eq(schema.artistTags.tagId, genre.id),
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
      const albums = await db.query.albums.findMany({
        columns: { id: true },
        where: inArray(schema.albums.userId, artistIds),
      });
      const albumIds = albums.map((a) => a.id);

      // Eps des artistes
      const eps = await db.query.eps.findMany({
        columns: { id: true },
        where: inArray(schema.eps.userId, artistIds),
      });
      const epIds = eps.map((r) => r.id);

      // Singles des artistes
      const singles = await db.query.eps.findMany({
        columns: { id: true },
        where: inArray(schema.singles.userId, artistIds),
      });
      const singleIds = singles.map((r) => r.id);

      const trackIds: string[] = [];

      if (albumIds.length > 0) {
        const albumTrackLinks = await db.query.trackAlbums.findMany({
          columns: { trackId: true },
          where: inArray(schema.trackAlbums.albumId, albumIds),
        });
        trackIds.push(...albumTrackLinks.map((x) => x.trackId));
      }

      if (singleIds.length > 0) {
        const singleTrackLinks = await db.query.trackSingles.findMany({
          columns: { trackId: true },
          where: inArray(schema.trackSingles.singleId, singleIds),
        });
        trackIds.push(...singleTrackLinks.map((x) => x.trackId));
      }

      if (epIds.length > 0) {
        const epTrackLinks = await db.query.trackEps.findMany({
          columns: { trackId: true },
          where: inArray(schema.trackEps.epId, epIds),
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

      const tracks = await db.query.tracks.findMany({
        where: inArray(schema.tracks.id, uniqueTrackIds),
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
    } catch (err) {
      console.error("Error retrieving tracks by genre (strategy 1):", err);
      res.status(500).send({ message: "Internal server error." });
    }
  };

  static FindTopStreamedTracksFeatured: RequestHandler = async (req, res) => {
    try {
      const limit = Number(req.query.limit ?? 6);

      const rows = await db
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
          streamsCount: sql<number>`COUNT(${schema.trackStreams.id})`.as(
            "streamsCount"
          ),

          // ✅ artist name (adapte le champ)
          artistName: schema.users.name, // ou schema.users.name

          // ✅ album/ep/single title + cover (priority: single > ep > album)
          collectionTitle: sql<string | null>`
          COALESCE(${schema.singles.title}, ${schema.eps.title}, ${schema.albums.title})
        `.as("collectionTitle"),

          coverUrl: sql<string | null>`
          COALESCE(${schema.singles.coverUrl}, ${schema.eps.coverUrl}, ${schema.albums.coverUrl})
        `.as("coverUrl"),

          collectionId: sql<string | null>`
  COALESCE(${schema.trackSingles.singleId}, ${schema.trackEps.epId}, ${schema.trackAlbums.albumId})
`.as("collectionId"),

          collectionType: sql<string>`
  CASE
    WHEN ${schema.trackSingles.singleId} IS NOT NULL THEN 'single'
    WHEN ${schema.trackEps.epId} IS NOT NULL THEN 'ep'
    ELSE 'album'
  END
`.as("collectionType"),
        })
        .from(schema.tracks)
        .leftJoin(
          schema.trackStreams,
          eq(schema.trackStreams.trackId, schema.tracks.id)
        )
        .leftJoin(schema.users, eq(schema.users.id, schema.tracks.userId))

        // album join
        .leftJoin(
          schema.trackAlbums,
          eq(schema.trackAlbums.trackId, schema.tracks.id)
        )
        .leftJoin(
          schema.albums,
          eq(schema.albums.id, schema.trackAlbums.albumId)
        )

        // ep join
        .leftJoin(
          schema.trackEps,
          eq(schema.trackEps.trackId, schema.tracks.id)
        )
        .leftJoin(schema.eps, eq(schema.eps.id, schema.trackEps.epId))

        // single join
        .leftJoin(
          schema.trackSingles,
          eq(schema.trackSingles.trackId, schema.tracks.id)
        )
        .leftJoin(
          schema.singles,
          eq(schema.singles.id, schema.trackSingles.singleId)
        )

        .groupBy(schema.tracks.id)
        .orderBy(desc(sql`streamsCount`))
        .limit(limit);

      res.status(200).send({
        message: "Successfully retrieved featured top-stream tracks.",
        tracks: rows,
      });
    } catch (err) {
      console.error("FindTopStreamedTracksFeatured error:", err);
      res.status(500).send({ message: "Internal server error." });
    }
  };

  static FindTracksByMoodName: RequestHandler = async (req, res) => {
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
      const moodSlug = slugify(moodName, { lower: true, strict: true });

      // ⚠️ adapte selon ton schema mood :
      // - si schema.mood.slug existe -> utilise slug
      // - sinon fallback sur name
      const mood = await db.query.mood.findFirst({
        where: eq(schema.mood.name, moodName),
      });

      if (!mood) {
        res.status(404).send({
          message: `Mood not found: ${moodName}`,
        });
        return;
      }
      const tracks = await db.query.tracks.findMany({
        where: eq(schema.tracks.moodId, mood.id),
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
    } catch (err) {
      console.error("Error retrieving tracks by mood name:", err);
      res.status(500).send({ message: "Internal server error." });
    }
  };
}
