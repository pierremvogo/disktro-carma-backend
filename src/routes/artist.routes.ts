import { Router } from "express";
import { ArtistController } from "../controllers";
import { SlugMiddleware } from "../middleware/slug.middleware";
import { db } from "../db/db";
import { artists } from "../db/schema";
const artistsRoute = Router();

/**
 * @swagger
 * /artists/create:
 *   post:
 *     tags:
 *       - Artist
 *     summary: Créer un nouvel artiste
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             # Définir ici le schéma attendu pour créer un artiste
 *     responses:
 *       201:
 *         description: Artiste créé avec succès
 *       400:
 *         description: Erreur lors de la création
 */

/**
 * @swagger
 * /artists/get:
 *   get:
 *     tags:
 *       - Artist
 *     summary: Récupérer tous les artistes
 *     responses:
 *       200:
 *         description: Liste des artistes récupérée
 *       404:
 *         description: Aucun artiste trouvé
 */

/**
 * @swagger
 * /artists/getById/{id}:
 *   get:
 *     tags:
 *       - Artist
 *     summary: Récupérer un artiste par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste
 *     responses:
 *       200:
 *         description: Artiste trouvé
 *       404:
 *         description: Artiste non trouvé
 */

/**
 * @swagger
 * /artists/getBySlug/{slug}:
 *   get:
 *     tags:
 *       - Artist
 *     summary: Récupérer un artiste par son slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug de l'artiste
 *     responses:
 *       200:
 *         description: Artiste trouvé
 *       404:
 *         description: Artiste non trouvé
 */

/**
 * @swagger
 * /artists/getAdmin/{userId}:
 *   get:
 *     tags:
 *       - Artist
 *     summary: Récupérer les artistes administrés par un utilisateur donné
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des artistes administrés
 *       404:
 *         description: Aucun artiste administré trouvé
 */

/**
 * @swagger
 * /artists/getByUserEmail/{userEmail}:
 *   get:
 *     tags:
 *       - Artist
 *     summary: Récupérer les artistes associés à un email utilisateur
 *     parameters:
 *       - in: path
 *         name: userEmail
 *         required: true
 *         schema:
 *           type: string
 *         description: Email de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des artistes associés
 *       404:
 *         description: Aucun artiste trouvé
 */

/**
 * @swagger
 * /artists/getWithTag/{tagId}:
 *   get:
 *     tags:
 *       - Artist
 *     summary: Récupérer les artistes associés à un tag
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *     responses:
 *       200:
 *         description: Liste des artistes avec le tag
 *       404:
 *         description: Aucun artiste trouvé pour ce tag
 */
/**
 * @swagger
 * /artists/{id}:
 *   put:
 *     tags:
 *       - Artist
 *     summary: Mettre à jour un artiste
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de l'artiste
 *               slug:
 *                 type: string
 *                 description: Slug unique pour l'artiste
 *             example:
 *               name: "Nouvel artiste"
 *               slug: "nouvel-artiste"
 *     responses:
 *       200:
 *         description: Artiste mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Artiste non trouvé
 */

/**
 * @swagger
 * /artists/{id}:
 *   delete:
 *     tags:
 *       - Artist
 *     summary: Supprimer un artiste
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste à supprimer
 *     responses:
 *       200:
 *         description: Artiste supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Artiste supprimé avec succès"
 *       404:
 *         description: Artiste non trouvé
 */

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
  ArtistController.FindArtistsAdminedByUser
);

// Retrieve artist By UserEmail
artistsRoute.get(
  "/getByUserEmail/:userEmail",
  ArtistController.FindArtistsByUserEmail
);

// Retrieve artist with Tag
artistsRoute.get(
  "/getWithTag/:tagId",
  ArtistController.FindArtistsAdminedByUser
);

artistsRoute.put("/artists/:id", ArtistController.UpdateArtist); // <-- Route update
artistsRoute.delete("/artists/:id", ArtistController.DeleteArtist);

export default artistsRoute;
