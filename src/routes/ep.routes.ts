import { Router } from "express";
import { EpController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";
const epRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Ep
 *     description: Gestion des eps musicaux
 */

/**
 * @swagger
 * /ep/create:
 *   post:
 *     tags:
 *       - Ep
 *     security:
 *       - bearerAuth: []
 *     summary: Créer un nouvel ep
 *     requestBody:
 *       description: Données de l'ep à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Id de l'utilisateur
 *               title:
 *                 type: string
 *                 description: Titre de l'ep
 *               duration:
 *                 type: string
 *                 description: Durée de l'ep
 *               coverUrl:
 *                 type: string
 *                 description: Image de couverture de l'ep
 *             example:
 *               userId: "d_TcX58D962256ER"
 *               title: "Nouvel ep"
 *               duration: "15"
 *               coverUrl: "https://mon-site/cover.png"
 *     responses:
 *       201:
 *         description: Ep créé avec succès
 *       400:
 *         description: Erreur lors de la création de l'ep
 */

/**
 * @swagger
 * /ep/getById/{id}:
 *   get:
 *     tags:
 *       - Ep
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer un ep par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'ep
 *     responses:
 *       200:
 *         description: Ep trouvé
 *       404:
 *         description: Ep non trouvé
 */

/**
 * @swagger
 * /ep/getAll:
 *   get:
 *     tags:
 *       - Ep
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer la liste de tous les eps
 *     responses:
 *       200:
 *         description: Liste des eps récupérée avec succès
 *       500:
 *         description: Erreur serveur lors de la récupération des eps
 */

/**
 * @swagger
 * /ep/getByUser/{userId}:
 *   get:
 *     tags:
 *       - Ep
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer tous les eps d'un artiste par son ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste
 *     responses:
 *       200:
 *         description: Liste des eps trouvés
 *       404:
 *         description: Aucun ep trouvé pour cet artiste
 */

/**
 * @swagger
 * /ep/{id}:
 *   put:
 *     tags:
 *       - Ep
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour un ep
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'ep à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre de l'ep
 *               duration:
 *                 type: string
 *                 description: Durée de l'ep
 *               coverUrl:
 *                 type: string
 *                 description: Image de couverture de l'ep
 *             example:
 *               title: "Nouvel ep"
 *               duration: "15"
 *               coverUrl: "https://mon-site/cover.png"
 *     responses:
 *       200:
 *         description: Ep mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 releaseDate:
 *                   type: string
 *                   format: date
 *                 artistId:
 *                   type: string
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Ep non trouvé
 */

/**
 * @swagger
 * /ep/{id}:
 *   delete:
 *     tags:
 *       - Ep
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un ep
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'ep à supprimer
 *     responses:
 *       200:
 *         description: Ep supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ep supprimé avec succès"
 *       404:
 *         description: Ep non trouvé
 */

epRoute.post("/create", AuthMiddleware, EpController.create);
epRoute.get("/getById/:id", AuthMiddleware, EpController.FindEpById);
epRoute.get("/getAll", AuthMiddleware, EpController.FindAllEps);
epRoute.get("/getByUser/:userId", AuthMiddleware, EpController.FindEpsByUserId);
epRoute.put("/:id", AuthMiddleware, EpController.UpdateEp);
epRoute.delete("/:id", AuthMiddleware, EpController.DeleteEp);

export default epRoute;
