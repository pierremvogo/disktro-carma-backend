<<<<<<< HEAD
<<<<<<< HEAD
import { Router } from "express";
import { UserController } from "../controllers";
import { EmailMiddleware } from "../middleware/email.middleware";
=======
import { Router } from 'express';
import { UserController } from '../controllers';
>>>>>>> new commit
=======
import { Router } from 'express';
import { UserController } from '../controllers';
>>>>>>> f8f573b57919d017cdedb018557f989e6ce94890
const usersRoute = Router();

/**
 * @swagger
<<<<<<< HEAD
<<<<<<< HEAD
 * /users/create:
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
>>>>>>> f8f573b57919d017cdedb018557f989e6ce94890
 *   post:
 *     summary: Créer un nouvel utilisateur
<<<<<<< HEAD
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
=======
 *     tags: [Users]
>>>>>>> f8f573b57919d017cdedb018557f989e6ce94890
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
<<<<<<< HEAD
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
=======
 *             $ref: '#/components/schemas/User'
>>>>>>> f8f573b57919d017cdedb018557f989e6ce94890
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
<<<<<<< HEAD
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
=======
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
>>>>>>> f8f573b57919d017cdedb018557f989e6ce94890
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
<<<<<<< HEAD
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
=======
>>>>>>> f8f573b57919d017cdedb018557f989e6ce94890
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
<<<<<<< HEAD
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
=======
 *         required: true
 *         description: Email de l'utilisateur à rechercher
>>>>>>> f8f573b57919d017cdedb018557f989e6ce94890
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
<<<<<<< HEAD
=======
 *       500:
 *         description: Erreur serveur
>>>>>>> f8f573b57919d017cdedb018557f989e6ce94890
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags:
 *       - Users
<<<<<<< HEAD
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
=======
>>>>>>> f8f573b57919d017cdedb018557f989e6ce94890
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
<<<<<<< HEAD
 *                 format: email
=======
>>>>>>> new commit
=======
>>>>>>> f8f573b57919d017cdedb018557f989e6ce94890
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
<<<<<<< HEAD
<<<<<<< HEAD
 *         description: Authentification réussie, retourne un token
=======
 *         description: Connexion réussie
>>>>>>> new commit
=======
 *         description: Connexion réussie
>>>>>>> f8f573b57919d017cdedb018557f989e6ce94890
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
<<<<<<< HEAD
<<<<<<< HEAD
=======
 *                 user:
 *                   $ref: '#/components/schemas/User'
>>>>>>> f8f573b57919d017cdedb018557f989e6ce94890
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur serveur
 */
<<<<<<< HEAD
usersRoute.post("/login", UserController.LoginUser);
=======
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur serveur
 */
=======
>>>>>>> f8f573b57919d017cdedb018557f989e6ce94890

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
<<<<<<< HEAD
>>>>>>> new commit
=======
>>>>>>> f8f573b57919d017cdedb018557f989e6ce94890

export default usersRoute;
