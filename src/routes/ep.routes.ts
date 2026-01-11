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
 *             properties:
 *               userId:
 *                 type: string
 *               title:
 *                 type: string
 *               duration:
 *                 type: integer
 *               coverUrl:
 *                 type: string
 *                 description: URL de l'image de couverture
 *               coverFileName:
 *                 type: string
 *                 description: Nom du fichier image de couverture
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
 *               title: "Nouvel EP"
 *               duration: 900
 *               coverUrl: "https://cdn.site/cover.png"
 *               coverFileName: "cover.png"
 *               authors: "John Doe"
 *               producers: "Beatmaker X"
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
 *               title: "EP mis à jour"
 *               coverUrl: "https://cdn.site/cover-new.png"
 *               coverFileName: "cover-new.png"
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
epRoute.put("/:id", EpController.UpdateEp);
epRoute.delete("/:id", EpController.DeleteEp);

export default epRoute;
