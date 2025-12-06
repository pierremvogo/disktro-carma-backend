import { Router } from "express";
import { EpController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";

const epRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Ep
 *     description: Gestion des EPs musicaux
 */

/**
 * @swagger
 * /ep/create:
 *   post:
 *     tags:
 *       - Ep
 *     security:
 *       - bearerAuth: []
 *     summary: Créer un nouvel EP
 *     requestBody:
 *       description: Données de l'EP à créer
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
 *                 description: Titre de l'EP
 *               duration:
 *                 type: integer
 *                 format: int32
 *                 description: Durée totale de l'EP en secondes
 *               coverUrl:
 *                 type: string
 *                 description: URL de l'image de couverture de l'EP
 *               authors:
 *                 type: string
 *                 description: Auteurs / compositeurs principaux de l'EP
 *               producers:
 *                 type: string
 *                 description: Producteurs de l'EP
 *               lyricists:
 *                 type: string
 *                 description: Paroliers de l'EP
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
 *               title: "Nouvel EP"
 *               duration: 900
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
 *         description: EP créé avec succès
 *       400:
 *         description: Erreur lors de la création de l'EP
 *       409:
 *         description: Un EP avec ce titre existe déjà
 */

/**
 * @swagger
 * /ep/getById/{id}:
 *   get:
 *     tags:
 *       - Ep
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer un EP par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'EP
 *     responses:
 *       200:
 *         description: EP trouvé
 *       400:
 *         description: Aucun EP trouvé avec cet ID
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /ep/getAll:
 *   get:
 *     tags:
 *       - Ep
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer la liste de tous les EPs
 *     responses:
 *       200:
 *         description: Liste des EPs récupérée avec succès
 *       400:
 *         description: Aucun EP trouvé
 *       500:
 *         description: Erreur serveur lors de la récupération des EPs
 */

/**
 * @swagger
 * /ep/getByUser/{userId}:
 *   get:
 *     tags:
 *       - Ep
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer tous les EPs d'un artiste par son ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste (user)
 *     responses:
 *       200:
 *         description: Liste des EPs trouvés pour cet artiste
 *       404:
 *         description: Artiste introuvable
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /ep/{id}:
 *   put:
 *     tags:
 *       - Ep
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour un EP
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'EP à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre de l'EP
 *               duration:
 *                 type: integer
 *                 format: int32
 *                 description: Durée totale de l'EP en secondes
 *               coverUrl:
 *                 type: string
 *                 description: URL de l'image de couverture de l'EP
 *               authors:
 *                 type: string
 *                 description: Auteurs / compositeurs principaux de l'EP
 *               producers:
 *                 type: string
 *                 description: Producteurs de l'EP
 *               lyricists:
 *                 type: string
 *                 description: Paroliers de l'EP
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
 *               title: "EP mis à jour"
 *               duration: 1200
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
 *         description: EP mis à jour avec succès
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: EP non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /ep/{id}:
 *   delete:
 *     tags:
 *       - Ep
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un EP
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'EP à supprimer
 *     responses:
 *       200:
 *         description: EP supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "EP supprimé avec succès"
 *       404:
 *         description: EP non trouvé
 *       500:
 *         description: Erreur serveur
 */

epRoute.post("/create", AuthMiddleware, EpController.create);
epRoute.get("/getById/:id", AuthMiddleware, EpController.FindEpById);
epRoute.get("/getAll", AuthMiddleware, EpController.FindAllEps);
epRoute.get("/getByUser/:userId", AuthMiddleware, EpController.FindEpsByUserId);
epRoute.put("/:id", AuthMiddleware, EpController.UpdateEp);
epRoute.delete("/:id", AuthMiddleware, EpController.DeleteEp);

export default epRoute;
