import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { TrackStream } from "../models"; // à créer si pas encore fait

export class TrackStreamsController {
  /**
   * Crée un stream pour un track donné
   * Route suggérée: POST /tracks/:trackId/streams
   */
  static createTrackStream: RequestHandler<{
    trackId: string;
    userId: string;
  }> = async (req, res, next) => {
    try {
      const { trackId, userId } = req.params;

      // Vérifier que le track existe
      const track = await db.query.tracks.findFirst({
        where: eq(schema.tracks.id, trackId),
      });

      if (!track) {
        res.status(404).send({
          message: `Track not found with id : ${trackId}`,
        });
        return;
      }
      if (!userId) {
        res.status(404).send({
          message: `User not found with id : ${userId}`,
        });
        return;
      }

      // Récupérer éventuellement l'utilisateur depuis req (si tu as un middleware d'auth)

      // Infos IP / device (à adapter selon ton infra)
      const ipAddress =
        (req.headers["x-forwarded-for"] as string) ||
        req.socket.remoteAddress ||
        null;
      const userAgent = (req.headers["user-agent"] as string) || "";
      const device = userAgent.includes("Mobile") ? "mobile" : "desktop";

      // TODO: tu peux ajouter une vraie géolocalisation ici (country / city) via un service externe
      const country: string | null = null;
      const city: string | null = null;

      const inserted = await db
        .insert(schema.trackStreams)
        .values({
          trackId,
          userId,
          ipAddress: ipAddress ?? undefined,
          country: country ?? undefined,
          city: city ?? undefined,
          device: device ?? undefined,
        })
        .$returningId(); // retourne [{ id: "..." }]

      const createdStream = inserted[0];

      if (!createdStream) {
        res.status(400).send({
          message: "Some error occurred when creating Track Stream",
        });
        return;
      }

      res.status(201).send(createdStream as TrackStream);
    } catch (err) {
      console.error("Error in createTrackStream:", err);
      next(err);
    }
  };

  /**
   * Récupère tous les streams d’un track
   * Route suggérée: GET /tracks/:trackId/streams
   */
  static findTrackStreamsByTrackId: RequestHandler<{ trackId: string }> =
    async (req, res, next) => {
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
   * Récupère tous les streams d’un user (si tu logges userId)
   * Route suggérée: GET /users/:userId/streams
   */
  static findTrackStreamsByUserId: RequestHandler<{ userId: string }> = async (
    req,
    res,
    next
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
   * Récupère un stream par son id
   * Route suggérée: GET /streams/:id
   */
  static findTrackStreamById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const { id } = req.params;

      const stream = await db.query.trackStreams.findFirst({
        where: eq(schema.trackStreams.id, id),
      });

      if (!stream) {
        res.status(404).send({
          message: "Track Stream not found",
        });
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
}
