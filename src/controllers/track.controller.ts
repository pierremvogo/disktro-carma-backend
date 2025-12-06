import { eq, sql } from "drizzle-orm";
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
          isrcCode: true,
          duration: true,
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
}
