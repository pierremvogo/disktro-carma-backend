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
    const year = new Date().getFullYear();
    const serial = await getNextSerialNumber(year);

    const isrcCode = generateISRC("FR", "6V8", year, serial);

    const trackSlug = slugify(req.body.title, { lower: true, strict: true });
    const existingTitle = await db.query.tracks.findFirst({
      where: eq(schema.tracks.slug, trackSlug),
    });

    if (existingTitle) {
      res
        .status(409)
        .json({ message: "An Track with this title already exists" });
      return;
    }
    const result = await db
      .insert(schema.tracks)
      .values({
        isrcCode: isrcCode,
        title: req.body.title,
        slug: trackSlug,
        duration: req.body.duration,
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
      message: "Successfuly created Track",
      data: createdTrack as Track,
    });
  };

  static FindAllTrack: RequestHandler = async (req, res, next) => {
    const allTracks = await db.query.tracks.findMany({
      columns: {
        id: true,
        title: true,
        isrcCode: true,
        duration: true,
        slug: true,
      },
    });

    if (allTracks.length === 0) {
      res.status(400).send({
        message: "No Tags found",
      });
      return;
    }
    res.status(200).send({
      data: allTracks as Track[],
      message: "Successfully get all tracks",
    });
  };

  static FindTrackById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    const result = await db.query.tracks.findFirst({
      where: eq(schema.tracks.id, req.params.id),
    });

    if (!result) {
      res.status(400).send({
        message: `No album found with id ${req.params.id}.`,
      });
      return;
    }

    const trackById: Track = { ...result } as Track;

    // track.artists = res.trackReleases.map((a: TrackRelease) => a.artist as Release)

    // // track.albums = res.trackAlbums.map(
    // //     (tc) => tc.album as Album
    // // )

    // delete track.trackReleases
    // delete track.trackAlbums

    res.status(200).send(trackById);
  };

  static FindTracksByReleaseId: RequestHandler<{ releaseId: string }> = async (
    req,
    res,
    next
  ) => {
    const tracksByRelease = await db.query.trackReleases.findMany({
      where: eq(schema.trackReleases.releaseId, req.params.releaseId),
    });
    if (tracksByRelease.length === 0) {
      res.status(400).send({
        message: `No Track  found with Releaseid ${req.params.releaseId}.`,
      });
      return;
    }
    res.status(200).send({
      data: tracksByRelease as TrackRelease[],
      message: "Succesffuly get tracksByRelease",
    });
  };

  static FindTracksByAlbumId: RequestHandler<{ albumId: string }> = async (
    req,
    res,
    next
  ) => {
    const tracksOnAlbum = await db.query.trackAlbums.findMany({
      where: eq(schema.trackAlbums.albumId, req.params.albumId),
    });
    if (tracksOnAlbum.length === 0) {
      res.status(400).send({
        message: `No Track  found with Releaseid ${req.params.albumId}.`,
      });
      return;
    }
    res.status(200).send({
      data: tracksOnAlbum as TrackAlbum[],
      message: "Succesffuly get tracksOnAlbum",
    });
  };

  static UpdateTrack: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const id = req.params.id;
      const { title, slug, duration } = req.body;

      // Vérifier que le track existe
      const existingTrack = await db.query.tracks.findFirst({
        where: eq(schema.tracks.id, id),
      });
      if (!existingTrack) {
        res.status(404).send({ message: "Track not found." });
        return;
      }

      // Mettre à jour les champs fournis
      await db
        .update(schema.tracks)
        .set({
          title: title ?? existingTrack.title,
          slug: slug ?? existingTrack.slug,
          duration: duration ?? existingTrack.duration,
        })
        .where(eq(schema.tracks.id, id));

      // Récupérer le track mis à jour
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

      // Vérifier que le track existe
      const existingTrack = await db.query.tracks.findFirst({
        where: eq(schema.tracks.id, id),
      });
      if (!existingTrack) {
        res.status(404).send({ message: "Track not found." });
        return;
      }

      // Supprimer le track
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
