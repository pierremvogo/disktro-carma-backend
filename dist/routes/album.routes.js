"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_middleware_1 = require("../middleware/auth.middleware");
const albumRoute = (0, express_1.Router)();
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
 *     security:
 *       - bearerAuth: []
 *     summary: Créer un nouvel album
 *     requestBody:
 *       description: Données de l'album à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - title
 *               - slug
 *               - coverUrl
 *               - coverFileName
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Id de l'utilisateur (artiste)
 *               title:
 *                 type: string
 *                 description: Titre de l'album
 *               slug:
 *                 type: string
 *                 description: Slug unique de l'album
 *               duration:
 *                 type: integer
 *                 format: int32
 *                 description: Durée totale de l'album en secondes
 *               coverUrl:
 *                 type: string
 *                 description: URL de l'image de couverture de l'album
 *               coverFileName:
 *                 type: string
 *                 description: Nom du fichier de la couverture (stockage)
 *               authors:
 *                 type: string
 *               producers:
 *                 type: string
 *               lyricists:
 *                 type: string
 *               musiciansVocals:
 *                 type: string
 *               musiciansPianoKeyboards:
 *                 type: string
 *               musiciansWinds:
 *                 type: string
 *               musiciansPercussion:
 *                 type: string
 *               musiciansStrings:
 *                 type: string
 *               mixingEngineer:
 *                 type: string
 *               masteringEngineer:
 *                 type: string
 *             example:
 *               userId: "d_TcX58D962256ER"
 *               title: "Nouvel album"
 *               slug: "nouvel-album"
 *               duration: 3600
 *               coverUrl: "https://mon-site/cover.png"
 *               coverFileName: "cover.png"
 *               authors: "John Doe, Jane Doe"
 *               producers: "Beatmaker X"
 *               lyricists: "John Doe"
 *               musiciansVocals: "Jane Doe"
 *               musiciansPianoKeyboards: "Pianiste Y"
 *               musiciansWinds: "Saxophoniste Z"
 *               musiciansPercussion: "Drummer K"
 *               musiciansStrings: "Guitariste L"
 *               mixingEngineer: "Mix Engineer M"
 *               masteringEngineer: "Mastering Engineer N"
 */
/**
 * @swagger
 * /album/getById/{id}:
 *   get:
 *     tags:
 *       - Album
 *     security:
 *       - bearerAuth: []
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
 *       400:
 *         description: Aucun album trouvé avec cet ID
 *       500:
 *         description: Erreur serveur
 */
/**
 * @swagger
 * /album/getAll:
 *   get:
 *     tags:
 *       - Album
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer la liste de tous les albums
 *     responses:
 *       200:
 *         description: Liste des albums récupérée avec succès
 *       400:
 *         description: Aucun album trouvé
 *       500:
 *         description: Erreur serveur lors de la récupération des albums
 */
/**
 * @swagger
 * /album/getByUser/{userId}:
 *   get:
 *     tags:
 *       - Album
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer tous les albums d'un artiste par son ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste (user)
 *     responses:
 *       200:
 *         description: Liste des albums trouvés pour cet artiste
 *       404:
 *         description: Artiste introuvable
 *       500:
 *         description: Erreur serveur
 */
/**
 * @swagger
 * /album/{id}:
 *   put:
 *     tags:
 *       - Album
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour un album
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Slug unique de l'album
 *               duration:
 *                 type: integer
 *               coverUrl:
 *                 type: string
 *               coverFileName:
 *                 type: string
 *               authors:
 *                 type: string
 *               producers:
 *                 type: string
 *               lyricists:
 *                 type: string
 *               musiciansVocals:
 *                 type: string
 *               musiciansPianoKeyboards:
 *                 type: string
 *               musiciansWinds:
 *                 type: string
 *               musiciansPercussion:
 *                 type: string
 *               musiciansStrings:
 *                 type: string
 *               mixingEngineer:
 *                 type: string
 *               masteringEngineer:
 *                 type: string
 *             example:
 *               title: "Album mis à jour"
 *               slug: "album-mis-a-jour"
 *               coverUrl: "https://mon-site/cover-updated.png"
 *               coverFileName: "cover-updated.png"
 */
/**
 * @swagger
 * /album/{id}:
 *   delete:
 *     tags:
 *       - Album
 *     security:
 *       - bearerAuth: []
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
 *       500:
 *         description: Erreur serveur
 */
albumRoute.post("/create", auth_middleware_1.AuthMiddleware, controllers_1.AlbumController.create);
albumRoute.get("/getById/:id", auth_middleware_1.AuthMiddleware, controllers_1.AlbumController.FindAlbumById);
albumRoute.get("/getAll", auth_middleware_1.AuthMiddleware, controllers_1.AlbumController.FindAllAlbums);
albumRoute.get("/getByUser/:userId", auth_middleware_1.AuthMiddleware, controllers_1.AlbumController.FindAlbumsByUserId);
albumRoute.put("/:id", controllers_1.AlbumController.UpdateAlbum);
albumRoute.delete("/:id", auth_middleware_1.AuthMiddleware, controllers_1.AlbumController.DeleteAlbum);
exports.default = albumRoute;
