import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import type { Artist, Album, Tag, Track } from "../models";
export class AlbumController {
  static create: RequestHandler = async (req, res, next) => {
    const album = await db
      .insert(schema.albums)
      .values({
        title: req.body.title,
        slug: req.body.slug,
        duration: req.body.slug,
        coverUrl: req.body.coverUrl,
      })
      .$returningId();

    const createdAlbum = album[0];

    if (!createdAlbum) {
      res.status(400).send({
        message: "Error ocuured when creating album",
      });
    }
    res.status(200).send(createdAlbum as Album);
  };

  static FindAlbumByArtistAndSlug: RequestHandler = async (req, res, next) => {
    const query = db
      .select({
        id: schema.albums.id,
        title: schema.albums.title,
        slug: schema.albums.slug,
        duration: schema.albums.duration,
        coverUrl: schema.albums.coverUrl,
        tracks: schema.tracks,
      })
      .from(schema.albums)
      .innerJoin(
        schema.albumArtists,
        eq(schema.albums.id, schema.albumArtists.albumId)
      )
      .innerJoin(
        schema.artists,
        eq(schema.artists.id, schema.albumArtists.artistId)
      )
      .where(
        and(
          eq(schema.albums.slug, req.body.albumSlug),
          eq(schema.artists.slug, req.body.artistSlug)
        )
      )
      .limit(1);
    const coll = await query.execute();
    res.status(200).send({
      message: `Get album by artist and slug :  ${coll[0] as Album}.`,
    });
  };

  static FindAlbumById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const album = await db.query.albums.findFirst({
        where: eq(schema.albums.id, req.params.id),
        with: {
          trackAlbums: {
            with: {
              track: true,
            },
          },
          albumArtists: {
            with: {
              artist: true,
            },
          },
          albumTags: {
            with: {
              tag: true,
            },
          },
        },
      });
      if (!album) {
        res.status(400).send({
          message: `No album found with id ${req.body.id}.`,
        });
        return;
      }
      const a: Album = { ...album };
      if (a) {
        a.artists = album?.albumArtists.map((a: any) => a.artist as Artist);
        a.tags = album?.albumTags.map((a: any) => a.tag as Tag);

        a.tracks = album?.trackAlbums.map((t: any) => t.track as Track);
        delete a.albumArtists;
        delete a.albumTags;
        delete a.trackAlbums;
        res.status(200).send({
          message: `Album :  ${a}.`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Internal server error.`,
      });
    }
  };

  static FindAlbumsByArtistId: RequestHandler = async (req, res, next) => {
    let results = [];
    try {
      const result = await db.query.albumArtists.findMany({
        where: eq(schema.albumArtists.artistId, req.body.artistId),
        with: {
          album: true,
        },
      });
      if (!result) {
        res.status(500).send({
          message: `'no artist found with given id'`,
        });
      }
      results = result.map((ca: any) => ca.album);
      res.status(200).send(results);
    } catch (err) {
      res.status(500).send({
        message: `Internal server error.`,
      });
    }
  };
}
