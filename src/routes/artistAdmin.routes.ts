import { Router } from "express";
import { ArtistAdminController } from "../controllers";
const artistAdminRoute = Router();

/**
 * @swagger
 * /artistAdmin/create/{adminId}/{artistId}:
 *   post:
 *     tags:
 *       - ArtistAdmin
 *     summary: Associer un administrateur à un artiste
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'administrateur
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
 * /artistAdmin/get/{userId}/{artistId}:
 *   get:
 *     tags:
 *       - ArtistAdmin
 *     summary: Récupérer une association admin-artiste par leurs IDs
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur/admin
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
 * /artistAdmin/get/{userId}:
 *   get:
 *     tags:
 *       - ArtistAdmin
 *     summary: Récupérer les associations pour un administrateur donné
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur/admin
 *     responses:
 *       200:
 *         description: Associations trouvées
 *       404:
 *         description: Aucune association trouvée
 */

/**
 * @swagger
 * /artistAdmin/get/{artistId}:
 *   get:
 *     tags:
 *       - ArtistAdmin
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
 * /artistAdmin/get/{id}:
 *   get:
 *     tags:
 *       - ArtistAdmin
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

// Create new artistAdmin
artistAdminRoute.post(
  "/create/:adminId/:artistId",
  ArtistAdminController.createArtistAdmin
);

// Retrieve artistAdmin by userId and artistId
artistAdminRoute.get(
  "/get/:userId/:artistId",
  ArtistAdminController.FindArtistAdminByUserIdAndArtistId
);

// Retrieve artistAdmin by userId
artistAdminRoute.get(
  "/get/:userId",
  ArtistAdminController.FindArtistAdminByUserId
);

// Retrieve artistAdmin by artistId
artistAdminRoute.get(
  "/get/:artistId",
  ArtistAdminController.FindArtistAdminByArtistId
);

// Retrieve artistAdmin by id
artistAdminRoute.get("/get/:id", ArtistAdminController.FindArtistAdminById);

export default artistAdminRoute;
