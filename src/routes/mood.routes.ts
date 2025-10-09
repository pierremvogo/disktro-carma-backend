import { Router } from "express";
import { MoodController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";

const moodRoute = Router();

/**
 * @swagger
 * /mood/create:
 *   post:
 *     tags:
 *       - Mood
 *     security:
 *       - bearerAuth: []
 *     summary: Créer un nouveau mood
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *             example:
 *               name: "Chill"
 *     responses:
 *       200:
 *         description: Mood créé avec succès
 *       400:
 *         description: Erreur lors de la création
 *       409:
 *         description: Le mood existe déjà
 */
moodRoute.post("/create", AuthMiddleware, MoodController.Create);

/**
 * @swagger
 * /mood/getAll:
 *   get:
 *     tags:
 *       - Mood
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer tous les moods
 *     responses:
 *       200:
 *         description: Liste des moods récupérée
 *       400:
 *         description: Aucun mood trouvé
 */
moodRoute.get("/getAll", AuthMiddleware, MoodController.FindAllMoods);

/**
 * @swagger
 * /mood/getById/{id}:
 *   get:
 *     tags:
 *       - Mood
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer un mood par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du mood
 *     responses:
 *       200:
 *         description: Mood trouvé
 *       400:
 *         description: Erreur ou mood non trouvé
 */
moodRoute.get("/getById/:id", AuthMiddleware, MoodController.FindMoodById);

/**
 * @swagger
 * /mood/{id}:
 *   put:
 *     tags:
 *       - Mood
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour un mood
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du mood à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: "Relax"
 *     responses:
 *       200:
 *         description: Mood mis à jour avec succès
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Mood non trouvé
 */
moodRoute.put("/:id", AuthMiddleware, MoodController.UpdateMood);

/**
 * @swagger
 * /mood/{id}:
 *   delete:
 *     tags:
 *       - Mood
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un mood
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du mood à supprimer
 *     responses:
 *       200:
 *         description: Mood supprimé avec succès
 *       404:
 *         description: Mood non trouvé
 */
moodRoute.delete("/:id", AuthMiddleware, MoodController.DeleteMood);

export default moodRoute;
