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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - title
 *               - coverUrl
 *               - coverFileName
 *               - audioUrl
 *               - audioFileName
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Id de l'utilisateur (artiste)
 *               title:
 *                 type: string
 *               duration:
 *                 type: integer
 *                 format: int32
 *               coverUrl:
 *                 type: string
 *                 description: URL de l'image de couverture
 *               coverFileName:
 *                 type: string
 *                 description: Nom du fichier image de couverture
 *               audioUrl:
 *                 type: string
 *                 description: URL du fichier audio
 *               audioFileName:
 *                 type: string
 *                 description: Nom du fichier audio uploadé
 *               authors:
 *                 type: string
 *               producers:
 *                 type: string
 *               lyricists:
 *                 type: string
 *               musiciansVocals:
 *                 type: string
 *               musiciansPianoKeyboards:
 *                 type: string
 *               musiciansWinds:
 *                 type: string
 *               musiciansPercussion:
 *                 type: string
 *               musiciansStrings:
 *                 type: string
 *               mixingEngineer:
 *                 type: string
 *               masteringEngineer:
 *                 type: string
 *             example:
 *               userId: "d_TcX58D962256ER"
 *               title: "Nouveau single"
 *               duration: 215
 *               coverUrl: "https://cdn.site/cover.png"
 *               coverFileName: "cover.png"
 *               audioUrl: "https://cdn.site/audio.mp3"
 *               audioFileName: "audio.mp3"
 *               authors: "John Doe"
 *               producers: "Beatmaker X"
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               duration:
 *                 type: integer
 *               coverUrl:
 *                 type: string
 *               coverFileName:
 *                 type: string
 *                 description: Nom du fichier image de couverture
 *               audioUrl:
 *                 type: string
 *               audioFileName:
 *                 type: string
 *                 description: Nom du fichier audio
 *               authors:
 *                 type: string
 *               producers:
 *                 type: string
 *               lyricists:
 *                 type: string
 *               musiciansVocals:
 *                 type: string
 *               musiciansPianoKeyboards:
 *                 type: string
 *               musiciansWinds:
 *                 type: string
 *               musiciansPercussion:
 *                 type: string
 *               musiciansStrings:
 *                 type: string
 *               mixingEngineer:
 *                 type: string
 *               masteringEngineer:
 *                 type: string
 *             example:
 *               title: "Single mis à jour"
 *               coverUrl: "https://cdn.site/cover-new.png"
 *               coverFileName: "cover-new.png"
 *               audioUrl: "https://cdn.site/audio-new.mp3"
 *               audioFileName: "audio-new.mp3"
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
singleRoute.put("/:id", SingleController.UpdateSingle);
singleRoute.delete("/:id", SingleController.DeleteSingle);

export default singleRoute;
