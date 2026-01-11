"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const auth_middleware_1 = require("../middleware/auth.middleware");
const flutterwaveRoute = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   - name: Flutterwave
 *     description: Intégration Flutterwave (Mobile Money Cameroun)
 */
/**
 * @swagger
 * /flutterwave/webhook:
 *   post:
 *     tags:
 *       - Flutterwave
 *     summary: Endpoint webhook Flutterwave
 *     description: |
 *       Endpoint appelé par Flutterwave pour notifier les événements de paiement.
 *       Vérifie le header verif-hash pour sécurité.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Payload Flutterwave
 *     responses:
 *       200:
 *         description: Webhook reçu et traité
 *       401:
 *         description: Signature invalide
 *       500:
 *         description: Erreur serveur
 */
flutterwaveRoute.post("/webhook", express_2.default.json(), controllers_1.FlutterwaveController.handleWebhook);
/**
 * @swagger
 * /flutterwave/initialize:
 *   post:
 *     tags:
 *       - Flutterwave
 *     security:
 *       - bearerAuth: []
 *     summary: Initialiser un paiement Flutterwave Mobile Money
 *     description: |
 *       Crée un paiement Mobile Money (MTN / Orange Cameroun) pour un abonnement.
 *       Retourne l'URL vers laquelle rediriger le fan.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               artistId:
 *                 type: string
 *               planId:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               amount:
 *                 type: number
 *             required:
 *               - artistId
 *               - planId
 *               - email
 *               - phone
 *               - amount
 *     responses:
 *       200:
 *         description: URL de redirection Flutterwave
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     redirectUrl:
 *                       type: string
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
flutterwaveRoute.post("/initialize", auth_middleware_1.AuthMiddleware, controllers_1.FlutterwaveController.initializePayment);
/**
 * @swagger
 * /flutterwave/cancel-subscription:
 *   post:
 *     tags:
 *       - Flutterwave
 *     security:
 *       - bearerAuth: []
 *     summary: Annuler un abonnement Flutterwave côté DB
 *     description: |
 *       Mobile Money n'a pas d'annulation côté API.
 *       Cette route met simplement l'abonnement en "cancelled" et désactive le renouvellement automatique.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscriptionId:
 *                 type: string
 *             required:
 *               - subscriptionId
 *     responses:
 *       200:
 *         description: Abonnement annulé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Abonnement introuvable
 *       500:
 *         description: Erreur serveur
 */
flutterwaveRoute.post("/cancel-subscription", auth_middleware_1.AuthMiddleware, controllers_1.FlutterwaveController.cancelSubscription);
flutterwaveRoute.post("/verify-payment", auth_middleware_1.AuthMiddleware, controllers_1.FlutterwaveController.verifyPayment);
exports.default = flutterwaveRoute;
