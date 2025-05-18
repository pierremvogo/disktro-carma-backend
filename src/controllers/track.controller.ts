import { eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { SlugMiddleware } from "../middleware/slug.middleware";
import type { Track } from "../models";

export class TrackController {
  static Create: RequestHandler = async (req, res, next) => {
    const result = await db
      .insert(schema.tracks)
      .values({
        title: req.body.title,
        slug: req.body.slug,
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
    const tracksByArtist = await db.query.tracks.findMany({
      where: eq(schema.trackArtists.artistId, req.params.artistId),
    });
    if (!tracksByArtist) {
      res.status(400).send({
        message: `No Track  found with Artistid ${req.params.artistId}.`,
      });
      return;
    }
    res.status(200).send({
      data: tracksByArtist as Track[],
      message: "Succesffuly get tracksByArtist",
    });
  };

  static FindTracksByAlbumId: RequestHandler<{ albumId: string }> = async (
    req,
    res,
    next
  ) => {
    const tracksOnAlbum = await db.query.tracks.findMany({
      where: eq(schema.trackAlbums.albumId, req.params.albumId),
    });
    if (!tracksOnAlbum) {
      res.status(400).send({
        message: `No Track  found with Artistid ${req.body.artistId}.`,
      });
      return;
    }
    res.status(200).send({
      data: tracksOnAlbum as Track[],
      message: "Succesffuly get tracksOnAlbum",
    });
  };
}
