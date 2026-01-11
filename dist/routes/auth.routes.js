"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const authsRoute = (0, express_1.Router)();
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Authentifier un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 default: "vaviko7587@dlbazi.com"
 *               password:
 *                 type: string
 *                 default: "Hacking123."
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Authentification réussie, retourne un token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Email ou mot de passe invalide
 */
authsRoute.post("/login", controllers_1.UserController.LoginUser);
/**
 * @swagger
 * /auth/verify-email/{token}:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Vérifier l'email d'un utilisateur via un token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         default: "6vJ9nkfYtt"
 *         schema:
 *           type: string
 *         description: Token de vérification envoyé par email
 *     responses:
 *       200:
 *         description: Email vérifié avec succès
 *       400:
 *         description: Token invalide ou expiré
 */
authsRoute.get("/verify-email/:token", controllers_1.UserController.VerifyEmail);
/**
 * @swagger
 * /auth/request-password-reset:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Envoyer un e-mail de réinitialisation de mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: vaviko7587@dlbazi.com
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: E-mail de réinitialisation envoyé avec succès
 *       400:
 *         description: E-mail manquant ou invalide
 *       404:
 *         description: Utilisateur non trouvé
 */
authsRoute.post("/request-password-reset", controllers_1.UserController.requestResetPassword);
/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Réinitialiser le mot de passe avec un token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           example: 6vJ9nkfYtt
 *         description: Token de réinitialisation envoyé par e-mail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: Hacking123.
 *             required:
 *               - newPassword
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *       400:
 *         description: Token invalide ou mot de passe manquant
 */
authsRoute.post("/reset-password/:token", controllers_1.UserController.resetPassword);
exports.default = authsRoute;
