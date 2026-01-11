"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const albumArtistRoute = (0, express_1.Router)();
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
 * /albumArtist/get/{artistId}:
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
 * /albumArtist/get/{albumId}:
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
 * /albumArtist/get/{id}:
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
albumArtistRoute.post("/create/:artistId/:albumId", controllers_1.AlbumArtistController.createAlbumArtist);
// Retrieve albumArtist by artistId and albumId
albumArtistRoute.get("/get/:artistId/:albumId", controllers_1.AlbumArtistController.FindAlbumArtistByArtistIdAndAlbumId);
// Retrieve albumArtist by artistId
albumArtistRoute.get("/get/:artistId", controllers_1.AlbumArtistController.FindAlbumArtistByArtistId);
// Retrieve albumArtist by albumId
albumArtistRoute.get("/get/:albumId", controllers_1.AlbumArtistController.FindAlbumArtistByAlbumId);
// Retrieve albumArtist by id
albumArtistRoute.get("/get/:id", controllers_1.AlbumArtistController.FindAlbumArtistById);
exports.default = albumArtistRoute;
