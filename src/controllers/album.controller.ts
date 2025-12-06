import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import type { Artist, Album, Tag, Track } from "../models";
import slugify from "slugify";

export class AlbumController {
  static create: RequestHandler = async (req, res, next) => {
    try {
      const {
        title,
        duration,
        userId,
        coverUrl,

        // 👉 nouveaux champs
        authors,
        producers,
        lyricists,
        musiciansVocals,
        musiciansPianoKeyboards,
        musiciansWinds,
        musiciansPercussion,
        musiciansStrings,
        mixingEngineer,
        masteringEngineer,
      } = req.body;

      if (!title || !userId || !coverUrl) {
        res.status(400).json({
          message: "title, userId et coverUrl sont requis",
        });
        return;
      }

      const albumSlug = slugify(title, { lower: true, strict: true });

      const existingName = await db.query.albums.findFirst({
        where: eq(schema.albums.slug, albumSlug),
      });

      if (existingName) {
        res
          .status(409)
          .json({ message: "An album with this name already exists" });
        return;
      }

      const album = await db
        .insert(schema.albums)
        .values({
          title,
          slug: albumSlug,
          userId,
          duration,
          coverUrl,

          // 🆕 nouveaux champs
          authors,
          producers,
          lyricists,
          musiciansVocals,
          musiciansPianoKeyboards,
          musiciansWinds,
          musiciansPercussion,
          musiciansStrings,
          mixingEngineer,
          masteringEngineer,
        })
        .$returningId();

      const createdAlbum = album[0];

      if (!createdAlbum) {
        res.status(400).send({
          message: "Error occurred when creating album",
        });
        return;
      }

      res.status(200).send({
        message: "Album created successfully",
        data: createdAlbum as Album,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  };

  static FindAllAlbums: RequestHandler = async (req, res, next) => {
    try {
      const allAlbums = await db.query.albums.findMany({
        columns: {
          id: true,
          title: true,
          slug: true,
          duration: true,
          coverUrl: true,

          // 👉 tu peux exposer quelques crédits si tu veux
          authors: true,
          producers: true,
          mixingEngineer: true,
          masteringEngineer: true,
        },
      });

      if (allAlbums.length === 0) {
        res.status(400).send({
          message: "No Albums found",
        });
        return;
      }

      res.status(200).send({
        data: allAlbums as Album[],
        message: "Successfully get all albums",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  };

  static FindAlbumByArtistAndSlug: RequestHandler = async (req, res, next) => {
    try {
      const coll = await db
        .select({
          id: schema.albums.id,
          title: schema.albums.title,
          slug: schema.albums.slug,
          duration: schema.albums.duration,
          coverUrl: schema.albums.coverUrl,

          // 🆕 crédits
          authors: schema.albums.authors,
          producers: schema.albums.producers,
          lyricists: schema.albums.lyricists,
          musiciansVocals: schema.albums.musiciansVocals,
          musiciansPianoKeyboards: schema.albums.musiciansPianoKeyboards,
          musiciansWinds: schema.albums.musiciansWinds,
          musiciansPercussion: schema.albums.musiciansPercussion,
          musiciansStrings: schema.albums.musiciansStrings,
          mixingEngineer: schema.albums.mixingEngineer,
          masteringEngineer: schema.albums.masteringEngineer,

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
        .limit(1)
        .execute();

      if (!coll[0]) {
        res.status(404).send({
          message: "Album not found for this artist and slug",
        });
        return;
      }

      res.status(200).send({
        message: "Get album by artist and slug successfully",
        data: coll[0] as Album,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Internal server error",
      });
    }
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
          albumTags: {
            with: {
              tag: true,
            },
          },
        },
      });
      if (!album) {
        res.status(400).send({
          message: `No album found with id ${req.params.id}.`,
        });
        return;
      }
      const a: Album = { ...album };
      if (a) {
        a.tags = album?.albumTags.map((a: any) => a.tag as Tag);
        a.tracks = album?.trackAlbums.map((t: any) => t.track as Track);
        delete (a as any).albumTags;
        delete (a as any).trackAlbums;

        res.status(200).send({
          message: `Successfully get Album`,
          album: a as Album,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error.`,
      });
    }
  };

  static FindAlbumsByUserId: RequestHandler<{ userId: string }> = async (
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
        res
          .status(404)
          .send({ message: "Artist not found with the given ID." });
        return;
      }

      const albums = await db.query.albums.findMany({
        where: eq(schema.albums.userId, userId),
        with: {
          user: true,
          trackAlbums: {
            with: {
              track: true,
            },
          },
        },
      });

      res.status(200).send({
        message: "Successfully retrieved all albums for this artist.",
        albums,
      });
    } catch (err) {
      console.error("Error retrieving albums:", err);
      res.status(500).send({ message: "Internal server error." });
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

      // Title + slug uniquement si title est fourni
      if (req.body.title !== undefined) {
        updatedFields.title = req.body.title;
        updatedFields.slug = slugify(req.body.title, {
          lower: true,
          strict: true,
        });
      }

      if (req.body.duration !== undefined)
        updatedFields.duration = req.body.duration;
      if (req.body.coverUrl !== undefined)
        updatedFields.coverUrl = req.body.coverUrl;

      // 🆕 champs crédits
      if (req.body.authors !== undefined)
        updatedFields.authors = req.body.authors;
      if (req.body.producers !== undefined)
        updatedFields.producers = req.body.producers;
      if (req.body.lyricists !== undefined)
        updatedFields.lyricists = req.body.lyricists;

      if (req.body.musiciansVocals !== undefined)
        updatedFields.musiciansVocals = req.body.musiciansVocals;
      if (req.body.musiciansPianoKeyboards !== undefined)
        updatedFields.musiciansPianoKeyboards =
          req.body.musiciansPianoKeyboards;
      if (req.body.musiciansWinds !== undefined)
        updatedFields.musiciansWinds = req.body.musiciansWinds;
      if (req.body.musiciansPercussion !== undefined)
        updatedFields.musiciansPercussion = req.body.musiciansPercussion;
      if (req.body.musiciansStrings !== undefined)
        updatedFields.musiciansStrings = req.body.musiciansStrings;

      if (req.body.mixingEngineer !== undefined)
        updatedFields.mixingEngineer = req.body.mixingEngineer;
      if (req.body.masteringEngineer !== undefined)
        updatedFields.masteringEngineer = req.body.masteringEngineer;

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

      const album = await db.query.albums.findFirst({
        where: eq(schema.albums.id, id),
      });
      if (!album) {
        res.status(404).send({ message: "Album not found" });
        return;
      }

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
