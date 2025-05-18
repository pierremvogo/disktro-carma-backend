<<<<<<< HEAD
import { Router } from "express";
import { UserController } from "../controllers";
import { EmailMiddleware } from "../middleware/email.middleware";
=======
import { Router } from 'express';
import { UserController } from '../controllers';
>>>>>>> new commit
const usersRoute = Router();

/**
 * @swagger
<<<<<<< HEAD
 * /users/create:
 *   post:
 *     tags:
 *       - Users
 *     summary: Créer un nouvel utilisateur
=======
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer la liste des utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Users]
>>>>>>> new commit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
<<<<<<< HEAD
 *             type: object
 *             # Exemple de champs, à adapter
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
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
=======
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
>>>>>>> new commit
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
<<<<<<< HEAD
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
 *         required: true
 *         schema:
 *           type: string
 *           format: email
=======
 *           type: integer
 *     responses:
 *       204:
 *         description: Utilisateur supprimé
 */

/**
 * @swagger
 * /api/users/getByEmail/{email}:
 *   get:
 *     summary: Récupérer un utilisateur par email
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email de l'utilisateur à rechercher
>>>>>>> new commit
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
<<<<<<< HEAD
 */
usersRoute.get("/getByEmail/:email", UserController.FindUserByEmail);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Authentifier un utilisateur
=======
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags:
 *       - Users
>>>>>>> new commit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
<<<<<<< HEAD
 *                 format: email
=======
>>>>>>> new commit
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
<<<<<<< HEAD
 *         description: Authentification réussie, retourne un token
=======
 *         description: Connexion réussie
>>>>>>> new commit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
<<<<<<< HEAD
 *       401:
 *         description: Email ou mot de passe invalide
 */
usersRoute.post("/login", UserController.LoginUser);
=======
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur serveur
 */

// Create a new user
usersRoute.post('/create', UserController.CreateUser);

// Retrieve all users
usersRoute.get('/get', UserController.FindAllUser);

// Retrieve a single users with id
usersRoute.get('/getById/:id', UserController.FindUserById);

// Retrieve user By Email
usersRoute.get('/getByEmail/:email', UserController.FindUserByEmail);

// Login User
usersRoute.post('/login', UserController.LoginUser);
>>>>>>> new commit

export default usersRoute;
