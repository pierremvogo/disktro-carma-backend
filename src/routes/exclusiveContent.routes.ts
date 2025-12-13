import { Router } from "express";
import { ExclusiveContentController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";

const exclusiveContentRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: ExclusiveContent
 *     description: Gestion des contenus exclusifs (réservés aux abonnés)
 */

/**
 * @swagger
 * /exclusive-content/create:
 *   post:
 *     tags:
 *       - ExclusiveContent
 *     security:
 *       - bearerAuth: []
 *     summary: Créer un contenu exclusif (metadata + fileUrl)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               artistId:
 *                 type: string
 *                 description: ID de l'artiste propriétaire du contenu
 *               type:
 *                 type: string
 *                 description: Type de contenu (music, video, photo, document)
 *               title:
 *                 type: string
 *                 description: Titre du contenu
 *               description:
 *                 type: string
 *                 description: Description du contenu
 *               fileUrl:
 *                 type: string
 *                 description: URL du fichier (Cloudinary / S3 / etc.)
 *             required:
 *               - artistId
 *               - type
 *               - title
 *               - fileUrl
 *             example:
 *               artistId: "TUl6PW6eHVL6bSzxuCTwd"
 *               type: "video"
 *               title: "Behind the scenes"
 *               description: "Exclusive backstage content for subscribers"
 *               fileUrl: "https://res.cloudinary.com/.../video.mp4"
 *     responses:
 *       200:
 *         description: Contenu exclusif créé avec succès
 *       400:
 *         description: Requête invalide (champs manquants)
 *       403:
 *         description: Accès refusé (non artiste)
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /exclusive-content/getById/{id}:
 *   get:
 *     tags:
 *       - ExclusiveContent
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer un contenu exclusif par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du contenu exclusif
 *     responses:
 *       200:
 *         description: Contenu exclusif trouvé
 *       404:
 *         description: Contenu non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /exclusive-content/getAll:
 *   get:
 *     tags:
 *       - ExclusiveContent
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer tous les contenus exclusifs (admin/debug)
 *     responses:
 *       200:
 *         description: Liste des contenus exclusifs
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /exclusive-content/getByArtist/{artistId}:
 *   get:
 *     tags:
 *       - ExclusiveContent
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer tous les contenus exclusifs d’un artiste
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste
 *     responses:
 *       200:
 *         description: Liste des contenus exclusifs de l'artiste
 *       404:
 *         description: Artiste non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /exclusive-content/{id}:
 *   put:
 *     tags:
 *       - ExclusiveContent
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour un contenu exclusif
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du contenu à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               fileUrl:
 *                 type: string
 *             example:
 *               type: "music"
 *               title: "Exclusive Demo Track"
 *               description: "Demo version only for subscribers"
 *               fileUrl: "https://res.cloudinary.com/.../audio.mp3"
 *     responses:
 *       200:
 *         description: Contenu mis à jour avec succès
 *       404:
 *         description: Contenu non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /exclusive-content/{id}:
 *   delete:
 *     tags:
 *       - ExclusiveContent
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un contenu exclusif
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du contenu à supprimer
 *     responses:
 *       200:
 *         description: Contenu supprimé avec succès
 *       404:
 *         description: Contenu non trouvé
 *       500:
 *         description: Erreur serveur
 */

exclusiveContentRoute.post(
  "/create",
  AuthMiddleware,
  ExclusiveContentController.Create
);

exclusiveContentRoute.get(
  "/getById/:id",
  AuthMiddleware,
  ExclusiveContentController.FindById
);

exclusiveContentRoute.get(
  "/getAll",
  AuthMiddleware,
  ExclusiveContentController.FindAll
);

exclusiveContentRoute.get(
  "/getByArtist/:artistId",
  AuthMiddleware,
  ExclusiveContentController.FindByArtistId
);

exclusiveContentRoute.put(
  "/:id",
  AuthMiddleware,
  ExclusiveContentController.Update
);

exclusiveContentRoute.delete(
  "/:id",
  AuthMiddleware,
  ExclusiveContentController.Delete
);

export default exclusiveContentRoute;
