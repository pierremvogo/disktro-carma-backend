"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_middleware_1 = require("../middleware/auth.middleware");
const suggestionRoute = (0, express_1.Router)();
/**
 * @swagger
 * /suggestion/create:
 *   post:
 *     tags:
 *       - Suggestion
 *     security:
 *       - bearerAuth: []
 *     summary: Créer une nouvelle suggestion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               song:
 *                 type: string
 *             required:
 *               - email
 *               - song
 *             example:
 *               email: "user@example.com"
 *               song: "Chill Song Title"
 *     responses:
 *       200:
 *         description: Suggestion créée avec succès
 *       409:
 *         description: Une suggestion avec cet email existe déjà
 */
suggestionRoute.post("/create", auth_middleware_1.AuthMiddleware, controllers_1.SuggestionController.Create);
/**
 * @swagger
 * /suggestion/getAll:
 *   get:
 *     tags:
 *       - Suggestion
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer toutes les suggestions
 *     responses:
 *       200:
 *         description: Liste des suggestions récupérée avec succès
 *       400:
 *         description: Aucune suggestion trouvée
 */
suggestionRoute.get("/getAll", auth_middleware_1.AuthMiddleware, controllers_1.SuggestionController.FindAllSuggestions);
/**
 * @swagger
 * /suggestion/getById/{id}:
 *   get:
 *     tags:
 *       - Suggestion
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer une suggestion par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la suggestion
 *     responses:
 *       200:
 *         description: Suggestion trouvée
 *       400:
 *         description: Requête invalide ou suggestion non trouvée
 */
suggestionRoute.get("/getById/:id", auth_middleware_1.AuthMiddleware, controllers_1.SuggestionController.FindSuggestionById);
/**
 * @swagger
 * /suggestion/{id}:
 *   put:
 *     tags:
 *       - Suggestion
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour une suggestion
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la suggestion à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               song:
 *                 type: string
 *             required:
 *               - song
 *             example:
 *               song: "Updated Song Title"
 *     responses:
 *       200:
 *         description: Suggestion mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Suggestion non trouvée
 */
suggestionRoute.put("/:id", auth_middleware_1.AuthMiddleware, controllers_1.SuggestionController.UpdateSuggestion);
/**
 * @swagger
 * /suggestion/{id}:
 *   delete:
 *     tags:
 *       - Suggestion
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer une suggestion
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la suggestion à supprimer
 *     responses:
 *       200:
 *         description: Suggestion supprimée avec succès
 *       404:
 *         description: Suggestion non trouvée
 */
suggestionRoute.delete("/:id", controllers_1.SuggestionController.DeleteSuggestion);
exports.default = suggestionRoute;
