import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { TrackRelease } from "../models";

export class TrackReleaseController {
  static createTrackRelease: RequestHandler<{
    trackId: string;
    releaseId: string;
  }> = async (req, res, next) => {
    const track = await db.query.tracks.findFirst({
      where: and(eq(schema.tracks.id, req.params.trackId)),
    });
    if (!track) {
      res.status(404).send({
        message: `Track not found with id : ${req.params.trackId}`,
      });
      return;
    }
    const release = await db.query.release.findFirst({
      where: and(eq(schema.release.id, req.params.releaseId)),
    });
    if (!release) {
      res.status(404).send({
        message: `Release not found with id : ${req.params.releaseId}`,
      });
      return;
    }

    const trackReleases = await db.query.trackReleases.findFirst({
      where: and(
        eq(schema.trackReleases.releaseId, req.params.releaseId),
        eq(schema.trackReleases.trackId, req.params.trackId)
      ),
    });
    if (trackReleases) {
      res.status(404).send({
        message: "TrackRelease Already exist !",
      });
      return;
    }
    const trackRelease = await db
      .insert(schema.trackReleases)
      .values({
        releaseId: req.params.releaseId,
        trackId: req.params.trackId,
      })
      .$returningId();

    const createdTrackRelease = trackRelease[0];

    if (!createdTrackRelease) {
      res.status(400).send({
        message: "Some Error occured when creating Track Release",
      });
    }
    res.status(200).send(createdTrackRelease as TrackRelease);
  };

  static FindTrackReleaseByTrackIdAndReleaseId: RequestHandler<{
    releaseId: string;
    trackId: string;
  }> = async (req, res, next) => {
    const trackRelease = await db.query.trackReleases.findFirst({
      where: and(
        eq(schema.trackReleases.releaseId, req.params.releaseId),
        eq(schema.trackReleases.trackId, req.params.trackId)
      ),
    });
    if (!trackRelease) {
      res.status(400).send({
        message:
          "Error occured when getting Track Release by trackId and releaseId",
      });
    }
    res.status(200).send(trackRelease as TrackRelease);
  };

  static FindTrackReleaseByTrackId: RequestHandler<{ trackId: string }> =
    async (req, res, next) => {
      const trackRelease = await db.query.trackReleases.findFirst({
        where: and(eq(schema.trackReleases.trackId, req.params.trackId)),
      });
      if (!trackRelease) {
        res.status(400).send({
          message: "Error occured when getting Track Release by trackId",
        });
      }
      res.status(200).send(trackRelease as TrackRelease);
    };

  static FindTrackReleaseByReleaseId: RequestHandler<{ releaseId: string }> =
    async (req, res, next) => {
      const trackRelease = await db.query.trackReleases.findFirst({
        where: and(eq(schema.trackReleases.releaseId, req.params.releaseId)),
      });
      if (!trackRelease) {
        res.status(400).send({
          message: "Error occured when getting Track Release by releaseId",
        });
      }
      res.status(200).send(trackRelease as TrackRelease);
    };

  static FindTrackReleaseById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    const trackRelease = await db.query.trackReleases.findFirst({
      where: and(eq(schema.trackReleases.id, req.params.id)),
    });
    if (!trackRelease) {
      res.status(400).send({
        message: "Error occured when getting Track Release by id",
      });
    }
    res.status(200).send(trackRelease as TrackRelease);
  };
}
