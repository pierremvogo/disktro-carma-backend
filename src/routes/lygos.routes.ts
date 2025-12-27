import { Router } from "express";
import express from "express";
import { LygosController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";

const lygosRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Lygos
 *     description: Intégration Lygos (Mobile Money / Paiement en ligne)
 */

/**
 * @swagger
 * /lygos/webhook:
 *   post:
 *     tags:
 *       - Lygos
 *     summary: Endpoint webhook Lygos
 *     description: |
 *       Endpoint appelé par Lygos pour notifier le statut des paiements.
 *       Vérifie le header `x-lygos-signature` contenant ton secret webhook.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Payload Lygos
 *     responses:
 *       200:
 *         description: Webhook reçu et traité
 *       401:
 *         description: Signature invalide
 *       500:
 *         description: Erreur serveur
 */
lygosRoute.post("/webhook", express.json(), LygosController.handleWebhook);

/**
 * @swagger
 * /lygos/initialize:
 *   post:
 *     tags:
 *       - Lygos
 *     security:
 *       - bearerAuth: []
 *     summary: Initialiser un paiement Lygos
 *     description: |
 *       Crée une session de paiement via Lygos et retourne un lien de paiement.
 *       À utiliser pour les abonnements, dons, achats ou contributions fans.
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
 *         description: URL de redirection Lygos
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
 *                     orderId:
 *                       type: string
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
lygosRoute.post(
  "/initialize",
  AuthMiddleware,
  LygosController.initializePayment
);

/**
 * @swagger
 * /lygos/cancel-subscription:
 *   post:
 *     tags:
 *       - Lygos
 *     security:
 *       - bearerAuth: []
 *     summary: Annuler un abonnement côté DB
 *     description: |
 *       Annule un abonnement Lygos au niveau de ta base de données.
 *       Désactive le renouvellement automatique.
 *       Lygos ne propose pas "d’annulation API" pour Mobile Money.
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
lygosRoute.post(
  "/cancel-subscription",
  AuthMiddleware,
  LygosController.cancelSubscription
);

/**
 * @swagger
 * /lygos/verify-payment:
 *   post:
 *     tags:
 *       - Lygos
 *     security:
 *       - bearerAuth: []
 *     summary: Vérification manuelle d'un paiement Lygos
 *     description: |
 *       Vérifie un paiement à partir de son `orderId`.
 *       ⚠ Dépend d'un endpoint de vérification Lygos si exposé.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *             required:
 *               - orderId
 *     responses:
 *       200:
 *         description: Paiement vérifié
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
lygosRoute.post(
  "/verify-payment",
  AuthMiddleware,
  LygosController.verifyPayment
);

export default lygosRoute;
