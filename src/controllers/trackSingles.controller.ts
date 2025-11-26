import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { TrackSingle } from "../models";

export class TrackSingleController {
  static createTrackSingle: RequestHandler<{
    trackId: string;
    singleId: string;
  }> = async (req, res, next) => {
    const single = await db.query.singles.findFirst({
      where: and(eq(schema.singles.id, req.params.singleId)),
    });
    if (!single) {
      res.status(400).send({
        message: `Single not found with id : ${req.params.singleId}`,
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
    const trackSingles = await db.query.trackSingles.findFirst({
      where: and(
        eq(schema.trackSingles.trackId, req.params.trackId),
        eq(schema.trackSingles.singleId, req.params.singleId)
      ),
    });
    if (trackSingles) {
      res.status(404).send({
        message: "TrackSingle Already exist !",
      });
      return;
    }
    const trackSingle = await db
      .insert(schema.trackSingles)
      .values({
        singleId: req.params.singleId,
        trackId: req.params.trackId,
      })
      .$returningId();

    const createdTrackSingle = trackSingle[0];

    if (!createdTrackSingle) {
      res.status(400).send({
        message: "Some Error occured when creating Track Single",
      });
    }
    res.status(200).send(createdTrackSingle as TrackSingle);
  };

  static FindTrackSingleByTrackIdAndSingleId: RequestHandler<{
    singleId: string;
    trackId: string;
  }> = async (req, res, next) => {
    const trackSingle = await db.query.trackSingles.findFirst({
      where: and(
        eq(schema.trackSingles.singleId, req.params.singleId),
        eq(schema.trackSingles.trackId, req.params.trackId)
      ),
    });
    if (!trackSingle) {
      res.status(400).send({
        message:
          "Error occured when getting Track Single by trackId and singleId",
      });
    }
    res.status(200).send(trackSingle as TrackSingle);
  };

  static FindTrackSingleByTrackId: RequestHandler<{ trackId: string }> = async (
    req,
    res,
    next
  ) => {
    const trackSingle = await db.query.trackSingles.findFirst({
      where: and(eq(schema.trackSingles.trackId, req.params.trackId)),
    });
    if (!trackSingle) {
      res.status(400).send({
        message: "Error occured when getting Track Single by trackId",
      });
    }
    res.status(200).send(trackSingle as TrackSingle);
  };
  static FindTrackSingleBySingleId: RequestHandler<{
    singleId: string;
  }> = async (req, res, next) => {
    const trackSingle = await db.query.trackSingles.findFirst({
      where: and(eq(schema.trackSingles.singleId, req.params.singleId)),
    });
    if (!trackSingle) {
      res.status(400).send({
        message: "Error occured when getting Track Single by singleId",
      });
    }
    res.status(200).send(trackSingle as TrackSingle);
  };

  static FindTrackSingleById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    const trackSingle = await db.query.trackSingles.findFirst({
      where: and(eq(schema.trackSingles.id, req.params.id)),
    });
    if (!trackSingle) {
      res.status(400).send({
        message: "Error occured when getting Track Single by id",
      });
    }
    res.status(200).send(trackSingle as TrackSingle);
  };
}
