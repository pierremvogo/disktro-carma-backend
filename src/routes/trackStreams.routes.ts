import { Router } from "express";
import { TrackStreamsController } from "../controllers";

const trackStreamRoute = Router();

/**
 * @swagger
 * /trackStream/create/{userId}/{trackId}:
 *   post:
 *     tags:
 *       - TrackStream
 *     summary: Associer un track à un stream
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Association créée
 *       400:
 *         description: Erreur de création
 */
trackStreamRoute.post(
  "/create/:userId/:trackId",
  TrackStreamsController.createTrackStream
);

/**
 * @swagger
 * /trackStream/get/byTrack/{trackId}:
 *   get:
 *     tags:
 *       - TrackStream
 *     summary: Récupérer les associations pour un track donné
 *     parameters:
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Associations trouvées
 *       404:
 *         description: Aucune association trouvée
 */
trackStreamRoute.get(
  "/get/byTrack/:trackId",
  TrackStreamsController.findTrackStreamsByTrackId
);

/**
 * @swagger
 * /trackStream/get/byUser/{userId}:
 *   get:
 *     tags:
 *       - TrackStream
 *     summary: Récupérer les associations pour un utilisateur donné
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Associations trouvées
 *       404:
 *         description: Aucune association trouvée
 */
trackStreamRoute.get(
  "/get/byUser/:userId",
  TrackStreamsController.findTrackStreamsByUserId
);

/**
 * @swagger
 * /trackStream/get/{id}:
 *   get:
 *     tags:
 *       - TrackStream
 *     summary: Récupérer une association par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Association trouvée
 *       404:
 *         description: Non trouvée
 */
trackStreamRoute.get("/get/:id", TrackStreamsController.findTrackStreamById);

export default trackStreamRoute;
