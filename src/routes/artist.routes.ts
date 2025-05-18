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
  ArtistController.FindArtistsAdminedByUser
);

// Retrieve artist By UserEmail
artistsRoute.get(
  '/getByUserEmail/:userEmail',
  ArtistController.FindArtistsByUserEmail
);

// Retrieve artist with Tag
artistsRoute.get(
  '/getWithTag/:tagId',
  ArtistController.FindArtistsAdminedByUser
);

export default artistsRoute;
