import { Router } from "express";
import { TrackSingleController } from "../controllers";

const trackSingleRoute = Router();

/**
 * @swagger
 * /trackSingle/create/{singleId}/{trackId}:
 *   post:
 *     tags:
 *       - TrackSingle
 *     summary: Associer un track à un single
 *     parameters:
 *       - in: path
 *         name: singleId
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
trackSingleRoute.post(
  "/create/:singleId/:trackId",
  TrackSingleController.createTrackSingle
);

/**
 * @swagger
 * /trackSingle/get/bySingle/{singleId}/byTrack/{trackId}:
 *   get:
 *     tags:
 *       - TrackSingle
 *     summary: Récupérer une association single-track par leurs IDs
 *     parameters:
 *       - in: path
 *         name: singleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Association trouvée
 *       404:
 *         description: Non trouvée
 */
trackSingleRoute.get(
  "/get/bySingle/:singleId/byTrack/:trackId",
  TrackSingleController.FindTrackSingleByTrackIdAndSingleId
);

/**
 * @swagger
 * /trackSingle/get/byTrack/{trackId}:
 *   get:
 *     tags:
 *       - TrackSingle
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
trackSingleRoute.get(
  "/get/byTrack/:trackId",
  TrackSingleController.FindTrackSingleByTrackId
);

/**
 * @swagger
 * /trackSingle/get/bySingle/{singleId}:
 *   get:
 *     tags:
 *       - TrackSingle
 *     summary: Récupérer les associations pour un single donné
 *     parameters:
 *       - in: path
 *         name: singleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Associations trouvées
 *       404:
 *         description: Aucune association trouvée
 */
trackSingleRoute.get(
  "/get/bySingle/:singleId",
  TrackSingleController.FindTrackSingleBySingleId
);

/**
 * @swagger
 * /trackSingle/get/{id}:
 *   get:
 *     tags:
 *       - TrackSingle
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
trackSingleRoute.get("/get/:id", TrackSingleController.FindTrackSingleById);

export default trackSingleRoute;
