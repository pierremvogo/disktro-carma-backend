"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_middleware_1 = require("../middleware/auth.middleware");
const playlistRoute = (0, express_1.Router)();
/**
 * @swagger
 * /playlist/create:
 *   post:
 *     tags:
 *       - Playlist
 *     security:
 *       - bearerAuth: []
 *     summary: Créer une nouvelle playlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               userId:
 *                 type: string
 *             required:
 *               - name
 *               - userId
 *             example:
 *               name: "Chill Vibes"
 *               userId: "user-123"
 *     responses:
 *       200:
 *         description: Playlist créée avec succès
 *       409:
 *         description: Playlist avec ce nom existe déjà
 */
playlistRoute.post("/create", auth_middleware_1.AuthMiddleware, controllers_1.PlayListController.Create);
/**
 * @swagger
 * /playlist/getAll:
 *   get:
 *     tags:
 *       - Playlist
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer toutes les playlists
 *     responses:
 *       200:
 *         description: Liste des playlists récupérée avec succès
 *       400:
 *         description: Erreur lors de la récupération des playlists
 */
playlistRoute.get("/getAll", auth_middleware_1.AuthMiddleware, controllers_1.PlayListController.FindAllPlayLists);
/**
 * @swagger
 * /playlist/getById/{id}:
 *   get:
 *     tags:
 *       - Playlist
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer une playlist par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la playlist
 *     responses:
 *       200:
 *         description: Playlist trouvée
 *       400:
 *         description: Requête invalide ou playlist non trouvée
 */
playlistRoute.get("/getById/:id", auth_middleware_1.AuthMiddleware, controllers_1.PlayListController.FindPlayListById);
/**
 * @swagger
 * /playlist/getByUser/{userId}:
 *   get:
 *     tags:
 *       - Playlist
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les playlists d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Playlists de l'utilisateur récupérées
 *       404:
 *         description: Aucune playlist trouvée pour cet utilisateur
 */
playlistRoute.get("/getByUser/:userId", auth_middleware_1.AuthMiddleware, controllers_1.PlayListController.FindPlaylistsByUserId);
/**
 * @swagger
 * /playlist/getBySlug/{slug}:
 *   get:
 *     tags:
 *       - Playlist
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer une playlist par son slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug de la playlist
 *     responses:
 *       200:
 *         description: Playlist trouvée
 *       404:
 *         description: Playlist non trouvée
 */
playlistRoute.get("/getBySlug/:slug", auth_middleware_1.AuthMiddleware, controllers_1.PlayListController.FindPlayListBySlug);
/**
 * @swagger
 * /playlist/{id}:
 *   put:
 *     tags:
 *       - Playlist
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour une playlist
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la playlist à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *             required:
 *               - nom
 *             example:
 *               nom: "Updated Playlist Name"
 *     responses:
 *       200:
 *         description: Playlist mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Playlist non trouvée
 */
playlistRoute.put("/:id", auth_middleware_1.AuthMiddleware, controllers_1.PlayListController.UpdatePlayList);
/**
 * @swagger
 * /playlist/{id}:
 *   delete:
 *     tags:
 *       - Playlist
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer une playlist
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la playlist à supprimer
 *     responses:
 *       200:
 *         description: Playlist supprimée avec succès
 *       404:
 *         description: Playlist non trouvée
 */
playlistRoute.delete("/:id", controllers_1.PlayListController.DeletePlayList);
exports.default = playlistRoute;
