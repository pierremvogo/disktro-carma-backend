import { Router } from "express";
import { TrackTagController } from "../controllers";
const trackTagRoute = Router();
/**
 * @swagger
 * /trackTag/create/{tagId}/{trackId}:
 *   post:
 *     tags:
 *       - TrackTag
 *     summary: Associer un tag à un track
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du track
 *     responses:
 *       200:
 *         description: Association TrackTag créée
 *       400:
 *         description: Erreur dans les données fournies
 */

/**
 * @swagger
 * /trackTag/getByTagAndTrack/{tagId}/{trackId}:
 *   get:
 *     tags:
 *       - TrackTag
 *     summary: Récupérer une association TrackTag par tagId et trackId
 *     parameters:
 *       - in: path
 *         name: tagId
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
 *         description: Association non trouvée
 */

/**
 * @swagger
 * /trackTag/getByTrackId/{trackId}:
 *   get:
 *     tags:
 *       - TrackTag
 *     summary: Récupérer toutes les associations TrackTag par trackId
 *     parameters:
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du track
 *     responses:
 *       200:
 *         description: Liste des associations pour le track
 */

/**
 * @swagger
 * /trackTag/getByTagId/{tagId}:
 *   get:
 *     tags:
 *       - TrackTag
 *     summary: Récupérer toutes les associations TrackTag par tagId
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *     responses:
 *       200:
 *         description: Liste des associations pour le tag
 */

/**
 * @swagger
 * /trackTag/getById/{id}:
 *   get:
 *     tags:
 *       - TrackTag
 *     summary: Récupérer une association TrackTag par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'association TrackTag
 *     responses:
 *       200:
 *         description: Association trouvée
 *       404:
 *         description: Association non trouvée
 */

// Create new trackTag
trackTagRoute.post(
  "/create/:tagId/:trackId",
  TrackTagController.createTrackTag
);

// Retrieve trackTag by tagId and trackId
trackTagRoute.get(
  "/getByTagAndTrack/:tagId/:trackId",
  TrackTagController.FindTrackTagByTrackIdAndTagId
);

// Retrieve trackTag by trackId
trackTagRoute.get(
  "/getByTrackId/:trackId",
  TrackTagController.FindTrackTagByTrackId
);

// Retrieve trackTag by tagId
trackTagRoute.get("/getByTagId/:tagId", TrackTagController.FindTrackTagByTagId);

// Retrieve trackTag by id
trackTagRoute.get("/getById/:id", TrackTagController.FindTrackTagById);

export default trackTagRoute;
