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
 *                 description: Mot de passe (sera hashé côté serveur)
 *                 default: "string123."
 *               type:
 *                 type: string
 *                 enum: [fan, artist, admin]
 *                 description: Type d'utilisateur
 *                 default: "artist"
 *               artistName:
 *                 type: string
 *                 description: Nom d'artiste (pour les artistes)
 *                 default: "Artist Name"
 *               genre:
 *                 type: string
 *                 description: Genre musical ou type de contenu
 *                 default: "pop"
 *               bio:
 *                 type: string
 *                 description: Biographie de l'utilisateur
 *                 default: "Une courte biographie..."
 *               profileImageUrl:
 *                 type: string
 *                 description: URL de l'image de profil uploadée
 *                 default: "https://example.com/profile-image.png"
 *               videoIntroUrl:
 *                 type: string
 *                 description: URL de la vidéo de présentation de l'utilisateur
 *                 default: "https://example.com/intro-video.mp4"
 *               miniVideoLoopUrl:
 *                 type: string
 *                 description: URL d'une mini vidéo en boucle (teaser, loop)
 *                 default: "https://example.com/mini-loop.mp4"
 *               isSubscribed:
 *                 type: boolean
 *                 description: Indique si l'utilisateur est abonné (newsletter, services, etc.)
 *                 default: false
 *               twoFactorEnabled:
 *                 type: boolean
 *                 description: Indique si la double authentification est activée
 *                 default: false
 *             required:
 *               - name
 *               - surname
 *               - email
 *               - password
 *               - type
 *     responses:
 *       200:
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
 *               type:
 *                 type: string
 *                 enum: [fan, artist, admin]
 *                 default: "artist"
 *               artistName:
 *                 type: string
 *                 description: Nom d'artiste (surtout pour les artistes)
 *                 default: "Artist Name"
 *               genre:
 *                 type: string
 *                 description: Genre musical ou type de contenu
 *                 default: "pop"
 *               bio:
 *                 type: string
 *                 description: Biographie de l'utilisateur
 *                 default: "Une courte biographie mise à jour..."
 *               profileImageUrl:
 *                 type: string
 *                 description: URL de l'image de profil uploadée
 *                 default: "https://example.com/profile-image.png"
 *               videoIntroUrl:
 *                 type: string
 *                 description: URL de la vidéo de présentation de l'utilisateur
 *                 default: "https://example.com/intro-video.mp4"
 *               miniVideoLoopUrl:
 *                 type: string
 *                 description: URL d'une mini vidéo en boucle (teaser, loop)
 *                 default: "https://example.com/mini-loop.mp4"
 *               isSubscribed:
 *                 type: boolean
 *                 description: Indique si l'utilisateur est abonné (newsletter, services, etc.)
 *                 default: true
 *               twoFactorEnabled:
 *                 type: boolean
 *                 description: Indique si la double authentification est activée
 *                 default: false
 *               emailVerified:
 *                 type: boolean
 *                 description: Indique si l'email est vérifié
 *                 default: true
 *               oldPassword:
 *                 type: string
 *                 description: Ancien mot de passe (requis si newPassword est fourni)
 *               newPassword:
 *                 type: string
 *                 description: Nouveau mot de passe (optionnel, nécessite oldPassword)
 *             example:
 *               name: "John"
 *               surname: "Doe"
 *               username: "johndoe123"
 *               email: "john.doe@example.com"
 *               type: "artist"
 *               artistName: "Artist Name"
 *               genre: "pop"
 *               bio: "Une courte biographie mise à jour..."
 *               profileImageUrl: "https://example.com/profile-image.png"
 *               videoIntroUrl: "https://example.com/intro.mp4"
 *               miniVideoLoopUrl: "https://example.com/mini-loop.mp4"
 *               isSubscribed: true
 *               twoFactorEnabled: false
 *               emailVerified: true
 *               oldPassword: "ancienMotDePasse123."
 *               newPassword: "nouveauMotDePasse456."
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
 *
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
