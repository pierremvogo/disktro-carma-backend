import { Router } from "express";
import { ArtistController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";
const artistsRoute = Router();

/**
 * @swagger
 * /artists/create:
 *   post:
 *     tags:
 *       - Artist
 *     security:
 *       - bearerAuth: []
 *     summary: Créer un nouvel artiste
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
 *               media_url:
 *                 type: string
 *                 description: URL d’une vidéo promo, bande-annonce, ou media promotionnel de l’artiste
 *               location:
 *                 type: string
 *                 description: Pays ou ville de résidence ou d’origine de l’artiste
 *               profileImageUrl:
 *                 type: string
 *                 description: URL de l’image de profil de l’artiste
 *               biography:
 *                 type: string
 *                 description: Biographie de l’artiste, description, parcours, collaborations,
 *             example:
 *               name: "Burna Boy"
 *               media_url: "https://youtu.be/xyz"
 *               location: "Lagos, Nigeria"
 *               profileImageUrl: "https:/site.be/download/image/1717233000-burna.jpg"
 *               biography: "Chanteur et compositeur Nigérian primé aux BET Awards..."
 *
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 *               media_url:
 *                 type: string
 *                 description: URL d’une vidéo promo, bande-annonce, ou media promotionnel de l’artiste
 *               location:
 *                 type: string
 *                 description: Pays ou ville de résidence ou d’origine de l’artiste
 *               profileImageUrl:
 *                 type: string
 *                 description: URL de l’image de profil de l’artiste
 *               biography:
 *                 type: string
 *                 description: Biographie de l’artiste, description, parcours, collaborations,
 *             example:
 *               name: "Burna Boy"
 *               media_url: "https://youtu.be/xyz"
 *               location: "Lagos, Nigeria"
 *               profileImageUrl: "https://site.be/download/image/1717233000-burna.jpg"
 *               biography: "Chanteur et compositeur Nigérian primé aux BET Awards..."
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
 *     security:
 *       - bearerAuth: []
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
artistsRoute.post("/create", AuthMiddleware, ArtistController.CreateArtist);

// Retrieve all artists
artistsRoute.get("/get", AuthMiddleware, ArtistController.FindAllArtists);

// Retrieve a single artist with id
artistsRoute.get(
  "/getById/:id",
  AuthMiddleware,
  ArtistController.FindArtistById
);

// Retrieve artist by slug
artistsRoute.get(
  "/getBySlug/:slug",
  AuthMiddleware,
  ArtistController.FindArtistBySlug
);

// Retrieve artistAdmin By UserId
artistsRoute.get(
  "/getAdmin/:userId",
  AuthMiddleware,
  ArtistController.FindArtistsAdminedByUser
);

// Retrieve artist By UserEmail
artistsRoute.get(
  "/getByUserEmail/:userEmail",
  AuthMiddleware,
  ArtistController.FindArtistsByUserEmail
);

// Retrieve artist with Tag
artistsRoute.get(
  "/getWithTag/:tagId",
  AuthMiddleware,
  ArtistController.FindArtistsAdminedByUser
);

artistsRoute.put("/:id", AuthMiddleware, ArtistController.UpdateArtist);
artistsRoute.delete("/:id", AuthMiddleware, ArtistController.DeleteArtist);

export default artistsRoute;
