import { Router } from "express";
import { ArtistTagController } from "../controllers";
const artistsTagRoute = Router();

/**
 * @swagger
 * /artistTag/create/{tagId}/{artistId}:
 *   post:
 *     tags:
 *       - ArtistTag
 *     summary: Associer un tag à un artiste
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste
 *     responses:
 *       201:
 *         description: Association créée avec succès
 *       400:
 *         description: Erreur lors de la création
 */

/**
 * @swagger
 * /artistTag/get/{tagId}/{artistId}:
 *   get:
 *     tags:
 *       - ArtistTag
 *     summary: Récupérer une association tag-artiste par leurs IDs
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste
 *     responses:
 *       200:
 *         description: Association trouvée
 *       404:
 *         description: Non trouvée
 */

/**
 * @swagger
 * /artistTag/get/{artistId}:
 *   get:
 *     tags:
 *       - ArtistTag
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
 * /artistTag/get/{tagId}:
 *   get:
 *     tags:
 *       - ArtistTag
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
 * /artistTag/get/{id}:
 *   get:
 *     tags:
 *       - ArtistTag
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
 *         description: Non trouvée
 */

// Create a new artistTag
artistsTagRoute.post("/create/:tagId/:artistId", ArtistTagController.create);

// Retrieve artistTag by artistId and tag Ig
artistsTagRoute.get(
  "/get/:tagId/:artistId",
  ArtistTagController.FindArtistTagByArtistIdAndTagId
);

// Retrieve artistTag by artistId
artistsTagRoute.get(
  "/get/:artistId",
  ArtistTagController.FindArtistTagByArtistId
);

// Retrieve artistTag by tagId
artistsTagRoute.get("/get/:tagId", ArtistTagController.FindArtistTagBytagId);

// Retrieve artistTag by id
artistsTagRoute.get("/get/:id", ArtistTagController.FindArtistTagById);

export default artistsTagRoute;
