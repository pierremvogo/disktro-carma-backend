import { eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { TrackStream } from "../models";
import { GeoIPService } from "../utils/geoIpService";

export class TrackStreamsController {
  /**
   * ➤ CREATE STREAM
   */
  static createTrackStream: RequestHandler<{
    trackId: string;
    userId: string;
  }> = async (req, res, next) => {
    try {
      const { trackId, userId } = req.params;

      const track = await db.query.tracks.findFirst({
        where: eq(schema.tracks.id, trackId),
      });

      if (!track) {
        res
          .status(404)
          .send({ message: `Track not found with id: ${trackId}` });
        return;
      }

      if (!userId) {
        res.status(404).send({ message: `User not found with id: ${userId}` });
        return;
      }

      // INFOS IP / DEVICE
      const ipAddress =
        (req.headers["x-forwarded-for"] as string) ||
        req.socket.remoteAddress ||
        null;

      const userAgent = (req.headers["user-agent"] as string) || "";
      const device = userAgent.includes("Mobile") ? "mobile" : "desktop";

      // GEOLOCATION
      const geo = await GeoIPService.lookup(ipAddress);

      const inserted = await db
        .insert(schema.trackStreams)
        .values({
          trackId,
          userId,
          ipAddress: ipAddress ?? undefined,
          country: geo.countryCode ?? undefined,
          city: geo.city ?? undefined,
          device: device ?? undefined,
        })
        .$returningId();

      const created = inserted[0];

      if (!created) {
        res.status(400).send({
          message: "Some error occurred when creating Track Stream",
        });
        return;
      }

      res.status(201).send(created as TrackStream);
    } catch (err) {
      console.error("Error in createTrackStream:", err);
      next(err);
    }
  };

  /**
   * ➤ GET STREAMS BY TRACK ID
   */
  static findTrackStreamsByTrackId: RequestHandler<{ trackId: string }> =
    async (req, res) => {
      try {
        const { trackId } = req.params;

        const streams = await db.query.trackStreams.findMany({
          where: eq(schema.trackStreams.trackId, trackId),
        });

        res.status(200).send(streams as TrackStream[]);
      } catch (err) {
        console.error("Error in findTrackStreamsByTrackId:", err);
        res.status(400).send({
          message: "Error occurred when getting Track Streams by trackId",
        });
      }
    };

  /**
   * ➤ GET STREAMS BY USER ID
   */
  static findTrackStreamsByUserId: RequestHandler<{ userId: string }> = async (
    req,
    res
  ) => {
    try {
      const { userId } = req.params;

      const streams = await db.query.trackStreams.findMany({
        where: eq(schema.trackStreams.userId, userId),
      });

      res.status(200).send(streams as TrackStream[]);
    } catch (err) {
      console.error("Error in findTrackStreamsByUserId:", err);
      res.status(400).send({
        message: "Error occurred when getting Track Streams by userId",
      });
    }
  };

  /**
   * ➤ GET STREAM BY ID
   */
  static findTrackStreamById: RequestHandler<{ id: string }> = async (
    req,
    res
  ) => {
    try {
      const { id } = req.params;

      const stream = await db.query.trackStreams.findFirst({
        where: eq(schema.trackStreams.id, id),
      });

      if (!stream) {
        res.status(404).send({ message: "Track Stream not found" });
        return;
      }

      res.status(200).send(stream as TrackStream);
    } catch (err) {
      console.error("Error in findTrackStreamById:", err);
      res.status(400).send({
        message: "Error occurred when getting Track Stream by id",
      });
    }
  };

  /**
   * ➤ GET ALL STREAMS
   * Route suggérée : GET /trackStream/get/all
   */
  static findAllTrackStreams: RequestHandler = async (req, res) => {
    try {
      const streams = await db.query.trackStreams.findMany();

      res.status(200).send(streams as TrackStream[]);
    } catch (err) {
      console.error("Error in findAllTrackStreams:", err);
      res.status(400).send({
        message: "Error occurred while retrieving all Track Streams",
      });
    }
  };
}
