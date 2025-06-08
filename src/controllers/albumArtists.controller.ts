import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { AlbumArtist } from "../models";

export class AlbumArtistController {
  static createAlbumArtist: RequestHandler<{
    artistId: string;
    albumId: string;
  }> = async (req, res, next) => {
    const artist = await db.query.artists.findFirst({
      where: and(eq(schema.artists.id, req.params.artistId)),
    });
    if (!artist) {
      res.status(400).send({
        message: `Artist not found with id : ${req.params.artistId}`,
      });
      return;
    }

    const album = await db.query.albums.findFirst({
      where: and(eq(schema.albums.id, req.params.albumId)),
    });
    if (!album) {
      res.status(404).send({
        message: `Album not found with id : ${req.params.albumId}`,
      });
      return;
    }
    const albumArtists = await db.query.albumArtists.findFirst({
      where: and(
        eq(schema.albumArtists.artistId, req.params.artistId),
        eq(schema.albumArtists.albumId, req.params.albumId)
      ),
    });
    if (albumArtists) {
      res.status(404).send({
        message: "AlbumArtist Already exist !",
      });
      return;
    }
    const albumArtist = await db
      .insert(schema.albumArtists)
      .values({
        artistId: req.params.artistId,
        albumId: req.params.albumId,
      })
      .$returningId();

    const createdAlbumArtist = albumArtist[0];

    if (!createdAlbumArtist) {
      res.status(404).send({
        message: "Error occured when creating albumArtist",
      });
    }
    res.status(200).send({
      message: "Album successfuly associated to artist",
      data: createdAlbumArtist as AlbumArtist,
    });
  };

  static FindAlbumArtistByArtistIdAndAlbumId: RequestHandler<{
    artistId: string;
    albumId: string;
  }> = async (req, res, next) => {
    const albumArtist = await db.query.albumArtists.findFirst({
      where: and(
        eq(schema.albumArtists.artistId, req.params.artistId),
        eq(schema.albumArtists.albumId, req.params.albumId)
      ),
    });
    if (!albumArtist) {
      res.status(404).send({
        message: "This artist is not associated with this album.",
      });
    }
    res.status(200).send(albumArtist as AlbumArtist);
  };

  static FindAlbumArtistByArtistId: RequestHandler<{ artistId: string }> =
    async (req, res, next) => {
      const albumArtist = await db.query.albumArtists.findFirst({
        where: and(eq(schema.albumArtists.artistId, req.params.artistId)),
      });
      if (!albumArtist) {
        res.status(404).send({
          message: "Error occured when getting album Artist by artistId",
        });
      }
      res.status(200).send(albumArtist as AlbumArtist);
    };

  static FindAlbumArtistByAlbumId: RequestHandler<{
    albumId: string;
  }> = async (req, res, next) => {
    const albumArtist = await db.query.albumArtists.findFirst({
      where: and(eq(schema.albumArtists.albumId, req.params.albumId)),
    });
    if (!albumArtist) {
      res.status(404).send({
        message: "Error occured when getting album Artist by albumId",
      });
      return;
    }
    res.status(200).send(albumArtist as AlbumArtist);
  };

  static FindAlbumArtistById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    const albumArtist = await db.query.albumArtists.findFirst({
      where: and(eq(schema.albumArtists.id, req.params.id)),
    });
    if (!albumArtist) {
      res.status(404).send({
        message: "Error occured when getting album Artist by albumId",
      });
    }
    res.status(200).send(albumArtist as AlbumArtist);
  };
}
