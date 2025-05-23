import { Router } from "express";
import { AlbumController } from "../controllers";
const albumRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Album
 *     description: Gestion des albums musicaux
 */

/**
 * @swagger
 * /album/create:
 *   post:
 *     tags:
 *       - Album
 *     summary: Créer un nouvel album
 *     requestBody:
 *       description: Données de l'album à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             # Définis ici le schéma exact attendu pour la création d'un album
 *     responses:
 *       201:
 *         description: Album créé avec succès
 *       400:
 *         description: Erreur lors de la création de l'album
 */

/**
 * @swagger
 * /album/getById/{id}:
 *   get:
 *     tags:
 *       - Album
 *     summary: Récupérer un album par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'album
 *     responses:
 *       200:
 *         description: Album trouvé
 *       404:
 *         description: Album non trouvé
 */

/**
 * @swagger
 * /album/getByArtistAndSlug/{artistId}/{slug}:
 *   get:
 *     tags:
 *       - Album
 *     summary: Récupérer un album par l'ID de l'artiste et le slug
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug de l'album
 *     responses:
 *       200:
 *         description: Album trouvé
 *       404:
 *         description: Album non trouvé
 */

/**
 * @swagger
 * /album/getByArtist/{artistId}:
 *   get:
 *     tags:
 *       - Album
 *     summary: Récupérer tous les albums d'un artiste par son ID
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste
 *     responses:
 *       200:
 *         description: Liste des albums trouvés
 *       404:
 *         description: Aucun album trouvé pour cet artiste
 */

/**
 * @swagger
 * /albums/{id}:
 *   put:
 *     tags:
 *       - Album
 *     summary: Mettre à jour un album
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'album à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre de l'album
 *               slug:
 *                 type: string
 *                 description: Slug unique de l'album
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 description: Date de sortie de l'album
 *               artistId:
 *                 type: string
 *                 description: ID de l'artiste associé
 *             example:
 *               title: "Nouvel album"
 *               slug: "nouvel-album"
 *               releaseDate: "2025-05-22"
 *               artistId: "123456789"
 *     responses:
 *       200:
 *         description: Album mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 releaseDate:
 *                   type: string
 *                   format: date
 *                 artistId:
 *                   type: string
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Album non trouvé
 */

/**
 * @swagger
 * /albums/{id}:
 *   delete:
 *     tags:
 *       - Album
 *     summary: Supprimer un album
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'album à supprimer
 *     responses:
 *       200:
 *         description: Album supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Album supprimé avec succès"
 *       404:
 *         description: Album non trouvé
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
albumRoute.put("/albums/:id", AlbumController.UpdateAlbum); // <-- Route update
albumRoute.delete("/albums/:id", AlbumController.DeleteAlbum);

export default albumRoute;
