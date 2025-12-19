import { Router } from "express";
import { TagController } from "../controllers";
import { SlugMiddleware } from "../middleware/slug.middleware";
import { db } from "../db/db";
import { tags } from "../db/schema";
import { AuthMiddleware } from "../middleware/auth.middleware";
const tagRoute = Router();

/**
 * @swagger
 * /tag/create:
 *   post:
 *     tags:
 *       - Tag
 *     security:
 *       - bearerAuth: []
 *     summary: Créer un nouveau tag
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
 *                name: "Lo-Fi Beats"
 *     responses:
 *       201:
 *         description: Tag créé avec succès
 *       400:
 *         description: Requête invalide
 */
tagRoute.post("/create", TagController.Create);

/**
 * @swagger
 * /tag/getById/{id}:
 *   get:
 *     tags:
 *       - Tag
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer un tag par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *     responses:
 *       200:
 *         description: Tag trouvé
 *       404:
 *         description: Tag non trouvé
 */
tagRoute.get("/getById/:id", TagController.FindTagById);

/**
 * @swagger
 * /tag/getAll:
 *   get:
 *     tags:
 *       - Tag
 *     summary: Récupérer tous les tags
 *     responses:
 *       200:
 *         description: Liste des tags récupérée avec succès
 *       500:
 *         description: Erreur serveur lors de la récupération des tags
 */
tagRoute.get("/getAll", TagController.FindAllTags);

/**
 * @swagger
 * /tag/getBySlug/{slug}:
 *   get:
 *     tags:
 *       - Tag
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer un tag par son slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug du tag
 *     responses:
 *       200:
 *         description: Tag trouvé
 *       404:
 *         description: Tag non trouvé
 */
tagRoute.get("/getBySlug/:slug", TagController.FindTagBySlug);

/**
 * @swagger
 * /tag/getArtists/{tagId}:
 *   get:
 *     tags:
 *       - Tag
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les artistes associés à un tag
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *     responses:
 *       200:
 *         description: Liste des artistes associés au tag
 *       404:
 *         description: Aucun artiste trouvé pour ce tag
 */
tagRoute.get("/getArtists/:tagId", TagController.FindTagArtists);

/**
 * @swagger
 * /tag/getAlbums/{tagId}:
 *   get:
 *     tags:
 *       - Tag
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les albums associés à un tag
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag
 *     responses:
 *       200:
 *         description: Liste des albums associés au tag
 *       404:
 *         description: Aucun album trouvé pour ce tag
 */
tagRoute.get("/getAlbums/:tagId", TagController.FindTagAlbums);

/**
 * @swagger
 * /tag/{id}:
 *   put:
 *     tags:
 *       - Tag
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour un tag
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag à mettre à jour
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
 *                name: "Lo-Fi Beats"
 *     responses:
 *       200:
 *         description: Tag mis à jour avec succès
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Tag non trouvé
 */
tagRoute.put("/:id", TagController.UpdateTag);

/**
 * @swagger
 * /tag/{id}:
 *   delete:
 *     tags:
 *       - Tag
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un tag
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du tag à supprimer
 *     responses:
 *       200:
 *         description: Tag supprimé avec succès
 *       404:
 *         description: Tag non trouvé
 */
tagRoute.delete("/:id", TagController.DeleteTag);

export default tagRoute;
