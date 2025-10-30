import { Router } from "express";
import { UserController } from "../controllers";
import { EmailMiddleware } from "../middleware/email.middleware";
const usersRoute = Router();

/**
 * @swagger
 * /users/create:
 *   post:
 *     tags:
 *       - Users
 *     summary: Créer un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 default: "string002"
 *               email:
 *                 type: string
 *                 default: "vaviko7587@dlbazi.com"
 *               password:
 *                 type: string
 *                 default: "string123."
 *               type:
 *                 type: string
 *                 default: "artist"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 */
usersRoute.post("/create", EmailMiddleware, UserController.CreateUser);

/**
 * @swagger
 * /users/getAll:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer tous les utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
usersRoute.get("/getAll", UserController.FindAllUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer un utilisateur par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         default: "kJoMn0ED_G8ztiLXZUFE7"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 */
usersRoute.get("/:id", UserController.FindUserById);

/**
 * @swagger
 * /users/getByEmail/{email}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer un utilisateur par email
 *     parameters:
 *       - in: path
 *         name: email
 *         default: "vaviko7587@dlbazi.com"
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 */
usersRoute.get("/getByEmail/:email", UserController.FindUserByEmail);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Mettre à jour un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         default: "kJoMn0ED_G8ztiLXZUFE7"
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                type: string
 *                default: "string002"
 *               email:
 *                 type: string
 *                 format: email
 *                 default: "vaviko7587@dlbazi.com"
 *               type:
 *                 type: string
 *                 default: "artist"
 *               profileImageUrl:
 *                 type: string
 *                 default: "125698-image001.png"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Utilisateur non trouvé
 */
usersRoute.put("/:id", UserController.UpdateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Supprimer un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         default: "kJoMn0ED_G8ztiLXZUFE7"
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */
usersRoute.delete("/:id", UserController.DeleteUser);

export default usersRoute;
