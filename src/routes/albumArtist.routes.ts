import { Router } from "express";
import { AlbumArtistController } from "../controllers";
const albumArtistRoute = Router();
/**
 * @swagger
 * /albumArtist/create/{artistId}/{albumId}:
 *   post:
 *     tags:
 *       - AlbumArtist
 *     summary: Créer une nouvelle association artiste-album
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'album
 *     responses:
 *       201:
 *         description: Association créée avec succès
 *       400:
 *         description: Erreur de création
 */

/**
 * @swagger
 * /albumArtist/get/{artistId}/{albumId}:
 *   get:
 *     tags:
 *       - AlbumArtist
 *     summary: Récupérer une association artiste-album par leurs IDs
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'album
 *     responses:
 *       200:
 *         description: Association trouvée
 *       404:
 *         description: Association non trouvée
 */

/**
 * @swagger
 * /albumArtist/get/byArtist/{artistId}:
 *   get:
 *     tags:
 *       - AlbumArtist
 *     summary: Récupérer les associations pour un artiste donné
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste
 *     responses:
 *       200:
 *         description: Associations trouvées
 *       404:
 *         description: Aucune association trouvée
 */

/**
 * @swagger
 * /albumArtist/get/byAlbum/{albumId}:
 *   get:
 *     tags:
 *       - AlbumArtist
 *     summary: Récupérer les associations pour un album donné
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'album
 *     responses:
 *       200:
 *         description: Associations trouvées
 *       404:
 *         description: Aucune association trouvée
 */

/**
 * @swagger
 * /albumArtist/get/byId/{id}:
 *   get:
 *     tags:
 *       - AlbumArtist
 *     summary: Récupérer une association par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'association
 *     responses:
 *       200:
 *         description: Association trouvée
 *       404:
 *         description: Association non trouvée
 */

// Create new albumArtist
albumArtistRoute.post(
  "/create/:artistId/:albumId",
  AlbumArtistController.createAlbumArtist
);

// Retrieve albumArtist by artistId and albumId
albumArtistRoute.get(
  "/get/:artistId/:albumId",
  AlbumArtistController.FindAlbumArtistByArtistIdAndAlbumId
);

// Retrieve albumArtist by artistId
albumArtistRoute.get(
  "/get/:artistId",
  AlbumArtistController.FindAlbumArtistByArtistId
);

// Retrieve albumArtist by albumId
albumArtistRoute.get(
  "/get/:albumId",
  AlbumArtistController.FindAlbumArtistByAlbumId
);

// Retrieve albumArtist by id
albumArtistRoute.get("/get/:id", AlbumArtistController.FindAlbumArtistById);

export default albumArtistRoute;
