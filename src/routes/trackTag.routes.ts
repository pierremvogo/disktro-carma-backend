import { Router } from 'express';
import { TrackTagController } from '../controllers';
const trackTagRoute = Router();
/**
 * @swagger
 * /api/trackTags/create/{tagId}/{trackId}:
 *   post:
 *     summary: Créer une association tag + track
 *     tags:
 *       - TrackTags
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du morceau
 *     responses:
 *       201:
 *         description: TrackTag créé avec succès
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/trackTags/getByTagAndTrack/{tagId}/{trackId}:
 *   get:
 *     summary: Récupérer un trackTag par tagId et trackId
 *     tags:
 *       - TrackTags
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du morceau
 *     responses:
 *       200:
 *         description: TrackTag trouvé
 *       404:
 *         description: TrackTag non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/trackTags/getByTrack/{trackId}:
 *   get:
 *     summary: Récupérer les trackTags par trackId
 *     tags:
 *       - TrackTags
 *     parameters:
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du morceau
 *     responses:
 *       200:
 *         description: Liste des trackTags pour ce track
 *       404:
 *         description: Aucun trackTag trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/trackTags/getByTag/{tagId}:
 *   get:
 *     summary: Récupérer les trackTags par tagId
 *     tags:
 *       - TrackTags
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *     responses:
 *       200:
 *         description: Liste des trackTags pour ce tag
 *       404:
 *         description: Aucun trackTag trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/trackTags/getById/{id}:
 *   get:
 *     summary: Récupérer un trackTag par son ID
 *     tags:
 *       - TrackTags
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du trackTag
 *     responses:
 *       200:
 *         description: TrackTag trouvé
 *       404:
 *         description: TrackTag non trouvé
 *       500:
 *         description: Erreur serveur
 */

// Create new trackTag
trackTagRoute.post(
  '/create/:tagId/:trackId',
  TrackTagController.createTrackTag
);

// Retrieve trackTag by trackId and tagId
trackTagRoute.get(
  '/getByTagAndTrack/:tagId/:trackId',
  TrackTagController.FindTrackTagByTrackIdAndTagId
);

// Retrieve trackTag by trackId
trackTagRoute.get(
  '/getByTrackId/:trackId',
  TrackTagController.FindTrackTagByTrackId
);

// Retrieve trackTag by tagId
trackTagRoute.get('/getByTagId/:tagId', TrackTagController.FindTrackTagByTagId);

// Retrieve trackTag by id
trackTagRoute.get('/getById/:id', TrackTagController.FindTrackTagById);

export default trackTagRoute;
