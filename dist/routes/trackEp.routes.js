"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const trackEpRoute = (0, express_1.Router)();
/**
 * @swagger
 * /trackEp/create/{epId}/{trackId}:
 *   post:
 *     tags:
 *       - TrackEp
 *     summary: Associer un track à un ep
 *     parameters:
 *       - in: path
 *         name: epId
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
trackEpRoute.post("/create/:epId/:trackId", controllers_1.TrackEpController.createTrackEp);
/**
 * @swagger
 * /trackEp/get/byEp/{epId}/byTrack/{trackId}:
 *   get:
 *     tags:
 *       - TrackEp
 *     summary: Récupérer une association ep-track par leurs IDs
 *     parameters:
 *       - in: path
 *         name: epId
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
 *         description: Non trouvée
 */
trackEpRoute.get("/get/byEp/:epId/byTrack/:trackId", controllers_1.TrackEpController.FindTrackEpByTrackIdAndEpId);
/**
 * @swagger
 * /trackEp/get/byTrack/{trackId}:
 *   get:
 *     tags:
 *       - TrackEp
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
trackEpRoute.get("/get/byTrack/:trackId", controllers_1.TrackEpController.FindTrackEpByTrackId);
/**
 * @swagger
 * /trackEp/get/byEp/{epId}:
 *   get:
 *     tags:
 *       - TrackEp
 *     summary: Récupérer les associations pour un ep donné
 *     parameters:
 *       - in: path
 *         name: epId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Associations trouvées
 *       404:
 *         description: Aucune association trouvée
 */
trackEpRoute.get("/get/byEp/:epId", controllers_1.TrackEpController.FindTrackEpByEpId);
/**
 * @swagger
 * /trackEp/get/{id}:
 *   get:
 *     tags:
 *       - TrackEp
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
trackEpRoute.get("/get/:id", controllers_1.TrackEpController.FindTrackEpById);
exports.default = trackEpRoute;
