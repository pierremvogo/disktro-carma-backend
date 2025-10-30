import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { TrackPlaylist } from "../models";

export class TrackPlaylistController {
  static createTrackPlaylist: RequestHandler<{
    playlistId: string;
    trackId: string;
  }> = async (req, res, next) => {
    const playlist = await db.query.playlists.findFirst({
      where: and(eq(schema.playlists.id, req.params.playlistId)),
    });
    if (!playlist) {
      res.status(400).send({
        message: `Playlist not found with id : ${req.params.playlistId}`,
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
    const trackPlayLists = await db.query.trackPlayLists.findFirst({
      where: and(
        eq(schema.trackPlayLists.playlistId, req.params.playlistId),
        eq(schema.trackPlayLists.trackId, req.params.trackId)
      ),
    });
    if (trackPlayLists) {
      res.status(404).send({
        message: "Track already added to playlist !",
      });
      return;
    }
    const trackPlaylist = await db
      .insert(schema.trackPlayLists)
      .values({
        playlistId: req.params.playlistId,
        trackId: req.params.trackId,
      })
      .$returningId();

    const createdTrackPlaylist = trackPlaylist[0];

    if (!createdTrackPlaylist) {
      res.status(400).send({
        message: "Some Error occured when creating Track Playlist",
      });
    }
    res.status(200).send(createdTrackPlaylist as TrackPlaylist);
  };

  static FindTrackPlaylistByTrackIdAndPlaylistId: RequestHandler<{
    trackId: string;
    playlistId: string;
  }> = async (req, res, next) => {
    const trackPlaylist = await db.query.trackPlayLists.findFirst({
      where: and(
        eq(schema.trackPlayLists.playlistId, req.params.playlistId),
        eq(schema.trackPlayLists.trackId, req.params.trackId)
      ),
    });
    if (!trackPlaylist) {
      res.status(400).send({
        message: "Error occured when getting Track Playlist",
      });
    }
    res.status(200).send(trackPlaylist as TrackPlaylist);
  };

  static FindTrackPlaylistByTrackId: RequestHandler<{ trackId: string }> =
    async (req, res, next) => {
      const trackPlaylist = await db.query.trackPlayLists.findFirst({
        where: and(eq(schema.trackPlayLists.trackId, req.params.trackId)),
      });
      if (!trackPlaylist) {
        res.status(400).send({
          message: "Error occured when getting Track Playlist by trackId",
        });
      }
      res.status(200).send(trackPlaylist as TrackPlaylist);
    };

  static FindTrackPlaylistByPlaylistId: RequestHandler<{ playlistId: string }> =
    async (req, res, next) => {
      const trackPlaylist = await db.query.trackPlayLists.findFirst({
        where: and(eq(schema.trackPlayLists.playlistId, req.params.playlistId)),
      });
      if (!trackPlaylist) {
        res.status(400).send({
          message: "Error occured when getting Track Playlist by playlistId",
        });
      }
      res.status(200).send(trackPlaylist as TrackPlaylist);
    };

  static FindTrackPlaylistById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    const trackPlaylist = await db.query.trackPlayLists.findFirst({
      where: and(eq(schema.trackPlayLists.id, req.params.id)),
    });
    if (!trackPlaylist) {
      res.status(400).send({
        message: "Error occured when getting Track Playlist by id",
      });
    }
    res.status(200).send(trackPlaylist as TrackPlaylist);
  };
  static DeleteTrackPlaylist: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const existing = await db.query.trackPlayLists.findFirst({
        where: eq(schema.trackPlayLists.id, req.params.id),
      });
      if (!existing) {
        res.status(404).send({ message: "TrackPlaylist not found." });
        return;
      }

      await db
        .delete(schema.trackPlayLists)
        .where(eq(schema.trackPlayLists.trackId, req.params.id));

      res.status(200).send({ message: "TrackPlaylist successfully deleted." });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: `Internal server error: ${err}` });
    }
  };
  static UpdateTrackPlaylist: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const id = req.params.id;
      const { playlistId, trackId } = req.body;

      // Vérifier que le TrackPlaylist existe
      const existingTrackPlaylist = await db.query.trackPlayLists.findFirst({
        where: eq(schema.trackPlayLists.id, id),
      });
      if (!existingTrackPlaylist) {
        res.status(404).send({ message: "TrackPlaylist not found." });
        return;
      }

      // Si playlistId est fourni, vérifier que le playlist existe
      if (playlistId) {
        const playlist = await db.query.playlists.findFirst({
          where: eq(schema.playlists.id, playlistId),
        });
        if (!playlist) {
          res
            .status(404)
            .send({ message: `Playlist not found with id: ${playlistId}` });
          return;
        }
      }

      // Si trackId est fourni, vérifier que le track existe
      if (trackId) {
        const track = await db.query.tracks.findFirst({
          where: eq(schema.tracks.id, trackId),
        });
        if (!track) {
          res
            .status(404)
            .send({ message: `Track not found with id: ${trackId}` });
          return;
        }
      }

      // Vérifier qu'on ne crée pas un doublon TrackPlaylist
      const duplicate = await db.query.trackPlayLists.findFirst({
        where: and(
          eq(
            schema.trackPlayLists.playlistId,
            playlistId ?? existingTrackPlaylist.playlistId
          ),
          eq(
            schema.trackPlayLists.trackId,
            trackId ?? existingTrackPlaylist.trackId
          ),
          // Exclure l'enregistrement actuel
          (schema.trackPlayLists.id as any).notEq(id)
        ),
      });
      if (duplicate) {
        res.status(400).send({
          message:
            "TrackPlaylist with this trackId and playlistId already exists.",
        });
        return;
      }

      // Mise à jour
      await db
        .update(schema.trackPlayLists)
        .set({
          playlistId: playlistId ?? existingTrackPlaylist.playlistId,
          trackId: trackId ?? existingTrackPlaylist.trackId,
        })
        .where(eq(schema.trackPlayLists.id, id));

      const updatedTrackPlaylist = await db.query.trackPlayLists.findFirst({
        where: eq(schema.trackPlayLists.id, id),
        columns: {
          playlistId: true,
          trackId: true,
        },
      });
      res.status(200).send({
        data: updatedTrackPlaylist,
        message: "TrackPlaylist updated successfully.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: `Internal server error: ${err}` });
    }
  };
}
