"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const trackPlaylistRoute = (0, express_1.Router)();
/**
 * @swagger
 * /trackPlaylist/create/{playlistId}/{trackId}:
 *   post:
 *     tags:
 *       - TrackPlaylist
 *     summary: Ajouter un morceau à une playlist
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la playlist
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du morceau
 *     responses:
 *       200:
 *         description: TrackPlaylist créé avec succès
 *       400:
 *         description: Erreur de création
 *       404:
 *         description: Playlist ou track non trouvé
 */
trackPlaylistRoute.post("/create/:playlistId/:trackId", controllers_1.TrackPlaylistController.createTrackPlaylist);
/**
 * @swagger
 * /trackPlaylist/byId/{id}:
 *   get:
 *     tags:
 *       - TrackPlaylist
 *     summary: Récupérer un TrackPlaylist par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du TrackPlaylist
 *     responses:
 *       200:
 *         description: TrackPlaylist trouvé
 *       400:
 *         description: Erreur ou TrackPlaylist non trouvé
 */
trackPlaylistRoute.get("/byId/:id", controllers_1.TrackPlaylistController.FindTrackPlaylistById);
/**
 * @swagger
 * /trackPlaylist/byTrack/{trackId}:
 *   get:
 *     tags:
 *       - TrackPlaylist
 *     summary: Récupérer un TrackPlaylist par ID de morceau
 *     parameters:
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: TrackPlaylist trouvé
 *       400:
 *         description: Erreur
 */
trackPlaylistRoute.get("/byTrack/:trackId", controllers_1.TrackPlaylistController.FindTrackPlaylistByTrackId);
/**
 * @swagger
 * /trackPlaylist/byPlaylist/{playlistId}:
 *   get:
 *     tags:
 *       - TrackPlaylist
 *     summary: Récupérer un TrackPlaylist par ID de playlist
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: TrackPlaylist trouvé
 *       400:
 *         description: Erreur
 */
trackPlaylistRoute.get("/byPlaylist/:playlistId", controllers_1.TrackPlaylistController.FindTrackPlaylistByPlaylistId);
/**
 * @swagger
 * /trackPlaylist/{playlistId}/{trackId}:
 *   get:
 *     tags:
 *       - TrackPlaylist
 *     summary: Récupérer une relation TrackPlaylist par trackId et playlistId
 *     parameters:
 *       - in: path
 *         name: playlistId
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
 *         description: TrackPlaylist trouvé
 *       400:
 *         description: Erreur
 */
trackPlaylistRoute.get("/:playlistId/:trackId", controllers_1.TrackPlaylistController.FindTrackPlaylistByTrackIdAndPlaylistId);
/**
 * @swagger
 * /trackPlaylist/{id}:
 *   put:
 *     tags:
 *       - TrackPlaylist
 *     summary: Mettre à jour une relation TrackPlaylist
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
 *               trackId:
 *                 type: string
 *               playlistId:
 *                 type: string
 *             example:
 *               trackId: "abc123"
 *               playlistId: "xyz456"
 *     responses:
 *       200:
 *         description: TrackPlaylist mis à jour
 *       400:
 *         description: Mauvaise requête ou doublon
 *       404:
 *         description: TrackPlaylist, playlist ou track introuvable
 */
trackPlaylistRoute.put("/:id", controllers_1.TrackPlaylistController.UpdateTrackPlaylist);
/**
 * @swagger
 * /trackPlaylist/{id}:
 *   delete:
 *     tags:
 *       - TrackPlaylist
 *     summary: Supprimer une relation TrackPlaylist
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: TrackPlaylist supprimé
 *       404:
 *         description: TrackPlaylist non trouvé
 */
trackPlaylistRoute.delete("/:id", controllers_1.TrackPlaylistController.DeleteTrackPlaylist);
exports.default = trackPlaylistRoute;
