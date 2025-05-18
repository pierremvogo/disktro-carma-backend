import { Router } from "express";
import { AlbumController } from "../controllers";
const albumRoute = Router();

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

// Create a new album
albumRoute.post("/create", AlbumController.create);

// Retrieve album by Id
albumRoute.get("/getById/:id", AlbumController.FindAlbumById);

// Retrieve album by artist and slug
albumRoute.get(
  "/getByArtistAndSlug/:artistId/:slug",
  AlbumController.FindAlbumByArtistAndSlug
);

// Retrieve album By ArtistId
albumRoute.get("/getByArtist/:artistId", AlbumController.FindAlbumsByArtistId);

export default albumRoute;
