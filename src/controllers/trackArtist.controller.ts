import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { TrackArtist } from "../models";

export class TrackArtistController {
  static createTrackArtist: RequestHandler<{
    trackId: string;
    artistId: string;
  }> = async (req, res, next) => {
    const track = await db.query.tracks.findFirst({
      where: and(eq(schema.tracks.id, req.params.trackId)),
    });
    if (!track) {
      res.status(404).send({
        message: `Track not found with id : ${req.params.trackId}`,
      });
      return;
    }
    const artist = await db.query.artists.findFirst({
      where: and(eq(schema.artists.id, req.params.artistId)),
    });
    if (!artist) {
      res.status(404).send({
        message: `Artist not found with id : ${req.params.artistId}`,
      });
      return;
    }

    const trackArtists = await db.query.trackArtists.findFirst({
      where: and(
        eq(schema.trackArtists.artistId, req.params.artistId),
        eq(schema.trackArtists.trackId, req.params.trackId)
      ),
    });
    if (trackArtists) {
      res.status(404).send({
        message: "TrackArtist Already exist !",
      });
      return;
    }
    const trackArtist = await db
      .insert(schema.trackArtists)
      .values({
        artistId: req.params.artistId,
        trackId: req.params.trackId,
      })
      .$returningId();

    const createdTrackArtist = trackArtist[0];

    if (!createdTrackArtist) {
      res.status(400).send({
        message: "Some Error occured when creating Track Artist",
      });
    }
    res.status(200).send(createdTrackArtist as TrackArtist);
  };

  static FindTrackArtistByTrackIdAndArtistId: RequestHandler<{
    artistId: string;
    trackId: string;
  }> = async (req, res, next) => {
    const trackArtist = await db.query.trackArtists.findFirst({
      where: and(
        eq(schema.trackArtists.artistId, req.params.artistId),
        eq(schema.trackArtists.trackId, req.params.trackId)
      ),
    });
    if (!trackArtist) {
      res.status(400).send({
        message:
          "Error occured when getting Track Artist by trackId and artistId",
      });
    }
    res.status(200).send(trackArtist as TrackArtist);
  };

  static FindTrackArtistByTrackId: RequestHandler<{ trackId: string }> = async (
    req,
    res,
    next
  ) => {
    const trackArtist = await db.query.trackArtists.findFirst({
      where: and(eq(schema.trackArtists.trackId, req.params.trackId)),
    });
    if (!trackArtist) {
      res.status(400).send({
        message: "Error occured when getting Track Artist by trackId",
      });
    }
    res.status(200).send(trackArtist as TrackArtist);
  };

  static FindTrackArtistByArtistId: RequestHandler<{ artistId: string }> =
    async (req, res, next) => {
      const trackArtist = await db.query.trackArtists.findFirst({
        where: and(eq(schema.trackArtists.artistId, req.params.artistId)),
      });
      if (!trackArtist) {
        res.status(400).send({
          message: "Error occured when getting Track Artist by artistId",
        });
      }
      res.status(200).send(trackArtist as TrackArtist);
    };

  static FindTrackArtistById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    const trackArtist = await db.query.trackArtists.findFirst({
      where: and(eq(schema.trackArtists.id, req.params.id)),
    });
    if (!trackArtist) {
      res.status(400).send({
        message: "Error occured when getting Track Artist by id",
      });
    }
    res.status(200).send(trackArtist as TrackArtist);
  };
}
