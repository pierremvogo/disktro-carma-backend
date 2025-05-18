import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { TrackAlbum } from "../models";

export class TrackAlbumController {
  static createTrackAlbum: RequestHandler<{
    trackId: string;
    albumId: string;
  }> = async (req, res, next) => {
    const album = await db.query.albums.findFirst({
      where: and(eq(schema.albums.id, req.params.albumId)),
    });
    if (!album) {
      res.status(400).send({
        message: `Album not found with id : ${req.params.albumId}`,
      });
      return;
    }
    const track = await db.query.tracks.findFirst({
      where: and(eq(schema.tracks.id, req.params.trackId)),
    });
    if (!track) {
      res.status(404).send({
        message: `Track not found with id : ${req.params.trackId}`,
      });
      return;
    }
    const trackAlbums = await db.query.trackAlbums.findFirst({
      where: and(
        eq(schema.trackAlbums.trackId, req.params.trackId),
        eq(schema.trackAlbums.albumId, req.params.albumId)
      ),
    });
    if (trackAlbums) {
      res.status(404).send({
        message: "TrackAlbum Already exist !",
      });
      return;
    }
    const trackAlbum = await db
      .insert(schema.trackAlbums)
      .values({
        albumId: req.params.albumId,
        trackId: req.params.trackId,
      })
      .$returningId();

    const createdTrackAlbum = trackAlbum[0];

    if (!createdTrackAlbum) {
      res.status(400).send({
        message: "Some Error occured when creating Track Album",
      });
    }
    res.status(200).send(createdTrackAlbum as TrackAlbum);
  };

  static FindTrackAlbumByTrackIdAndAlbumId: RequestHandler<{
    albumId: string;
    trackId: string;
  }> = async (req, res, next) => {
    const trackAlbum = await db.query.trackAlbums.findFirst({
      where: and(
        eq(schema.trackAlbums.albumId, req.params.albumId),
        eq(schema.trackAlbums.trackId, req.params.trackId)
      ),
    });
    if (!trackAlbum) {
      res.status(400).send({
        message:
          "Error occured when getting Track Album by trackId and albumId",
      });
    }
    res.status(200).send(trackAlbum as TrackAlbum);
  };

  static FindTrackAlbumByTrackId: RequestHandler<{ trackId: string }> = async (
    req,
    res,
    next
  ) => {
    const trackAlbum = await db.query.trackAlbums.findFirst({
      where: and(eq(schema.trackAlbums.trackId, req.params.trackId)),
    });
    if (!trackAlbum) {
      res.status(400).send({
        message: "Error occured when getting Track Album by trackId",
      });
    }
    res.status(200).send(trackAlbum as TrackAlbum);
  };
  static FindTrackAlbumByAlbumId: RequestHandler<{
    albumId: string;
  }> = async (req, res, next) => {
    const trackAlbum = await db.query.trackAlbums.findFirst({
      where: and(eq(schema.trackAlbums.albumId, req.params.albumId)),
    });
    if (!trackAlbum) {
      res.status(400).send({
        message: "Error occured when getting Track Album by albumId",
      });
    }
    res.status(200).send(trackAlbum as TrackAlbum);
  };

  static FindTrackAlbumById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    const trackAlbum = await db.query.trackAlbums.findFirst({
      where: and(eq(schema.trackAlbums.id, req.params.id)),
    });
    if (!trackAlbum) {
      res.status(400).send({
        message: "Error occured when getting Track Album by id",
      });
    }
    res.status(200).send(trackAlbum as TrackAlbum);
  };
}
