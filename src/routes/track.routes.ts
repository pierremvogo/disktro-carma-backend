import { Router } from "express";
import { TrackController } from "../controllers";
import { SlugMiddleware } from "../middleware/slug.middleware";
import { db } from "../db/db";
import { tracks } from "../db/schema";
import { AuthMiddleware } from "../middleware/auth.middleware";
const trackRoute = Router();

// const audio = new Audio(URL.createObjectURL(file));
// audio.onloadedmetadata = () => {
//   const durationInSeconds = Math.floor(audio.duration);
//   console.log("Durée de la piste :", durationInSeconds);
// };

/**
 * @swagger
 * /track/create:
 *   post:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Créer un nouveau track
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               moodId:
 *                 type: string
 *               duration:
 *                 type: integer
 *               audioUrl:
 *                 type: string
 *             required:
 *               - title
 *               - duration
 *               - audioUrl
 *             example:
 *                title: "Bohemian Rhapsody"
 *                duration: 245
 *                moodId: "C0m6h8YnIZl-V8L1uw-Wo"
 *                audioUrl: "http://www.apimusic.com/audio.mp3"
 *     responses:
 *       201:
 *         description: Track créé avec succès
 *       400:
 *         description: Requête invalide
 */

/**
 * @swagger
 * /track/getById/{id}:
 *   get:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer un track par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du track
 *     responses:
 *       200:
 *         description: Track trouvé
 *       404:
 *         description: Track non trouvé
 */

/**
 * @swagger
 * /track/getAll:
 *   get:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer la liste de tous les tracks
 *     responses:
 *       200:
 *         description: Liste des tracks récupérée avec succès
 *       500:
 *         description: Erreur serveur lors de la récupération des tracks
 */

/**
 * @swagger
 * /track/getByRelease/{releaseId}:
 *   get:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les morceaux associés à une release
 *     parameters:
 *       - in: path
 *         name: releaseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la release
 *     responses:
 *       200:
 *         description: Liste des tracks de la release
 *       404:
 *         description: Aucun track trouvé pour cette release
 */

/**
 * @swagger
 * /track/getByAlbum/{albumId}:
 *   get:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les morceaux associés à un  album
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'album
 *     responses:
 *       200:
 *         description: Liste des tracks de l'album
 *       404:
 *         description: Aucun track trouvé pour cet album
 */

/**
 * @swagger
 * /track/getByUser/{userId}:
 *   get:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les morceaux associés à un User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des tracks de l'album
 *       404:
 *         description: Aucun track trouvé pour cet album
 */

/**
 * @swagger
 * /track/{id}:
 *   put:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour un track existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du track à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               duration:
 *                 type: integer
 *             example:
 *                title: "Bohemian Rhapsody"
 *                duration: 245
 *                moodId: "C0m6h8YnIZl-V8L1uw-Wo"
 *                audioUrl: "http://www.apimusic.com/audio.mp3"
 *     responses:
 *       200:
 *         description: Track mis à jour avec succès
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Track non trouvé
 */

/**
 * @swagger
 * /track/{id}:
 *   delete:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un track par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du track à supprimer
 *     responses:
 *       200:
 *         description: Track supprimé avec succès
 *       404:
 *         description: Track non trouvé
 */

trackRoute.post("/create", AuthMiddleware, TrackController.Create);
trackRoute.get("/getById/:id", AuthMiddleware, TrackController.FindTrackById);
trackRoute.get("/getAll", AuthMiddleware, TrackController.FindAllTrack);
trackRoute.get("/getById/:id", AuthMiddleware, TrackController.FindTrackById);
trackRoute.get(
  "/getByRelease/:releaseId",
  AuthMiddleware,
  TrackController.FindTracksByReleaseId
);
trackRoute.get(
  "/getByAlbum/:albumId",
  AuthMiddleware,
  TrackController.FindTracksByAlbumId
);
trackRoute.get(
  "/getByUser/:userId",
  AuthMiddleware,
  TrackController.FindTrackByUserId
);
trackRoute.put("/:id", AuthMiddleware, TrackController.UpdateTrack);
trackRoute.delete("/:id", AuthMiddleware, TrackController.DeleteTrack);

export default trackRoute;
