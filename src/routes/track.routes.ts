import { Router } from "express";
import { TrackController } from "../controllers";
import { SlugMiddleware } from "../middleware/slug.middleware";
import { db } from "../db/db";
import { tracks } from "../db/schema";
const trackRoute = Router();

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
 *               artistId:
 *                 type: string
 *               albumId:
 *                 type: string
 *               duration:
 *                 type: integer
 *             required:
 *               - title
 *               - artistId
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
 * /track/getByArtist/{artistId}:
 *   get:
 *     tags:
 *       - Track
 *     summary: Récupérer les tracks par ID d'artiste
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
 *     summary: Récupérer les tracks par ID d'album
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
 * /track/tracks/{id}:
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
 *               artistId:
 *                 type: string
 *               albumId:
 *                 type: string
 *               duration:
 *                 type: integer
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
 * /track/tracks/{id}:
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

trackRoute.post(
  "/create",
  SlugMiddleware(db.query.tracks, tracks.slug),
  TrackController.Create
);

trackRoute.get("/getById/:id", TrackController.FindTrackById);
trackRoute.get("/getByArtist/:artistId", TrackController.FindTracksByArtistId);
trackRoute.get("/getByAlbum/:albumId", TrackController.FindTracksByAlbumId);

trackRoute.put("/tracks/:id", TrackController.UpdateTrack); // Route update
trackRoute.delete("/tracks/:id", TrackController.DeleteTrack); // Route delete

export default trackRoute;
