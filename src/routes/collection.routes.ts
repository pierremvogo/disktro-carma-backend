import { Router } from 'express';
import { CollectionController } from '../controllers';
const collectionRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Albums
 *   description: Gestion des albums
 */

/**
 * @swagger
 * /api/albums:
 *   get:
 *     summary: Récupérer la liste des albums
 *     tags: [Albums]
 *     responses:
 *       200:
 *         description: Liste des albums
 */

/**
 * @swagger
 * /api/albums/{id}:
 *   get:
 *     summary: Récupérer un album par ID
 *     tags: [Albums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Album trouvé
 */

/**
 * @swagger
 * /api/albums:
 *   post:
 *     summary: Créer un nouvel album
 *     tags: [Albums]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Album'
 *     responses:
 *       201:
 *         description: Album créé
 */

/**
 * @swagger
 * /api/albums/{id}:
 *   put:
 *     summary: Mettre à jour un album
 *     tags: [Albums]
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
 *             $ref: '#/components/schemas/Album'
 *     responses:
 *       200:
 *         description: Album mis à jour
 */

/**
 * @swagger
 * /api/albums/{id}:
 *   delete:
 *     summary: Supprimer un album
 *     tags: [Albums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Album supprimé
 */

// Create a new collection
collectionRoute.post('/create', CollectionController.create);

// Retrieve collection by Id
collectionRoute.get('/getById/:id', CollectionController.FindCollectionById);

// Retrieve collection by artist and slug
collectionRoute.get(
  '/getByArtistAndSlug/:artistId/:slug',
  CollectionController.FindCollectionByArtistAndSlug
);

// Retrieve collection By ArtistId
collectionRoute.get(
  '/getByArtist/:artistId',
  CollectionController.FindCollectionsByArtistId
);

export default collectionRoute;
