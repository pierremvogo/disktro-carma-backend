"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const trackReleaseRoute = (0, express_1.Router)();
/**
 * @swagger
 * /trackRelease/create/{releaseId}/{trackId}:
 *   post:
 *     tags:
 *       - TrackRelease
 *     summary: Associer un releasee à un track
 *     parameters:
 *       - in: path
 *         name: releaseId
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
 *         description: Association créée
 *       400:
 *         description: Erreur de création
 */
trackReleaseRoute.post("/create/:releaseId/:trackId", controllers_1.TrackReleaseController.createTrackRelease);
/**
 * @swagger
 * /trackRelease/get/{releaseId}/{trackId}:
 *   get:
 *     tags:
 *       - TrackRelease
 *     summary: Récupérer une association releasee-track par leurs IDs
 *     parameters:
 *       - in: path
 *         name: releaseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Association trouvée
 *       404:
 *         description: Non trouvé
 */
trackReleaseRoute.get("/get/:releaseId/:trackId", controllers_1.TrackReleaseController.FindTrackReleaseByTrackIdAndReleaseId);
/**
 * @swagger
 * /trackRelease/getByRelease/{releaseId}:
 *   get:
 *     tags:
 *       - TrackRelease
 *     summary: Récupérer les associations pour une release donné
 *     parameters:
 *       - in: path
 *         name: releaseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Associations trouvées
 *       404:
 *         description: Aucune association trouvée
 */
trackReleaseRoute.get("/getByRelease/:releaseId", controllers_1.TrackReleaseController.FindTrackReleaseByReleaseId);
/**
 * @swagger
 * /trackRelease/getByTrack/{trackId}:
 *   get:
 *     tags:
 *       - TrackRelease
 *     summary: Récupérer les associations pour un track donné
 *     parameters:
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Associations trouvées
 *       404:
 *         description: Aucune association trouvée
 */
trackReleaseRoute.get("/getByTrack/:trackId", controllers_1.TrackReleaseController.FindTrackReleaseByTrackId);
/**
 * @swagger
 * /trackRelease/getById/{id}:
 *   get:
 *     tags:
 *       - TrackRelease
 *     summary: Récupérer une association par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Association trouvée
 *       404:
 *         description: Non trouvée
 */
trackReleaseRoute.get("/getById/:id", controllers_1.TrackReleaseController.FindTrackReleaseById);
exports.default = trackReleaseRoute;
