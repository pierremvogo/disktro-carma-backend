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
 *               isrcCode:
 *                 type: string
 *                 description: Code ISRC unique du morceau
 *               slug:
 *                 type: string
 *                 description: Slug unique du morceau
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
 *                 type: number
 *                 description: Durée du morceau en secondes
 *               audioUrl:
 *                 type: string
 *                 description: URL du fichier audio du morceau
 *               audioFileName:
 *                 type: string
 *                 description: Nom du fichier audio uploadé
 *               lyrics:
 *                 type: string
 *                 description: Paroles du morceau
 *               signLanguageVideoUrl:
 *                 type: string
 *                 description: URL de la vidéo en langue des signes associée au morceau
 *               signLanguageFileName:
 *                 type: string
 *                 description: Nom du fichier vidéo en langue des signes
 *               brailleFileUrl:
 *                 type: string
 *                 description: URL du fichier braille (BRF/BRL/TXT)
 *               brailleFileName:
 *                 type: string
 *                 description: Nom du fichier braille
 *             required:
 *               - isrcCode
 *               - slug
 *               - type
 *               - moodId
 *               - audioUrl
 *             example:
 *               isrcCode: "FR-Z03-24-00001"
 *               slug: "bohemian-rhapsody"
 *               title: "Bohemian Rhapsody"
 *               userId: "C0m6h8YnIZl-V8L1uw-Wo"
 *               type: "single"
 *               moodId: "C0m6h8YnIZl-V8L1uw-Wo"
 *               duration: 354
 *               audioUrl: "http://www.apimusic.com/audio.mp3"
 *               audioFileName: "audio.mp3"
 *               lyrics: "Is this the real life? Is this just fantasy?..."
 *               signLanguageVideoUrl: "http://www.apimusic.com/lsf-video.mp4"
 *               signLanguageFileName: "lsf-video.mp4"
 *               brailleFileUrl: "http://www.apimusic.com/lyrics.brf"
 *               brailleFileName: "lyrics.brf"
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isrcCode:
 *                 type: string
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               duration:
 *                 type: number
 *               audioUrl:
 *                 type: string
 *               audioFileName:
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
 *               signLanguageFileName:
 *                 type: string
 *               brailleFileUrl:
 *                 type: string
 *               brailleFileName:
 *                 type: string
 *             example:
 *               isrcCode: "FR-Z03-24-00001"
 *               title: "Bohemian Rhapsody - Remastered"
 *               slug: "bohemian-rhapsody-remastered"
 *               duration: 360
 *               audioUrl: "http://www.apimusic.com/audio-remastered.mp3"
 *               audioFileName: "audio-remastered.mp3"
 *               lyrics: "Is this the real life? (Remastered)"
 *               signLanguageVideoUrl: "http://www.apimusic.com/lsf-video-remastered.mp4"
 *               signLanguageFileName: "lsf-video-remastered.mp4"
 *               brailleFileUrl: "http://www.apimusic.com/lyrics-remastered.brf"
 *               brailleFileName: "lyrics-remastered.brf"
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

/**
 * @swagger
 * /track/getByMoodName:
 *   get:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les tracks par nom de mood
 *     description: "Retourne la liste des tracks associés à un mood (recherche par nom)."
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: "Nom du mood (ex: happy, sad, chill)"
 *         example: happy
 *     responses:
 *       200:
 *         description: Liste des tracks correspondant au mood
 *       400:
 *         description: Paramètre name manquant
 *       404:
 *         description: Mood introuvable
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /track/getByGenreName:
 *   get:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les tracks par nom de genre (stratégie 1)
 *     description: |
 *       Filtre basé sur le genre associé aux artistes (un artiste peut avoir plusieurs genres).
 *       Logique: genre -> artist_genres -> artists -> (albums/releases) -> tracks.
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: "Nom du genre (ex: pop, rock, hip hop)"
 *         example: pop
 *     responses:
 *       200:
 *         description: Liste des tracks correspondant au genre
 *       400:
 *         description: Paramètre name manquant
 *       404:
 *         description: Genre introuvable
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /track/getByArtist/{artistId}:
 *   get:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer tous les tracks d'un artiste (stratégie 1)
 *     description: |
 *       Retourne tous les tracks de l'artiste même si le track est lié à un album/EP/single.
 *       Logique: artiste -> albums/releases -> trackAlbums/trackReleases -> tracks.
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste (userId)
 *         example: C0m6h8YnIZl-V8L1uw-Wo
 *     responses:
 *       200:
 *         description: Liste des tracks de l'artiste
 *       404:
 *         description: Artiste introuvable
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /track/topStreams:
 *   get:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les tracks les plus streamés (Featured)
 *     description: |
 *       Retourne la liste des tracks les plus streamés sur la plateforme.
 *       Les résultats sont enrichis avec les informations nécessaires à l’affichage Featured :
 *       - nombre total de streams
 *       - artiste
 *       - cover du single, EP ou album auquel appartient le track
 *       - type de collection (single, ep ou album)
 *       - id de la collection pour charger la playlist complète dans le player
 *
 *       Logique :
 *       trackStreams -> COUNT(streams)
 *       + jointures vers singles / eps / albums
 *       + priorité de cover : single > ep > album
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Nombre maximum de tracks retournés"
 *         example: 6
 *     responses:
 *       200:
 *         description: Liste des tracks les plus streamés (Featured)
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /track/newReleases:
 *   get:
 *     tags:
 *       - Track
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les nouveaux morceaux (New Releases)
 *     description: |
 *       Retourne la liste des tracks les plus récents (triés par createdAt DESC).
 *       Les résultats sont enrichis avec :
 *       - artiste
 *       - cover du single/EP/album auquel appartient le track
 *       - collectionType + collectionId (pour charger la bonne queue dans le player)
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Nombre maximum de tracks retournés"
 *         example: 12
 *     responses:
 *       200:
 *         description: Liste des nouveaux tracks (New Releases)
 *       500:
 *         description: Erreur serveur
 */

trackRoute.post("/create", AuthMiddleware, TrackController.Create);
trackRoute.get("/getById/:id", AuthMiddleware, TrackController.FindTrackById);
trackRoute.get("/getAll", AuthMiddleware, TrackController.FindAllTrack);
trackRoute.get(
  "/getByMoodName",
  AuthMiddleware,
  TrackController.FindTracksByMoodName
);

trackRoute.get(
  "/getByGenreName",
  AuthMiddleware,
  TrackController.FindTracksByGenreName
);

trackRoute.get(
  "/topStreams",
  AuthMiddleware,
  TrackController.FindTopStreamedTracksFeatured
);
trackRoute.get("/newReleases", AuthMiddleware, TrackController.FindNewReleases);

trackRoute.get(
  "/getByArtist/:artistId",
  AuthMiddleware,
  TrackController.FindTracksByArtistId
);
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
trackRoute.put("/:id", TrackController.UpdateTrack);
trackRoute.delete("/:id", TrackController.DeleteTrack);

export default trackRoute;
