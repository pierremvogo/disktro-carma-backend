import { Router } from "express";
import { TesterController } from "../controllers/tester.controller";

const testersRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Testers
 *     description: Gestion des utilisateurs inscrits au questionnaire / groupe de tests
 */

/**
 * @swagger
 * /testers/create:
 *   post:
 *     tags:
 *       - Testers
 *     summary: Créer une nouvelle entrée de testeur (réponse au questionnaire)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               ageRange:
 *                 type: string
 *                 enum: ["-18", "-22", "-30", "-50", "+50"]
 *                 example: "-30"
 *               language:
 *                 type: string
 *                 enum: ["english", "spanish", "catalan"]
 *                 example: "english"
 *             required:
 *               - name
 *               - email
 *               - ageRange
 *               - language
 *     responses:
 *       201:
 *         description: Testeur créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
testersRoute.post("/create", TesterController.CreateTester);

/**
 * @swagger
 * /testers/getAll:
 *   get:
 *     tags:
 *       - Testers
 *     summary: Récupérer toutes les entrées de testeurs
 *     responses:
 *       200:
 *         description: Liste des testeurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       ageRange:
 *                         type: string
 *                       language:
 *                         type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur serveur
 */
testersRoute.get("/getAll", TesterController.FindAllTesters);

/**
 * @swagger
 * /testers/{id}:
 *   get:
 *     tags:
 *       - Testers
 *     summary: Récupérer un testeur par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du testeur à récupérer
 *     responses:
 *       200:
 *         description: Testeur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     ageRange:
 *                       type: string
 *                     language:
 *                       type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Testeur non trouvé
 *       500:
 *         description: Erreur serveur
 */
testersRoute.get("/:id", TesterController.FindTesterById);

/**
 * @swagger
 * /testers/{id}:
 *   delete:
 *     tags:
 *       - Testers
 *     summary: Supprimer un testeur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du testeur à supprimer
 *     responses:
 *       200:
 *         description: Testeur supprimé avec succès
 *       404:
 *         description: Testeur non trouvé
 *       500:
 *         description: Erreur serveur
 */
testersRoute.delete("/:id", TesterController.DeleteTester);

export default testersRoute;
