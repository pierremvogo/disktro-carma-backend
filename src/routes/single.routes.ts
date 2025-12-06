import { Router } from "express";
import { SingleController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";

const singleRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Single
 *     description: Gestion des singles musicaux
 */

/**
 * @swagger
 * /single/create:
 *   post:
 *     tags:
 *       - Single
 *     security:
 *       - bearerAuth: []
 *     summary: Créer un nouveau single
 *     requestBody:
 *       description: Données du single à créer
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
 *                 description: Titre du single
 *               duration:
 *                 type: integer
 *                 format: int32
 *                 description: Durée du single en secondes
 *               coverUrl:
 *                 type: string
 *                 description: URL de l'image de couverture du single
 *               audioUrl:
 *                 type: string
 *                 description: URL du fichier audio du single
 *               authors:
 *                 type: string
 *                 description: Auteurs / compositeurs du single
 *               producers:
 *                 type: string
 *                 description: Producteurs du single
 *               lyricists:
 *                 type: string
 *                 description: Paroliers du single
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
 *               title: "Nouvel single"
 *               duration: 215
 *               coverUrl: "https://mon-site/cover.png"
 *               audioUrl: "https://mon-site/audio.mp3"
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
 *         description: Single créé avec succès
 *       400:
 *         description: Erreur lors de la création du single
 *       409:
 *         description: Un single avec ce titre existe déjà
 */

/**
 * @swagger
 * /single/getById/{id}:
 *   get:
 *     tags:
 *       - Single
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer un single par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du single
 *     responses:
 *       200:
 *         description: Single trouvé
 *       400:
 *         description: Aucun single trouvé avec cet ID
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /single/getAll:
 *   get:
 *     tags:
 *       - Single
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer la liste de tous les singles
 *     responses:
 *       200:
 *         description: Liste des singles récupérée avec succès
 *       400:
 *         description: Aucun single trouvé
 *       500:
 *         description: Erreur serveur lors de la récupération des singles
 */

/**
 * @swagger
 * /single/getByUser/{userId}:
 *   get:
 *     tags:
 *       - Single
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer tous les singles d'un artiste par son ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste (user)
 *     responses:
 *       200:
 *         description: Liste des singles trouvés pour cet artiste
 *       404:
 *         description: Artiste introuvable
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /single/{id}:
 *   put:
 *     tags:
 *       - Single
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour un single
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du single à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre du single
 *               duration:
 *                 type: integer
 *                 format: int32
 *                 description: Durée du single en secondes
 *               coverUrl:
 *                 type: string
 *                 description: URL de l'image de couverture du single
 *               audioUrl:
 *                 type: string
 *                 description: URL du fichier audio du single
 *               authors:
 *                 type: string
 *                 description: Auteurs / compositeurs du single
 *               producers:
 *                 type: string
 *                 description: Producteurs du single
 *               lyricists:
 *                 type: string
 *                 description: Paroliers du single
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
 *               title: "Single mis à jour"
 *               duration: 200
 *               coverUrl: "https://mon-site/cover-updated.png"
 *               audioUrl: "https://mon-site/audio-updated.mp3"
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
 *         description: Single mis à jour avec succès
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Single non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /single/{id}:
 *   delete:
 *     tags:
 *       - Single
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un single
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du single à supprimer
 *     responses:
 *       200:
 *         description: Single supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Single supprimé avec succès"
 *       404:
 *         description: Single non trouvé
 *       500:
 *         description: Erreur serveur
 */

singleRoute.post("/create", AuthMiddleware, SingleController.create);
singleRoute.get(
  "/getById/:id",
  AuthMiddleware,
  SingleController.FindSingleById
);
singleRoute.get("/getAll", AuthMiddleware, SingleController.FindAllSingles);
singleRoute.get(
  "/getByUser/:userId",
  AuthMiddleware,
  SingleController.FindSinglesByUserId
);
singleRoute.put("/:id", AuthMiddleware, SingleController.UpdateSingle);
singleRoute.delete("/:id", AuthMiddleware, SingleController.DeleteSingle);

export default singleRoute;
