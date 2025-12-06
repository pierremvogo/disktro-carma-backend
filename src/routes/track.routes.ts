import { Router } from "express";
import { TrackController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";

const trackRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Track
 *     description: Gestion des morceaux (tracks)
 */

/**
 * @swagger
 * /track/create:
 *   post:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Créer un nouveau track
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre du morceau
 *               userId:
 *                 type: string
 *                 description: ID de l'utilisateur (artiste)
 *               type:
 *                 type: string
 *                 description: Type de track (single, album, ep, etc.)
 *               moodId:
 *                 type: string
 *                 description: ID du mood associé au morceau
 *               duration:
 *                 type: integer
 *                 description: Durée du morceau en secondes
 *               audioUrl:
 *                 type: string
 *                 description: URL du fichier audio du morceau
 *               lyrics:
 *                 type: string
 *                 description: Paroles du morceau
 *               signLanguageVideoUrl:
 *                 type: string
 *                 description: URL de la vidéo en langue des signes associée au morceau
 *               brailleFileUrl:
 *                 type: string
 *                 description: URL du fichier braille (BRF/BRL/TXT) pour les paroles
 *             required:
 *               - title
 *               - type
 *               - moodId
 *               - duration
 *               - audioUrl
 *             example:
 *               title: "Bohemian Rhapsody"
 *               userId: "C0m6h8YnIZl-V8L1uw-Wo"
 *               type: "single"
 *               moodId: "C0m6h8YnIZl-V8L1uw-Wo"
 *               duration: 354
 *               audioUrl: "http://www.apimusic.com/audio.mp3"
 *               lyrics: "Is this the real life? Is this just fantasy?..."
 *               signLanguageVideoUrl: "http://www.apimusic.com/lsf-video.mp4"
 *               brailleFileUrl: "http://www.apimusic.com/lyrics.brf"
 *     responses:
 *       200:
 *         description: Track créé avec succès
 *       400:
 *         description: Requête invalide
 *       409:
 *         description: Un track avec ce titre existe déjà
 */

/**
 * @swagger
 * /track/getById/{id}:
 *   get:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer un track par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du track
 *     responses:
 *       200:
 *         description: Track trouvé
 *       400:
 *         description: Aucun track trouvé avec cet ID
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /track/getAll:
 *   get:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer la liste de tous les tracks
 *     responses:
 *       200:
 *         description: Liste des tracks récupérée avec succès
 *       400:
 *         description: Aucun track trouvé
 *       500:
 *         description: Erreur serveur lors de la récupération des tracks
 */

/**
 * @swagger
 * /track/getByRelease/{releaseId}:
 *   get:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les morceaux associés à une release
 *     parameters:
 *       - in: path
 *         name: releaseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la release
 *     responses:
 *       200:
 *         description: Liste des tracks de la release
 *       400:
 *         description: Aucun track trouvé pour cette release
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /track/getByAlbum/{albumId}:
 *   get:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les morceaux associés à un album
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'album
 *     responses:
 *       200:
 *         description: Liste des tracks de l'album
 *       400:
 *         description: Aucun track trouvé pour cet album
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /track/getByUser/{userId}:
 *   get:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les morceaux associés à un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des tracks de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /track/{id}:
 *   put:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour un track existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du track à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               duration:
 *                 type: integer
 *               audioUrl:
 *                 type: string
 *               type:
 *                 type: string
 *               moodId:
 *                 type: string
 *               userId:
 *                 type: string
 *               lyrics:
 *                 type: string
 *               signLanguageVideoUrl:
 *                 type: string
 *               brailleFileUrl:
 *                 type: string
 *             example:
 *               title: "Bohemian Rhapsody - Remastered"
 *               slug: "bohemian-rhapsody-remastered"
 *               duration: 360
 *               audioUrl: "http://www.apimusic.com/audio-remastered.mp3"
 *               type: "single"
 *               moodId: "C0m6h8YnIZl-V8L1uw-Wo"
 *               userId: "C0m6h8YnIZl-V8L1uw-Wo"
 *               lyrics: "Is this the real life? Is this just fantasy? (Remastered)"
 *               signLanguageVideoUrl: "http://www.apimusic.com/lsf-video-remastered.mp4"
 *               brailleFileUrl: "http://www.apimusic.com/lyrics-remastered.brf"
 *     responses:
 *       200:
 *         description: Track mis à jour avec succès
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Track non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /track/{id}:
 *   delete:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un track par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du track à supprimer
 *     responses:
 *       200:
 *         description: Track supprimé avec succès
 *       404:
 *         description: Track non trouvé
 *       500:
 *         description: Erreur serveur
 */

trackRoute.post("/create", AuthMiddleware, TrackController.Create);
trackRoute.get("/getById/:id", AuthMiddleware, TrackController.FindTrackById);
trackRoute.get("/getAll", AuthMiddleware, TrackController.FindAllTrack);
trackRoute.get(
  "/getByRelease/:releaseId",
  AuthMiddleware,
  TrackController.FindTracksByReleaseId
);
trackRoute.get(
  "/getByAlbum/:albumId",
  AuthMiddleware,
  TrackController.FindTracksByAlbumId
);
trackRoute.get(
  "/getByUser/:userId",
  AuthMiddleware,
  TrackController.FindTrackByUserId
);
trackRoute.put("/:id", AuthMiddleware, TrackController.UpdateTrack);
trackRoute.delete("/:id", AuthMiddleware, TrackController.DeleteTrack);

export default trackRoute;
