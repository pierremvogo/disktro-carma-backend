"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const trackStreamRoute = (0, express_1.Router)();
/**
 * @swagger
 * /streams/create/{userId}/{trackId}:
 *   post:
 *     tags:
 *       - TrackStream
 *     summary: Créer un stream pour un track et un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Stream créé
 *       400:
 *         description: Erreur de création
 */
trackStreamRoute.post("/create/:userId/:trackId", controllers_1.TrackStreamsController.createTrackStream);
/**
 * @swagger
 * /streams/get/byTrack/{trackId}:
 *   get:
 *     tags:
 *       - TrackStream
 *     summary: Récupérer les streams pour un track donné
 *     parameters:
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Streams trouvés
 *       404:
 *         description: Aucun stream trouvé
 */
trackStreamRoute.get("/get/byTrack/:trackId", controllers_1.TrackStreamsController.findTrackStreamsByTrackId);
/**
 * @swagger
 * /streams/get/byUser/{userId}:
 *   get:
 *     tags:
 *       - TrackStream
 *     summary: Récupérer les streams pour un utilisateur donné
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Streams trouvés
 *       404:
 *         description: Aucun stream trouvé
 */
trackStreamRoute.get("/get/byUser/:userId", controllers_1.TrackStreamsController.findTrackStreamsByUserId);
/**
 * @swagger
 * /streams/getById/{id}:
 *   get:
 *     tags:
 *       - TrackStream
 *     summary: Récupérer un stream par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stream trouvé
 *       404:
 *         description: Non trouvé
 */
trackStreamRoute.get("/getById/:id", controllers_1.TrackStreamsController.findTrackStreamById);
/**
 * @swagger
 * /streams/getAll:
 *   get:
 *     tags:
 *       - TrackStream
 *     summary: Récupérer tous les streams enregistrés
 *     responses:
 *       200:
 *         description: Liste de tous les streams
 *       400:
 *         description: Erreur de récupération
 */
trackStreamRoute.get("/getAll", controllers_1.TrackStreamsController.findAllTrackStreams);
exports.default = trackStreamRoute;
