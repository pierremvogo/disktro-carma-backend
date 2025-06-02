import { eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { SlugMiddleware } from "../middleware/slug.middleware";
import type { Track, TrackAlbum, TrackArtist } from "../models";
import slugify from "slugify";

export class TrackController {
  static Create: RequestHandler = async (req, res, next) => {
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

    // track.artists = res.trackArtists.map((a: TrackArtist) => a.artist as Artist)

    // // track.albums = res.trackAlbums.map(
    // //     (tc) => tc.album as Album
    // // )

    // delete track.trackArtists
    // delete track.trackAlbums

    res.status(200).send(trackById);
  };

  static FindTracksByArtistId: RequestHandler<{ artistId: string }> = async (
    req,
    res,
    next
  ) => {
    const tracksByArtist = await db.query.trackArtists.findMany({
      where: eq(schema.trackArtists.artistId, req.params.artistId),
    });
    if (tracksByArtist.length === 0) {
      res.status(400).send({
        message: `No Track  found with Artistid ${req.params.artistId}.`,
      });
      return;
    }
    res.status(200).send({
      data: tracksByArtist as TrackArtist[],
      message: "Succesffuly get tracksByArtist",
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
        message: `No Track  found with Artistid ${req.params.albumId}.`,
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
