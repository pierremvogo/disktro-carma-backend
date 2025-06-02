import { Router } from "express";
import { TrackController } from "../controllers";
import { SlugMiddleware } from "../middleware/slug.middleware";
import { db } from "../db/db";
import { tracks } from "../db/schema";
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
 *               duration:
 *                 type: integer
 *             required:
 *               - title
 *               - duration
 *             example:
 *                title: "Bohemian Rhapsody"
 *                duration: 245
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
 *     summary: Récupérer la liste de tous les tracks
 *     responses:
 *       200:
 *         description: Liste des tracks récupérée avec succès
 *       500:
 *         description: Erreur serveur lors de la récupération des tracks
 */

/**
 * @swagger
 * /track/getByArtist/{artistId}:
 *   get:
 *     tags:
 *       - Track
 *     summary: Récupérer les morceaux associés à un artiste
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste
 *     responses:
 *       200:
 *         description: Liste des tracks de l'artiste
 *       404:
 *         description: Aucun track trouvé pour cet artiste
 */

/**
 * @swagger
 * /track/getByAlbum/{albumId}:
 *   get:
 *     tags:
 *       - Track
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
 * /track/{id}:
 *   put:
 *     tags:
 *       - Track
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
 *             required:
 *               - title
 *               - duration
 *             example:
 *                title: "Bohemian Rhapsody"
 *                duration: 245
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

trackRoute.post("/create", TrackController.Create);
trackRoute.get("/getById/:id", TrackController.FindTrackById);
trackRoute.get("/getAll", TrackController.FindAllTrack);
trackRoute.get("/getById/:id", TrackController.FindTrackById);
trackRoute.get("/getByArtist/:artistId", TrackController.FindTracksByArtistId);
trackRoute.get("/getByAlbum/:albumId", TrackController.FindTracksByAlbumId);
trackRoute.put("/:id", TrackController.UpdateTrack);
trackRoute.delete("/:id", TrackController.DeleteTrack);

export default trackRoute;
