"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_middleware_1 = require("../middleware/auth.middleware");
const userTagRoute = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   - name: UserTag
 *     description: Gestion des associations user-tag (genres via tags)
 */
/**
 * @swagger
 * /userTag/create/{tagId}/{userId}:
 *   post:
 *     tags:
 *       - UserTag
 *     security:
 *       - bearerAuth: []
 *     summary: "Créer une nouvelle association user-tag"
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID du tag"
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID du user (artist)"
 *     responses:
 *       200:
 *         description: "Association créée avec succès"
 *       400:
 *         description: "Erreur de création"
 *       401:
 *         description: "Non autorisé"
 *       409:
 *         description: "Association déjà existante"
 */
/**
 * @swagger
 * /userTag/get/{tagId}/{userId}:
 *   get:
 *     tags:
 *       - UserTag
 *     summary: "Récupérer une association user-tag par leurs IDs"
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID du tag"
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID du user"
 *     responses:
 *       200:
 *         description: "Association trouvée"
 *       401:
 *         description: "Non autorisé"
 *       404:
 *         description: "Association non trouvée"
 */
/**
 * @swagger
 * /userTag/get/userId/{userId}:
 *   get:
 *     tags:
 *       - UserTag
 *     summary: "Récupérer toutes les associations pour un user donné"
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID du user"
 *     responses:
 *       200:
 *         description: "Associations trouvées"
 *       401:
 *         description: "Non autorisé"
 *       404:
 *         description: "Aucune association trouvée"
 */
/**
 * @swagger
 * /userTag/get/tagId/{tagId}:
 *   get:
 *     tags:
 *       - UserTag
 *     summary: "Récupérer toutes les associations pour un tag donné"
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID du tag"
 *     responses:
 *       200:
 *         description: "Associations trouvées"
 *       401:
 *         description: "Non autorisé"
 *       404:
 *         description: "Aucune association trouvée"
 */
/**
 * @swagger
 * /userTag/get/id/{id}:
 *   get:
 *     tags:
 *       - UserTag
 *     summary: "Récupérer une association user-tag par son ID"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID de l'association"
 *     responses:
 *       200:
 *         description: "Association trouvée"
 *       401:
 *         description: "Non autorisé"
 *       404:
 *         description: "Association non trouvée"
 */
/**
 * @swagger
 * /userTag/delete/{userId}/{tagId}:
 *   delete:
 *     tags:
 *       - UserTag
 *     summary: "Supprimer une association user-tag"
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID du user"
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID du tag"
 *     responses:
 *       200:
 *         description: "Association supprimée avec succès"
 *       401:
 *         description: "Non autorisé"
 *       404:
 *         description: "Association non trouvée"
 */
// Create new userTag
userTagRoute.post("/create/:tagId/:userId", auth_middleware_1.AuthMiddleware, controllers_1.UserTagController.create);
// Retrieve userTag by userId and tagId
userTagRoute.get("/get/:tagId/:userId", controllers_1.UserTagController.FindUserTagByUserIdAndTagId);
// Retrieve userTags by userId
userTagRoute.get("/get/userId/:userId", controllers_1.UserTagController.FindUserTagsByUserId);
// Retrieve userTags by tagId
userTagRoute.get("/get/tagId/:tagId", controllers_1.UserTagController.FindUserTagsByTagId);
// Retrieve userTag by Id
userTagRoute.get("/get/id/:id", controllers_1.UserTagController.FindUserTagById);
// Delete userTag (userId + tagId)
userTagRoute.delete("/delete/:userId/:tagId", controllers_1.UserTagController.DeleteUserTagByUserIdAndTagId);
exports.default = userTagRoute;
