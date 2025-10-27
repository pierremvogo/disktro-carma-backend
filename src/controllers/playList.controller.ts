import { eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import type { Artist, Album, Playlists, Track, TrackPlaylist } from "../models";
import slugify from "slugify";

export class PlayListController {
  static Create: RequestHandler = async (req, res, next) => {
    const playlistSlug = slugify(req.body.nom, { lower: true, strict: true });

    const existingPlayList = await db.query.playlists.findFirst({
      where: eq(schema.playlists.slug, playlistSlug),
    });
    if (existingPlayList) {
      res
        .status(409)
        .json({ message: "An playlist with this name already exists" });
      return;
    }
    const result = await db
      .insert(schema.playlists)
      .values({
        nom: req.body.nom,
        slug: playlistSlug,
        userId: req.body.userId,
      })
      .$returningId();

    const createdPlayList = result[0];

    if (!createdPlayList) {
      res.status(400).send({
        message: "Error while creating PlayList!",
      });
      return;
    }
    res.status(200).send({
      message: "Successfuly created PlayList",
      data: createdPlayList as Playlists,
    });
  };

  static FindAllPlayLists: RequestHandler = async (req, res, next) => {
    const allPlayLists = await db.query.playlists.findMany({
      columns: {
        id: true,
        nom: true,
        slug: true,
        userId: true,
      },
    });
    if (!allPlayLists) {
      res.status(400).send({
        message: "Some error occurred: No PlayLists found",
      });
      return;
    }
    res.status(200).send({
      data: allPlayLists,
      message: "Successfully get all playlists",
    });
  };

  static FindPlayListById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      if (req.params.id == null) {
        res.status(400).send({
          message: "No playlist ID given.!",
        });
        return;
      }
      const result = await db.query.playlists.findFirst({
        where: eq(schema.playlists.id, req.params.id),
        with: {
          trackPlayLists: {
            with: {
              track: true,
            },
          },
        },
      });
      if (!result) {
        res.status(400).send({
          message: `no playlist with id ${req.params.id} found`,
        });
        return;
      }
      const playlist: Playlists = { ...result };
      if (playlist == null) {
        res.status(400).send({
          message: `no playlist with id ${req.params.id} found`,
        });
        return;
      } else {
        playlist.tracks = result?.trackPlayLists.map(
          (st: { track: Track }) => st.track as Track
        );

        delete playlist.trackPlayLists;
        res.status(200).send({
          message: `Successfuly get playlist`,
          data: playlist,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error`,
      });
    }
  };
  static FindPlaylistsByUserId: RequestHandler<{ userId: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const userId = req.params.userId;

      if (!userId) {
        res.status(400).send({
          message: "No user ID provided.",
        });
        return;
      }

      const results = await db.query.playlists.findMany({
        where: eq(schema.playlists.userId, userId),
        with: {
          trackPlayLists: {
            with: {
              track: true,
            },
          },
        },
      });

      if (!results || results.length === 0) {
        res.status(404).send({
          message: `No playlists found for user with ID: ${userId}`,
        });
        return;
      }

      const playlists: Playlists[] = results.map((playlist) => {
        const tracks = playlist.trackPlayLists.map((tp) => tp.track as Track);
        const { trackPlayLists, ...rest } = playlist;
        return {
          ...rest,
          tracks,
        };
      });

      res.status(200).send({
        message: `Successfully retrieved ${playlists.length} playlist(s) for user ${userId}`,
        data: playlists,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  };

  static FindPlayListBySlug: RequestHandler<{ slug: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      if (req.params.slug == "") {
        res.status(400).send({
          message: `No playlist slug given.`,
        });
        return;
      }
      console.log(req.params.slug);

      const playlistBySlug = await db.query.playlists.findFirst({
        where: eq(schema.playlists.slug, req.params.slug),
      });

      if (!playlistBySlug) {
        res.status(404).send({
          message: `PlayList by slug not found`,
        });
        return;
      }
      res.status(200).send({
        message: `Successfuly find playlist by slug.`,
        data: playlistBySlug as Playlists,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server Error.`,
      });
    }
  };

  static UpdatePlayList: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const id = req.params.id;
      const { nom } = req.body;

      if (!nom || nom.trim() === "") {
        res
          .status(400)
          .send({ message: "PlayList name is required for update." });
        return;
      }
      // Génère un nouveau slug à partir du nouveau nom
      const slug = slugify(nom, { lower: true, strict: true });
      // Vérifier que la playlist existe
      const existingPlayList = await db.query.playlists.findFirst({
        where: eq(schema.playlists.id, id),
      });
      if (!existingPlayList) {
        res.status(404).send({ message: "PlayList not found." });
        return;
      }

      // Mettre à jour le playlist
      await db
        .update(schema.playlists)
        .set({ nom, slug })
        .where(eq(schema.playlists.id, id));

      // Récupérer le playlist mis à jour
      const updatedPlayList = await db.query.playlists.findFirst({
        where: eq(schema.playlists.id, id),
      });

      res.status(200).send({
        message: "PlayList updated successfully.",
        data: updatedPlayList as Playlists,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal server error." });
    }
  };

  static DeletePlayList: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const id = req.params.id;

      // Vérifier que le playlist existe
      const existingPlayList = await db.query.playlists.findFirst({
        where: eq(schema.playlists.id, id),
      });
      if (!existingPlayList) {
        res.status(404).send({ message: "PlayList not found." });
        return;
      }

      // Supprimer le playlist
      await db.delete(schema.playlists).where(eq(schema.playlists.id, id));

      res.status(200).send({
        message: "PlayList deleted successfully.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal server error." });
    }
  };
}
