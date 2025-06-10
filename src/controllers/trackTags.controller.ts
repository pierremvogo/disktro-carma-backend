import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { TrackTag } from "../models";

export class TrackTagController {
  static createTrackTag: RequestHandler<{ tagId: string; trackId: string }> =
    async (req, res, next) => {
      const tag = await db.query.tags.findFirst({
        where: and(eq(schema.tags.id, req.params.tagId)),
      });
      if (!tag) {
        res.status(400).send({
          message: `Tag not found with id : ${req.params.tagId}`,
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
      const trackTags = await db.query.trackTags.findFirst({
        where: and(
          eq(schema.trackTags.tagId, req.params.tagId),
          eq(schema.trackTags.trackId, req.params.trackId)
        ),
      });
      if (trackTags) {
        res.status(404).send({
          message: "TrackTag Already exist !",
        });
        return;
      }
      const trackTag = await db
        .insert(schema.trackTags)
        .values({
          tagId: req.params.tagId,
          trackId: req.params.trackId,
        })
        .$returningId();

      const createdTrackTag = trackTag[0];

      if (!createdTrackTag) {
        res.status(400).send({
          message: "Some Error occured when creating Track Tag",
        });
      }
      res.status(200).send(createdTrackTag as TrackTag);
    };

  static FindTrackTagByTrackIdAndTagId: RequestHandler<{
    trackId: string;
    tagId: string;
  }> = async (req, res, next) => {
    const trackTag = await db.query.trackTags.findFirst({
      where: and(
        eq(schema.trackTags.tagId, req.params.tagId),
        eq(schema.trackTags.trackId, req.params.trackId)
      ),
    });
    if (!trackTag) {
      res.status(400).send({
        message: "Error occured when getting Track Tag",
      });
    }
    res.status(200).send(trackTag as TrackTag);
  };

  static FindTrackTagByTrackId: RequestHandler<{ trackId: string }> = async (
    req,
    res,
    next
  ) => {
    const trackTag = await db.query.trackTags.findFirst({
      where: and(eq(schema.trackTags.trackId, req.params.trackId)),
    });
    if (!trackTag) {
      res.status(400).send({
        message: "Error occured when getting Track Tag by trackId",
      });
    }
    res.status(200).send(trackTag as TrackTag);
  };

  static FindTrackTagByTagId: RequestHandler<{ tagId: string }> = async (
    req,
    res,
    next
  ) => {
    const trackTag = await db.query.trackTags.findFirst({
      where: and(eq(schema.trackTags.tagId, req.params.tagId)),
    });
    if (!trackTag) {
      res.status(400).send({
        message: "Error occured when getting Track Tag by tagId",
      });
    }
    res.status(200).send(trackTag as TrackTag);
  };

  static FindTrackTagById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    const trackTag = await db.query.trackTags.findFirst({
      where: and(eq(schema.trackTags.id, req.params.id)),
    });
    if (!trackTag) {
      res.status(400).send({
        message: "Error occured when getting Track Tag by id",
      });
    }
    res.status(200).send(trackTag as TrackTag);
  };
  static DeleteTrackTag: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const existing = await db.query.trackTags.findFirst({
        where: eq(schema.trackTags.id, req.params.id),
      });
      if (!existing) {
        res.status(404).send({ message: "TrackTag not found." });
        return;
      }

      await db
        .delete(schema.trackTags)
        .where(eq(schema.trackTags.id, req.params.id));

      res.status(200).send({ message: "TrackTag successfully deleted." });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: `Internal server error: ${err}` });
    }
  };
  static UpdateTrackTag: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const id = req.params.id;
      const { tagId, trackId } = req.body;

      // Vérifier que le TrackTag existe
      const existingTrackTag = await db.query.trackTags.findFirst({
        where: eq(schema.trackTags.id, id),
      });
      if (!existingTrackTag) {
        res.status(404).send({ message: "TrackTag not found." });
        return;
      }

      // Si tagId est fourni, vérifier que le tag existe
      if (tagId) {
        const tag = await db.query.tags.findFirst({
          where: eq(schema.tags.id, tagId),
        });
        if (!tag) {
          res.status(404).send({ message: `Tag not found with id: ${tagId}` });
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

      // Vérifier qu'on ne crée pas un doublon TrackTag
      const duplicate = await db.query.trackTags.findFirst({
        where: and(
          eq(schema.trackTags.tagId, tagId ?? existingTrackTag.tagId),
          eq(schema.trackTags.trackId, trackId ?? existingTrackTag.trackId),
          // Exclure l'enregistrement actuel
          (schema.trackTags.id as any).notEq(id)
        ),
      });
      if (duplicate) {
        res.status(400).send({
          message: "TrackTag with this trackId and tagId already exists.",
        });
        return;
      }

      // Mise à jour
      await db
        .update(schema.trackTags)
        .set({
          tagId: tagId ?? existingTrackTag.tagId,
          trackId: trackId ?? existingTrackTag.trackId,
        })
        .where(eq(schema.trackTags.id, id));

      const updatedTrackTag = await db.query.trackTags.findFirst({
        where: eq(schema.trackTags.id, id),
        columns: {
          tagId: true,
          trackId: true,
        },
      });
      res.status(200).send({
        data: updatedTrackTag,
        message: "TrackTag updated successfully.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: `Internal server error: ${err}` });
    }
  };
}
