import { Router } from "express";
import { AlbumTagController } from "../controllers";
const albumTagRoute = Router();

/**
 * @swagger
 * /albumTag/create/{tagId}/{albumId}:
 *   post:
 *     tags:
 *       - AlbumTag
 *     summary: Créer une nouvelle association tag-album
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
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
 * /albumTag/get/{tagId}/{albumId}:
 *   get:
 *     tags:
 *       - AlbumTag
 *     summary: Récupérer une association tag-album par leurs IDs
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
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
 * /albumTag/get/albumId/{albumId}:
 *   get:
 *     tags:
 *       - AlbumTag
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
 * /albumTag/get/tagId/{tagId}:
 *   get:
 *     tags:
 *       - AlbumTag
 *     summary: Récupérer les associations pour un tag donné
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *     responses:
 *       200:
 *         description: Associations trouvées
 *       404:
 *         description: Aucune association trouvée
 */

/**
 * @swagger
 * /albumTag/get/id/{id}:
 *   get:
 *     tags:
 *       - AlbumTag
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

// Create new albumTag
albumTagRoute.post(
  "/create/:tagId/:albumId",
  AlbumTagController.createAlbumTag
);

// Retrieve albumTag by albumId and TagId
albumTagRoute.get(
  "/get/:tagId/:albumId",
  AlbumTagController.FindAlbumTagByAlbumIdAndTagId
);

// Retrieve albumTag by albumId
albumTagRoute.get("/get/albumId", AlbumTagController.FindAlbumTagByAlbumId);

// Retrieve albumTag by tagId
albumTagRoute.get("/get/tagId", AlbumTagController.FindAlbumTagByTagId);

// Retrieve albumTag by Id
albumTagRoute.get("/get/id", AlbumTagController.FindAlbumTagById);

export default albumTagRoute;
