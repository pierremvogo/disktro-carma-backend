<<<<<<< HEAD
import { Router } from "express";
import { ArtistController } from "../controllers";
import { SlugMiddleware } from "../middleware/slug.middleware";
import { db } from "../db/db";
import { artists } from "../db/schema";
const artistsRoute = Router();

// Create a new artist
artistsRoute.post(
  "/create",
  SlugMiddleware(db.query.artists, artists.slug),
  ArtistController.CreateArtist
);

// Retrieve all artists
artistsRoute.get("/get", ArtistController.FindAllArtists);

// Retrieve a single artist with id
artistsRoute.get("/getById/:id", ArtistController.FindArtistById);

// Retrieve artist by slug
artistsRoute.get("/getBySlug/:slug", ArtistController.FindArtistBySlug);

// Retrieve artistAdmin By UserId
artistsRoute.get(
  "/getAdmin/:userId",
=======
import { Router } from 'express';
import { ArtistController } from '../controllers';
const artistsRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Artists
 *   description: Gestion des artistes
 */

/**
 * @swagger
 * /api/artists:
 *   get:
 *     summary: Récupérer la liste des artistes
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: Liste des artistes
 */

/**
 * @swagger
 * /api/artists/{id}:
 *   get:
 *     summary: Récupérer un artiste par ID
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Artiste trouvé
 *       404:
 *         description: Artiste non trouvé
 */

/**
 * @swagger
 * /api/artists:
 *   post:
 *     summary: Créer un nouvel artiste
 *     tags: [Artists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Artist'
 *     responses:
 *       201:
 *         description: Artiste créé
 */

/**
 * @swagger
 * /api/artists/{id}:
 *   put:
 *     summary: Mettre à jour un artiste
 *     tags: [Artists]
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
 *             $ref: '#/components/schemas/Artist'
 *     responses:
 *       200:
 *         description: Artiste mis à jour
 */

/**
 * @swagger
 * /api/artists/{id}:
 *   delete:
 *     summary: Supprimer un artiste
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Artiste supprimé
 */

// Create a new artist
artistsRoute.post('/create', ArtistController.CreateArtist);

// Retrieve all artists
artistsRoute.get('/get', ArtistController.FindAllArtists);

// Retrieve a single artist with id
artistsRoute.get('/getById/:id', ArtistController.FindArtistById);

// Retrieve artist by slug
artistsRoute.get('/getBySlug/:slug', ArtistController.FindArtistBySlug);

// Retrieve artistAdmin By UserId
artistsRoute.get(
  '/getAdmin/:userId',
>>>>>>> new commit
  ArtistController.FindArtistsAdminedByUser
);

// Retrieve artist By UserEmail
artistsRoute.get(
<<<<<<< HEAD
  "/getByUserEmail/:userEmail",
=======
  '/getByUserEmail/:userEmail',
>>>>>>> new commit
  ArtistController.FindArtistsByUserEmail
);

// Retrieve artist with Tag
artistsRoute.get(
<<<<<<< HEAD
  "/getWithTag/:tagId",
=======
  '/getWithTag/:tagId',
>>>>>>> new commit
  ArtistController.FindArtistsAdminedByUser
);

export default artistsRoute;
