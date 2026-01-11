"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const epTagRoute = (0, express_1.Router)();
/**
 * @swagger
 * /epTag/create/{tagId}/{epId}:
 *   post:
 *     tags:
 *       - EpTag
 *     summary: Créer une nouvelle association tag-ep
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *       - in: path
 *         name: epId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'ep
 *     responses:
 *       201:
 *         description: Association créée avec succès
 *       400:
 *         description: Erreur de création
 */
/**
 * @swagger
 * /epTag/get/{tagId}/{epId}:
 *   get:
 *     tags:
 *       - EpTag
 *     summary: Récupérer une association tag-ep par leurs IDs
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *       - in: path
 *         name: epId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'ep
 *     responses:
 *       200:
 *         description: Association trouvée
 *       404:
 *         description: Association non trouvée
 */
/**
 * @swagger
 * /epTag/get/epId/{epId}:
 *   get:
 *     tags:
 *       - EpTag
 *     summary: Récupérer les associations pour un ep donné
 *     parameters:
 *       - in: path
 *         name: epId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'ep
 *     responses:
 *       200:
 *         description: Associations trouvées
 *       404:
 *         description: Aucune association trouvée
 */
/**
 * @swagger
 * /epTag/get/tagId/{tagId}:
 *   get:
 *     tags:
 *       - EpTag
 *     summary: Récupérer les associations pour un tag donné
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *     responses:
 *       200:
 *         description: Associations trouvées
 *       404:
 *         description: Aucune association trouvée
 */
/**
 * @swagger
 * /epTag/get/id/{id}:
 *   get:
 *     tags:
 *       - EpTag
 *     summary: Récupérer une association par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'association
 *     responses:
 *       200:
 *         description: Association trouvée
 *       404:
 *         description: Association non trouvée
 */
// Create new epTag
epTagRoute.post("/create/:tagId/:epId", controllers_1.EpTagController.createEpTag);
// Retrieve epTag by epId and TagId
epTagRoute.get("/get/:tagId/:epId", controllers_1.EpTagController.FindEpTagByEpIdAndTagId);
// Retrieve epTag by epId
epTagRoute.get("/get/epId", controllers_1.EpTagController.FindEpTagByEpId);
// Retrieve epTag by tagId
epTagRoute.get("/get/tagId", controllers_1.EpTagController.FindEpTagByTagId);
// Retrieve epTag by Id
epTagRoute.get("/get/id", controllers_1.EpTagController.FindEpTagById);
exports.default = epTagRoute;
