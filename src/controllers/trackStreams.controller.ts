import { eq, and, gte } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { TrackStream } from "../models";

export class TrackStreamsController {
  /**
   * ➤ CREATE STREAM
   */
  // ...

  static createTrackStream: RequestHandler<{
    trackId: string;
    userId: string;
  }> = async (req, res, next) => {
    try {
      const { trackId, userId } = req.params;
      const { city: cityFromFront, device: deviceFromFront } = req.body;

      // 1️⃣ Vérifier que le track existe
      const track = await db.query.tracks.findFirst({
        where: eq(schema.tracks.id, trackId),
      });

      if (!track) {
        res
          .status(404)
          .send({ message: `Track not found with id: ${trackId}` });
        return;
      }

      // 2️⃣ Vérifier que userId est présent
      if (!userId) {
        res.status(400).send({ message: "Missing userId" });
        return;
      }

      // 3️⃣ Récupérer l'utilisateur pour lire son country (Option B)
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
        columns: { country: true },
      });

      if (!user) {
        res.status(404).send({ message: `User not found with id: ${userId}` });
        return;
      }

      const countryFromUser = user.country ?? null;

      // 4️⃣ Anti-spam : vérifier si un stream récent (30 secondes) existe déjà
      const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);

      const recentStream = await db.query.trackStreams.findFirst({
        where: and(
          eq(schema.trackStreams.trackId, trackId),
          eq(schema.trackStreams.userId, userId),
          gte(schema.trackStreams.createdAt, thirtySecondsAgo)
        ),
      });

      if (recentStream) {
        // On ne crée pas un nouveau stream, on renvoie le récent
        res.status(200).send(recentStream as TrackStream);
        return;
      }

      // 5️⃣ INFORMATION IP
      const ipAddress =
        (req.headers["x-forwarded-for"] as string) ||
        req.socket.remoteAddress ||
        null;

      // 6️⃣ DEVICE (si non envoyé par le front)
      const userAgent = (req.headers["user-agent"] as string) || "";
      const device =
        deviceFromFront ||
        (userAgent.includes("Mobile") ? "mobile" : "desktop");

      // 7️⃣ INSERT du nouveau stream
      const inserted = await db
        .insert(schema.trackStreams)
        .values({
          trackId,
          userId,
          ipAddress: ipAddress ?? undefined,
          country: countryFromUser, // ISO2 attendu (CM, FR, etc.)
          city: cityFromFront ?? null,
          device,
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
