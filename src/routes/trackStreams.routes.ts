import { Router } from "express";
import { TrackStreamsController } from "../controllers";

const trackStreamRoute = Router();

/**
 * @swagger
 * /streams/create/{userId}/{trackId}:
 *   post:
 *     tags:
 *       - TrackStream
 *     summary: Créer un stream pour un track et un utilisateur
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
 *         description: Stream créé
 *       400:
 *         description: Erreur de création
 */
trackStreamRoute.post(
  "/create/:userId/:trackId",
  TrackStreamsController.createTrackStream
);

/**
 * @swagger
 * /streams/get/byTrack/{trackId}:
 *   get:
 *     tags:
 *       - TrackStream
 *     summary: Récupérer les streams pour un track donné
 *     parameters:
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Streams trouvés
 *       404:
 *         description: Aucun stream trouvé
 */
trackStreamRoute.get(
  "/get/byTrack/:trackId",
  TrackStreamsController.findTrackStreamsByTrackId
);

/**
 * @swagger
 * /streams/get/byUser/{userId}:
 *   get:
 *     tags:
 *       - TrackStream
 *     summary: Récupérer les streams pour un utilisateur donné
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Streams trouvés
 *       404:
 *         description: Aucun stream trouvé
 */
trackStreamRoute.get(
  "/get/byUser/:userId",
  TrackStreamsController.findTrackStreamsByUserId
);

/**
 * @swagger
 * /streams/get/{id}:
 *   get:
 *     tags:
 *       - TrackStream
 *     summary: Récupérer un stream par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stream trouvé
 *       404:
 *         description: Non trouvé
 */
trackStreamRoute.get("/get/:id", TrackStreamsController.findTrackStreamById);

/**
 * @swagger
 * /streams/get/all:
 *   get:
 *     tags:
 *       - TrackStream
 *     summary: Récupérer tous les streams enregistrés
 *     responses:
 *       200:
 *         description: Liste de tous les streams
 *       400:
 *         description: Erreur de récupération
 */
trackStreamRoute.get("/get/all", TrackStreamsController.findAllTrackStreams);

export default trackStreamRoute;
