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
 *                 default: "John"
 *               surname:
 *                 type: string
 *                 default: "Doe"
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur (principalement pour les fans)
 *                 default: "johndoe123"
 *               email:
 *                 type: string
 *                 format: email
 *                 default: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 default: "string123."
 *               type:
 *                 type: string
 *                 enum: [fan, artist]
 *                 default: "artist"
 *               artistName:
 *                 type: string
 *                 description: Nom d'artiste (surtout pour les artistes)
 *                 default: "Artist Name"
 *               realName:
 *                 type: string
 *                 description: Nom réel de l'utilisateur
 *                 default: "Real Name"
 *               genre:
 *                 type: string
 *                 description: Genre musical ou genre de contenu
 *                 default: "pop"
 *               bio:
 *                 type: string
 *                 description: Biographie de l'utilisateur
 *                 default: "Une courte biographie..."
 *               emailVerified:
 *                 type: boolean
 *                 description: Indique si l'email est vérifié
 *                 default: false
 *               twoFactorEnabled:
 *                 type: boolean
 *                 description: Indique si la double authentification est activée
 *                 default: false
 *               profileImageUrl:
 *                 type: string
 *                 description: URL de l'image de profil uploadée
 *                 default: "https://example.com/profile-image.png"
 *             required:
 *               - email
 *               - password
 *               - type
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
 *         default: "john.doe@example.com"
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
 *                 type: string
 *                 default: "John"
 *               surname:
 *                 type: string
 *                 default: "Doe"
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur (principalement pour les fans)
 *                 default: "johndoe123"
 *               email:
 *                 type: string
 *                 format: email
 *                 default: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur (optionnel en mise à jour)
 *                 default: "string123."
 *               type:
 *                 type: string
 *                 enum: [fan, artist]
 *                 default: "artist"
 *               artistName:
 *                 type: string
 *                 description: Nom d'artiste (surtout pour les artistes)
 *                 default: "Artist Name"
 *               realName:
 *                 type: string
 *                 description: Nom réel de l'utilisateur
 *                 default: "Real Name"
 *               genre:
 *                 type: string
 *                 description: Genre musical ou genre de contenu
 *                 default: "pop"
 *               bio:
 *                 type: string
 *                 description: Biographie de l'utilisateur
 *                 default: "Une courte biographie mise à jour..."
 *               emailVerified:
 *                 type: boolean
 *                 description: Indique si l'email est vérifié
 *                 default: true
 *               twoFactorEnabled:
 *                 type: boolean
 *                 description: Indique si la double authentification est activée
 *                 default: false
 *               profileImageUrl:
 *                 type: string
 *                 description: URL de l'image de profil uploadée
 *                 default: "https://example.com/profile-image.png"
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
