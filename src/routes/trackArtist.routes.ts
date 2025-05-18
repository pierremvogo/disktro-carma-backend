import { Router } from "express";
import { TrackArtistController } from "../controllers";

const trackArtistRoute = Router();

/**
 * @swagger
 * /trackArtist/create/{artistId}/{trackId}:
 *   post:
 *     tags:
 *       - TrackArtist
 *     summary: Associer un artiste à un track
 *     parameters:
 *       - in: path
 *         name: artistId
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
trackArtistRoute.post(
  "/create/:artistId/:trackId",
  TrackArtistController.createTrackArtist
);

/**
 * @swagger
 * /trackArtist/get/byArtist/{artistId}/byTrack/{trackId}:
 *   get:
 *     tags:
 *       - TrackArtist
 *     summary: Récupérer une association artiste-track par leurs IDs
 *     parameters:
 *       - in: path
 *         name: artistId
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
 *         description: Non trouvé
 */
trackArtistRoute.get(
  "/get/byArtist/:artistId/byTrack/:trackId",
  TrackArtistController.FindTrackArtistByTrackIdAndArtistId
);

/**
 * @swagger
 * /trackArtist/get/byArtist/{artistId}:
 *   get:
 *     tags:
 *       - TrackArtist
 *     summary: Récupérer les associations pour un artiste donné
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Associations trouvées
 *       404:
 *         description: Aucune association trouvée
 */
trackArtistRoute.get(
  "/get/byArtist/:artistId",
  TrackArtistController.FindTrackArtistByArtistId
);

/**
 * @swagger
 * /trackArtist/get/byTrack/{trackId}:
 *   get:
 *     tags:
 *       - TrackArtist
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
trackArtistRoute.get(
  "/get/byTrack/:trackId",
  TrackArtistController.FindTrackArtistByTrackId
);

/**
 * @swagger
 * /trackArtist/get/{id}:
 *   get:
 *     tags:
 *       - TrackArtist
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
trackArtistRoute.get("/get/:id", TrackArtistController.FindTrackArtistById);

export default trackArtistRoute;
