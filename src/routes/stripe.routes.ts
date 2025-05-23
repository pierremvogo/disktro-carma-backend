import { Router } from "express";
import { StripeController } from "../controllers";
import bodyParser from "body-parser";

const stripeRoute = Router();

/**
 * @swagger
 * /stripe/webhook:
 *   post:
 *     tags:
 *       - Stripe
 *     summary: Endpoint webhook Stripe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook reçu
 */
stripeRoute.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  StripeController.handleWebhook
);

/**
 * @swagger
 * /stripe/create-checkout-session:
 *   post:
 *     tags:
 *       - Stripe
 *     summary: Créer une session de paiement Stripe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               planId:
 *                 type: string
 *             required:
 *               - userId
 *               - planId
 *     responses:
 *       200:
 *         description: Session de paiement créée
 */
stripeRoute.post(
  "/create-checkout-session",
  StripeController.createCheckoutSession
);

export default stripeRoute;
