"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const singleTagRoute = (0, express_1.Router)();
/**
 * @swagger
 * /singleTag/create/{tagId}/{singleId}:
 *   post:
 *     tags:
 *       - SingleTag
 *     summary: Créer une nouvelle association tag-single
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *       - in: path
 *         name: singleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'single
 *     responses:
 *       201:
 *         description: Association créée avec succès
 *       400:
 *         description: Erreur de création
 */
/**
 * @swagger
 * /singleTag/get/{tagId}/{singleId}:
 *   get:
 *     tags:
 *       - SingleTag
 *     summary: Récupérer une association tag-single par leurs IDs
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *       - in: path
 *         name: singleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'single
 *     responses:
 *       200:
 *         description: Association trouvée
 *       404:
 *         description: Association non trouvée
 */
/**
 * @swagger
 * /singleTag/get/singleId/{singleId}:
 *   get:
 *     tags:
 *       - SingleTag
 *     summary: Récupérer les associations pour un single donné
 *     parameters:
 *       - in: path
 *         name: singleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'single
 *     responses:
 *       200:
 *         description: Associations trouvées
 *       404:
 *         description: Aucune association trouvée
 */
/**
 * @swagger
 * /singleTag/get/tagId/{tagId}:
 *   get:
 *     tags:
 *       - SingleTag
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
 * /singleTag/get/id/{id}:
 *   get:
 *     tags:
 *       - SingleTag
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
// Create new singleTag
singleTagRoute.post("/create/:tagId/:singleId", controllers_1.SingleTagController.createSingleTag);
// Retrieve singleTag by singleId and TagId
singleTagRoute.get("/get/:tagId/:singleId", controllers_1.SingleTagController.FindSingleTagBySingleIdAndTagId);
// Retrieve singleTag by singleId
singleTagRoute.get("/get/singleId", controllers_1.SingleTagController.FindSingleTagBySingleId);
// Retrieve singleTag by tagId
singleTagRoute.get("/get/tagId", controllers_1.SingleTagController.FindSingleTagByTagId);
// Retrieve singleTag by Id
singleTagRoute.get("/get/id", controllers_1.SingleTagController.FindSingleTagById);
exports.default = singleTagRoute;
