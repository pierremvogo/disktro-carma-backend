import { Router } from "express";
import { TrackAlbumController } from "../controllers";

const trackAlbumRoute = Router();

/**
 * @swagger
 * /trackAlbum/create/{albumId}/{trackId}:
 *   post:
 *     tags:
 *       - TrackAlbum
 *     summary: Associer un track à un album
 *     parameters:
 *       - in: path
 *         name: albumId
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
trackAlbumRoute.post(
  "/create/:albumId/:trackId",
  TrackAlbumController.createTrackAlbum
);

/**
 * @swagger
 * /trackAlbum/get/byAlbum/{albumId}/byTrack/{trackId}:
 *   get:
 *     tags:
 *       - TrackAlbum
 *     summary: Récupérer une association album-track par leurs IDs
 *     parameters:
 *       - in: path
 *         name: albumId
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
trackAlbumRoute.get(
  "/get/byAlbum/:albumId/byTrack/:trackId",
  TrackAlbumController.FindTrackAlbumByTrackIdAndAlbumId
);

/**
 * @swagger
 * /trackAlbum/get/byTrack/{trackId}:
 *   get:
 *     tags:
 *       - TrackAlbum
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
trackAlbumRoute.get(
  "/get/byTrack/:trackId",
  TrackAlbumController.FindTrackAlbumByTrackId
);

/**
 * @swagger
 * /trackAlbum/get/byAlbum/{albumId}:
 *   get:
 *     tags:
 *       - TrackAlbum
 *     summary: Récupérer les associations pour un album donné
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Associations trouvées
 *       404:
 *         description: Aucune association trouvée
 */
trackAlbumRoute.get(
  "/get/byAlbum/:albumId",
  TrackAlbumController.FindTrackAlbumByAlbumId
);

/**
 * @swagger
 * /trackAlbum/get/{id}:
 *   get:
 *     tags:
 *       - TrackAlbum
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
trackAlbumRoute.get("/get/:id", TrackAlbumController.FindTrackAlbumById);

export default trackAlbumRoute;
