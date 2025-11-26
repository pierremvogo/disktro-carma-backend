import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { TrackEp } from "../models";

export class TrackEpController {
  static createTrackEp: RequestHandler<{
    trackId: string;
    epId: string;
  }> = async (req, res, next) => {
    const ep = await db.query.eps.findFirst({
      where: and(eq(schema.eps.id, req.params.epId)),
    });
    if (!ep) {
      res.status(400).send({
        message: `Ep not found with id : ${req.params.epId}`,
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
    const trackEps = await db.query.trackEps.findFirst({
      where: and(
        eq(schema.trackEps.trackId, req.params.trackId),
        eq(schema.trackEps.epId, req.params.epId)
      ),
    });
    if (trackEps) {
      res.status(404).send({
        message: "TrackEp Already exist !",
      });
      return;
    }
    const trackEp = await db
      .insert(schema.trackEps)
      .values({
        epId: req.params.epId,
        trackId: req.params.trackId,
      })
      .$returningId();

    const createdTrackEp = trackEp[0];

    if (!createdTrackEp) {
      res.status(400).send({
        message: "Some Error occured when creating Track Ep",
      });
    }
    res.status(200).send(createdTrackEp as TrackEp);
  };

  static FindTrackEpByTrackIdAndEpId: RequestHandler<{
    epId: string;
    trackId: string;
  }> = async (req, res, next) => {
    const trackEp = await db.query.trackEps.findFirst({
      where: and(
        eq(schema.trackEps.epId, req.params.epId),
        eq(schema.trackEps.trackId, req.params.trackId)
      ),
    });
    if (!trackEp) {
      res.status(400).send({
        message: "Error occured when getting Track Ep by trackId and epId",
      });
    }
    res.status(200).send(trackEp as TrackEp);
  };

  static FindTrackEpByTrackId: RequestHandler<{ trackId: string }> = async (
    req,
    res,
    next
  ) => {
    const trackEp = await db.query.trackEps.findFirst({
      where: and(eq(schema.trackEps.trackId, req.params.trackId)),
    });
    if (!trackEp) {
      res.status(400).send({
        message: "Error occured when getting Track Ep by trackId",
      });
    }
    res.status(200).send(trackEp as TrackEp);
  };
  static FindTrackEpByEpId: RequestHandler<{
    epId: string;
  }> = async (req, res, next) => {
    const trackEp = await db.query.trackEps.findFirst({
      where: and(eq(schema.trackEps.epId, req.params.epId)),
    });
    if (!trackEp) {
      res.status(400).send({
        message: "Error occured when getting Track Ep by epId",
      });
    }
    res.status(200).send(trackEp as TrackEp);
  };

  static FindTrackEpById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    const trackEp = await db.query.trackEps.findFirst({
      where: and(eq(schema.trackEps.id, req.params.id)),
    });
    if (!trackEp) {
      res.status(400).send({
        message: "Error occured when getting Track Ep by id",
      });
    }
    res.status(200).send(trackEp as TrackEp);
  };
}
