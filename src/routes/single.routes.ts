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
 *     summary: Créer un nouvel single
 *     requestBody:
 *       description: Données de l'single à créer
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
 *                 description: Titre de l'single
 *               duration:
 *                 type: string
 *                 description: Durée de l'single
 *               coverUrl:
 *                 type: string
 *                 description: Image de couverture de l'single
 *             example:
 *               userId: "d_TcX58D962256ER"
 *               title: "Nouvel single"
 *               duration: "15"
 *               coverUrl: "https://mon-site/cover.png"
 *     responses:
 *       201:
 *         description: Single créé avec succès
 *       400:
 *         description: Erreur lors de la création de l'single
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
 *         description: ID de l'single
 *     responses:
 *       200:
 *         description: Single trouvé
 *       404:
 *         description: Single non trouvé
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
 *         description: ID de l'artiste
 *     responses:
 *       200:
 *         description: Liste des singles trouvés
 *       404:
 *         description: Aucun single trouvé pour cet artiste
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
 *         description: ID de l'single à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre de l'single
 *               duration:
 *                 type: string
 *                 description: Durée de l'single
 *               coverUrl:
 *                 type: string
 *                 description: Image de couverture de l'single
 *             example:
 *               title: "Nouvel single"
 *               duration: "15"
 *               coverUrl: "https://mon-site/cover.png"
 *     responses:
 *       200:
 *         description: Single mis à jour avec succès
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
 *         description: Single non trouvé
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
 *         description: ID de l'single à supprimer
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
