import { Router } from "express";
import express from "express";
import { StripeController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";

const stripeRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Stripe
 *     description: Intégration Stripe (checkout, portail, webhooks)
 */

/**
 * @swagger
 * /stripe/webhook:
 *   post:
 *     tags:
 *       - Stripe
 *     summary: Endpoint webhook Stripe
 *     description: |
 *       Endpoint appelé par Stripe pour notifier les événements de paiement / abonnement.
 *       IMPORTANT: ce endpoint doit recevoir le body brut (raw) pour vérifier la signature.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: "Payload Stripe brut (signé). Ne pas parser en JSON avant vérification."
 *     responses:
 *       200:
 *         description: Webhook reçu et traité
 *       400:
 *         description: Signature invalide / payload incorrect
 *       500:
 *         description: Erreur serveur
 */
stripeRoute.post(
  "/webhook",
  // ✅ RAW body obligatoire pour stripe.webhooks.constructEvent()
  // ⚠️ Assure-toi que cette route est MOUNTÉE AVANT express.json() global dans index.ts
  express.raw({ type: "application/json" }),
  StripeController.handleWebhook
);

/**
 * @swagger
 * /stripe/checkout/subscription:
 *   post:
 *     tags:
 *       - Stripe
 *     security:
 *       - bearerAuth: []
 *     summary: Créer une session Stripe Checkout pour un abonnement
 *     description: |
 *       Crée une session Stripe Checkout (mode subscription) pour permettre au fan connecté
 *       de s'abonner à un artiste via un plan (planId -> stripePriceId).
 *       Retourne une URL Stripe (session.url) vers laquelle rediriger l'utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               artistId:
 *                 type: string
 *                 description: ID de l'artiste (users.id)
 *               planId:
 *                 type: string
 *                 description: ID du plan interne (doit contenir stripePriceId)
 *             required:
 *               - artistId
 *               - planId
 *             example:
 *               artistId: "ng7PYXfsIXOvfm4G0m6NA"
 *               planId: "aYehMfhFa3EdQ_DaPRDml"
 *     responses:
 *       200:
 *         description: URL de checkout Stripe générée
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
 *                     url:
 *                       type: string
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Plan ou artiste introuvable
 *       500:
 *         description: Erreur serveur
 */
stripeRoute.post(
  "/checkout/subscription",
  AuthMiddleware,
  StripeController.createSubscriptionCheckoutSession
);

/**
 * @swagger
 * /stripe/portal:
 *   post:
 *     tags:
 *       - Stripe
 *     security:
 *       - bearerAuth: []
 *     summary: Créer une session Stripe Customer Portal
 *     description: |
 *       Retourne une URL vers le portail Stripe permettant au fan connecté
 *       de gérer ses moyens de paiement, factures et abonnements.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               returnUrl:
 *                 type: string
 *                 description: URL de retour après fermeture du portail
 *                 example: "https://disktro.com/account"
 *     responses:
 *       200:
 *         description: URL du portail Stripe générée
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
 *                     url:
 *                       type: string
 *       401:
 *         description: Non autorisé
 *       400:
 *         description: Stripe customer manquant
 *       500:
 *         description: Erreur serveur
 */
stripeRoute.post(
  "/portal",
  AuthMiddleware,
  StripeController.createCustomerPortalSession
);

/**
 * @swagger
 * /stripe/subscription/{artistId}/cancel:
 *   post:
 *     tags:
 *       - Stripe
 *     security:
 *       - bearerAuth: []
 *     summary: Annuler l'abonnement Stripe du fan pour un artiste
 *     description: |
 *       Annule l'abonnement actif du fan connecté pour un artiste donné.
 *       Selon l'implémentation, l'annulation peut être immédiate ou à la fin de la période.
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     isSubscribed:
 *                       type: boolean
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Abonnement actif introuvable
 *       500:
 *         description: Erreur serveur
 */
stripeRoute.post(
  "/subscription/:artistId/cancel",
  AuthMiddleware,
  StripeController.cancelSubscriptionForArtist
);

export default stripeRoute;
