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
  static UpdateAlbum: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const { id } = req.params;
      const updatedFields: Partial<typeof schema.albums.$inferInsert> = {};

      if (req.body.title !== undefined) updatedFields.title = req.body.title;
      if (req.body.slug !== undefined) updatedFields.slug = req.body.slug;
      if (req.body.duration !== undefined)
        updatedFields.duration = req.body.duration;
      if (req.body.coverUrl !== undefined)
        updatedFields.coverUrl = req.body.coverUrl;

      // Mise à jour dans la base
      await db
        .update(schema.albums)
        .set(updatedFields)
        .where(eq(schema.albums.id, id));

      // Récupérer l'album mis à jour
      const updatedAlbum = await db.query.albums.findFirst({
        where: eq(schema.albums.id, id),
      });

      if (!updatedAlbum) {
        res.status(404).send({ message: "Album not found" });
        return;
      }

      res.status(200).send({
        message: "Album updated successfully",
        data: updatedAlbum as Album,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error: ${err}`,
      });
    }
  };

  static DeleteAlbum: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const { id } = req.params;

      // Vérifier si l'album existe
      const album = await db.query.albums.findFirst({
        where: eq(schema.albums.id, id),
      });
      if (!album) {
        res.status(404).send({ message: "Album not found" });
        return;
      }

      // Supprimer l'album
      await db.delete(schema.albums).where(eq(schema.albums.id, id));

      res.status(200).send({ message: "Album deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error: ${err}`,
      });
    }
  };
}
