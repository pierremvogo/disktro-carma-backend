import { Router } from "express";
import { EditorPlaylistController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";

const editorPlaylistRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: EditorPlaylist
 *     description: Playlists éditoriales (curation)
 */

/**
 * @swagger
 * /editorPlaylist/getAll:
 *   get:
 *     tags:
 *       - EditorPlaylist
 *     security:
 *       - bearerAuth: []
 *     summary: "Récupérer les playlists éditoriales publiées"
 *     parameters:
 *       - in: query
 *         name: locale
 *         required: false
 *         schema:
 *           type: string
 *         description: "Langue/locale (ex: en, es, ca)"
 *         example: "en"
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Nombre maximum de playlists retournées"
 *         example: 20
 *     responses:
 *       200:
 *         description: "Liste des playlists éditoriales"
 *       500:
 *         description: "Erreur serveur"
 */
editorPlaylistRoute.get(
  "/getAll",
  AuthMiddleware,
  EditorPlaylistController.GetAllPublished
);

/**
 * @swagger
 * /editorPlaylist/getById/{id}:
 *   get:
 *     tags:
 *       - EditorPlaylist
 *     security:
 *       - bearerAuth: []
 *     summary: "Récupérer une playlist éditoriale par ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Playlist éditoriale"
 *       404:
 *         description: "Not found"
 *       500:
 *         description: "Erreur serveur"
 */
editorPlaylistRoute.get(
  "/getById/:id",
  AuthMiddleware,
  EditorPlaylistController.GetById
);

/**
 * @swagger
 * /editorPlaylist/create:
 *   post:
 *     tags:
 *       - EditorPlaylist
 *     security:
 *       - bearerAuth: []
 *     summary: "Créer une playlist éditoriale (admin)"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               coverUrl:
 *                 type: string
 *               locale:
 *                 type: string
 *               priority:
 *                 type: integer
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: "Playlist créée"
 *       400:
 *         description: "Requête invalide"
 *       500:
 *         description: "Erreur serveur"
 */
editorPlaylistRoute.post(
  "/create",
  AuthMiddleware,
  EditorPlaylistController.Create
);

/**
 * @swagger
 * /editorPlaylist/{id}/addTrack/{trackId}:
 *   post:
 *     tags:
 *       - EditorPlaylist
 *     security:
 *       - bearerAuth: []
 *     summary: "Ajouter un track à une playlist éditoriale (admin)"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               position:
 *                 type: integer
 *     responses:
 *       201:
 *         description: "Track ajouté"
 *       500:
 *         description: "Erreur serveur"
 */
editorPlaylistRoute.post(
  "/:id/addTrack/:trackId",
  AuthMiddleware,
  EditorPlaylistController.AddTrack
);

/**
 * @swagger
 * /editorPlaylist/{id}/publish:
 *   post:
 *     tags:
 *       - EditorPlaylist
 *     security:
 *       - bearerAuth: []
 *     summary: "Publier une playlist éditoriale (admin)"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Playlist publiée"
 *       500:
 *         description: "Erreur serveur"
 */
editorPlaylistRoute.post(
  "/:id/publish",
  AuthMiddleware,
  EditorPlaylistController.Publish
);

export default editorPlaylistRoute;
