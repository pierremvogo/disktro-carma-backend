"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const email_middleware_1 = require("../middleware/email.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const usersRoute = (0, express_1.Router)();
/**
 * @swagger
 * /users/create:
 *   post:
 *     tags:
 *       - Users
 *     summary: "Créer un nouvel utilisateur"
 *     description: |
 *       Crée un utilisateur (fan, artist ou admin).
 *       Si type = "artist" et que tagIds est fourni, le backend associe automatiquement
 *       l'utilisateur à plusieurs tags (genres) via la table pivot user_tags.
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
 *                 description: "Nom d'utilisateur (principalement pour les fans)"
 *                 default: "johndoe123"
 *               email:
 *                 type: string
 *                 format: email
 *                 default: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: "Mot de passe (sera hashé côté serveur)"
 *                 default: "string123."
 *               type:
 *                 type: string
 *                 enum: [fan, artist, admin]
 *                 description: "Type d'utilisateur"
 *                 default: "artist"
 *
 *               # ===== Champs artiste =====
 *               artistName:
 *                 type: string
 *                 description: "Nom d'artiste (uniquement si type=artist)"
 *                 default: "Artist Name"
 *               bio:
 *                 type: string
 *                 description: "Biographie de l'utilisateur"
 *                 default: "Une courte biographie..."
 *               tagIds:
 *                 type: array
 *                 description: "Liste des IDs de tags (genres) sélectionnés (uniquement si type=artist)"
 *                 items:
 *                   type: string
 *                 example: ["bL3ln5NP05LwYWoat4XyB", "JPzv_XgPjScRbnkS4QIRD"]
 *
 *               # ===== Champs communs =====
 *               country:
 *                 type: string
 *                 nullable: true
 *                 description: "Code pays (ISO2), ex: CM, FR, DZ"
 *                 example: "CM"
 *               profileImageUrl:
 *                 type: string
 *                 description: "URL de l'image de profil uploadée"
 *                 default: "https://example.com/profile-image.png"
 *               videoIntroUrl:
 *                 type: string
 *                 nullable: true
 *                 description: "URL de la vidéo de présentation de l'utilisateur"
 *                 default: "https://example.com/intro-video.mp4"
 *               miniVideoLoopUrl:
 *                 type: string
 *                 nullable: true
 *                 description: "URL d'une mini vidéo en boucle (teaser, loop)"
 *                 default: "https://example.com/mini-loop.mp4"
 *
 *               # ===== Sécurité / abonnement =====
 *               twoFactorEnabled:
 *                 type: boolean
 *                 description: "Indique si la double authentification est activée"
 *                 default: false
 *               isSubscribed:
 *                 type: boolean
 *                 description: "Indique si l'utilisateur est abonné (newsletter, services, etc.)"
 *                 default: false
 *
 *             required:
 *               - name
 *               - surname
 *               - email
 *               - password
 *               - type
 *             example:
 *               name: "John"
 *               surname: "Doe"
 *               email: "john.doe@example.com"
 *               password: "string123."
 *               type: "artist"
 *               artistName: "Artist Name"
 *               bio: "Une courte biographie..."
 *               tagIds: ["bL3ln5NP05LwYWoat4XyB", "JPzv_XgPjScRbnkS4QIRD"]
 *               country: "CM"
 *               profileImageUrl: "https://example.com/profile-image.png"
 *               twoFactorEnabled: false
 *               isSubscribed: false
 *     responses:
 *       200:
 *         description: "Utilisateur créé avec succès"
 *       400:
 *         description: "Données invalides"
 *       409:
 *         description: "Email déjà utilisé / conflit"
 *       500:
 *         description: "Erreur serveur"
 */
usersRoute.post("/create", email_middleware_1.EmailMiddleware, controllers_1.UserController.CreateUser);
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
usersRoute.get("/getAll", controllers_1.UserController.FindAllUser);
/**
 * @swagger
 * /users/artist-fan/getAll:
 *   get:
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     summary: "Récupérer la liste des artistes pour les fans (avec tags + abonnés)"
 *     description: |
 *       Retourne uniquement les utilisateurs de type "artist", enrichis pour l'affichage côté fan :
 *       - tags (genres musicaux) via la table pivot artist_tag
 *       - statistiques d'abonnés (subscribers) via la table subscriptions
 *       - (optionnel) isSubscribed si le fan est déjà abonné à l'artiste
 *     responses:
 *       200:
 *         description: "Liste des artistes enrichie"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully retrieved artists list"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "ng7PYXfsIXOvfm4G0m6NA"
 *                       artistName:
 *                         type: string
 *                         example: "artist 255"
 *                       username:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       profileImageUrl:
 *                         type: string
 *                         example: "https://res.cloudinary.com/.../image.jpg"
 *                       tags:
 *                         type: string
 *                         description: "Liste des tags/genres concaténés (ex: Pop, Rock)"
 *                         example: "Pop, Rock"
 *                       subscribersCount:
 *                         type: integer
 *                         example: 42
 *                       activeSubscribers:
 *                         type: integer
 *                         example: 10
 *                       isSubscribed:
 *                         type: boolean
 *                         description: "Indique si le fan connecté est abonné à cet artiste"
 *                         example: false
 *       401:
 *         description: "Non autorisé (token manquant ou invalide)"
 *       500:
 *         description: "Erreur serveur"
 */
usersRoute.get("/artist-fan/getAll", auth_middleware_1.AuthMiddleware, controllers_1.UserController.GetArtistsForFan);
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
usersRoute.get("/:id", controllers_1.UserController.FindUserById);
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
usersRoute.get("/getByEmail/:email", controllers_1.UserController.FindUserByEmail);
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
usersRoute.put("/:id", controllers_1.UserController.UpdateUser);
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
usersRoute.delete("/:id", controllers_1.UserController.DeleteUser);
exports.default = usersRoute;
