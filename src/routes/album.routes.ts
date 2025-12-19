import { Router } from "express";
import { AlbumController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";

const albumRoute = Router();

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
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Id de l'utilisateur (artiste)
 *               title:
 *                 type: string
 *                 description: Titre de l'album
 *               duration:
 *                 type: integer
 *                 format: int32
 *                 description: Durée totale de l'album en secondes
 *               coverUrl:
 *                 type: string
 *                 description: URL de l'image de couverture de l'album
 *               authors:
 *                 type: string
 *                 description: Auteurs / compositeurs principaux de l'album
 *               producers:
 *                 type: string
 *                 description: Producteurs de l'album
 *               lyricists:
 *                 type: string
 *                 description: Paroliers de l'album
 *               musiciansVocals:
 *                 type: string
 *                 description: Interprètes / voix (vocals)
 *               musiciansPianoKeyboards:
 *                 type: string
 *                 description: Musiciens aux claviers / piano
 *               musiciansWinds:
 *                 type: string
 *                 description: Musiciens instruments à vent
 *               musiciansPercussion:
 *                 type: string
 *                 description: Musiciens percussion
 *               musiciansStrings:
 *                 type: string
 *                 description: Musiciens instruments à cordes
 *               mixingEngineer:
 *                 type: string
 *                 description: Ingénieur du son (mixage)
 *               masteringEngineer:
 *                 type: string
 *                 description: Ingénieur du son (mastering)
 *             example:
 *               userId: "d_TcX58D962256ER"
 *               title: "Nouvel album"
 *               duration: 3600
 *               coverUrl: "https://mon-site/cover.png"
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
 *     responses:
 *       200:
 *         description: Album créé avec succès
 *       400:
 *         description: Erreur lors de la création de l'album
 *       409:
 *         description: Un album avec ce titre existe déjà
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
 *         description: ID de l'album à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre de l'album
 *               duration:
 *                 type: integer
 *                 format: int32
 *                 description: Durée de l'album en secondes
 *               coverUrl:
 *                 type: string
 *                 description: URL de l'image de couverture de l'album
 *               authors:
 *                 type: string
 *                 description: Auteurs / compositeurs principaux de l'album
 *               producers:
 *                 type: string
 *                 description: Producteurs de l'album
 *               lyricists:
 *                 type: string
 *                 description: Paroliers de l'album
 *               musiciansVocals:
 *                 type: string
 *                 description: Interprètes / voix (vocals)
 *               musiciansPianoKeyboards:
 *                 type: string
 *                 description: Musiciens aux claviers / piano
 *               musiciansWinds:
 *                 type: string
 *                 description: Musiciens instruments à vent
 *               musiciansPercussion:
 *                 type: string
 *                 description: Musiciens percussion
 *               musiciansStrings:
 *                 type: string
 *                 description: Musiciens instruments à cordes
 *               mixingEngineer:
 *                 type: string
 *                 description: Ingénieur du son (mixage)
 *               masteringEngineer:
 *                 type: string
 *                 description: Ingénieur du son (mastering)
 *             example:
 *               title: "Album mis à jour"
 *               duration: 4200
 *               coverUrl: "https://mon-site/cover-updated.png"
 *               authors: "John Doe"
 *               producers: "Beatmaker X"
 *               lyricists: "John Doe"
 *               musiciansVocals: "Jane Doe"
 *               musiciansPianoKeyboards: "Pianiste Y"
 *               musiciansWinds: "Saxophoniste Z"
 *               musiciansPercussion: "Drummer K"
 *               musiciansStrings: "Guitariste L"
 *               mixingEngineer: "Mix Engineer M"
 *               masteringEngineer: "Mastering Engineer N"
 *     responses:
 *       200:
 *         description: Album mis à jour avec succès
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Album non trouvé
 *       500:
 *         description: Erreur serveur
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

albumRoute.post("/create", AuthMiddleware, AlbumController.create);
albumRoute.get("/getById/:id", AuthMiddleware, AlbumController.FindAlbumById);
albumRoute.get("/getAll", AuthMiddleware, AlbumController.FindAllAlbums);
albumRoute.get(
  "/getByUser/:userId",
  AuthMiddleware,
  AlbumController.FindAlbumsByUserId
);
albumRoute.put("/:id", AlbumController.UpdateAlbum);
albumRoute.delete("/:id", AuthMiddleware, AlbumController.DeleteAlbum);

export default albumRoute;
