import { Router } from "express";
import { TrackController } from "../controllers";
import { SlugMiddleware } from "../middleware/slug.middleware";
import { db } from "../db/db";
import { tracks } from "../db/schema";
const trackRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Tracks
 *   description: Gestion des morceaux
 */

/**
 * @swagger
 * /api/tracks:
 *   get:
 *     summary: Récupérer la liste des morceaux
 *     tags: [Tracks]
 *     responses:
 *       200:
 *         description: Liste des morceaux
 */

/**
 * @swagger
 * /api/tracks/{id}:
 *   get:
 *     summary: Récupérer un morceau par ID
 *     tags: [Tracks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Morceau trouvé
 */

/**
 * @swagger
 * /api/tracks:
 *   post:
 *     summary: Créer un nouveau morceau
 *     tags: [Tracks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Track'
 *     responses:
 *       201:
 *         description: Morceau créé
 */

/**
 * @swagger
 * /api/tracks/{id}:
 *   put:
 *     summary: Mettre à jour un morceau
 *     tags: [Tracks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Track'
 *     responses:
 *       200:
 *         description: Morceau mis à jour
 */

/**
 * @swagger
 * /api/tracks/{id}:
 *   delete:
 *     summary: Supprimer un morceau
 *     tags: [Tracks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Morceau supprimé
 */

// Create a new Track
<<<<<<< HEAD
trackRoute.post(
  "/create",
  SlugMiddleware(db.query.tracks, tracks.slug),
  TrackController.Create
);

// Retrieve Track by Id
trackRoute.get("/getById/:id", TrackController.FindTrackById);

// Retrieve track by artistId
trackRoute.get("/getByArtist/:artistId", TrackController.FindTracksByArtistId);

// Retrieve Track by album Id
trackRoute.get("/getByAlbum/:albumId", TrackController.FindTracksByAlbumId);
=======
trackRoute.post('/create', TrackController.Create);

// Retrieve Track by Id
trackRoute.get('/getById/:id', TrackController.FindTrackById);

// Retrieve track by artistId
trackRoute.get('/getByArtist/:artistId', TrackController.FindTracksByArtistId);

// Retrieve Track by collection Id
trackRoute.get(
  '/getByCollection/:collectionId',
  TrackController.FindTracksByCollectionId
);
>>>>>>> new commit

export default trackRoute;
