import { RequestHandler } from "express";
import { db } from "../db/db";
import { Stripe } from "stripe";
import { eq } from "drizzle-orm";

import * as schema from "../db/schema";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    "La variable d'environnement STRIPE_SECRET_KEY est manquante !"
  );
}
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-04-30.basil",
});

export class StripeController {
  static createCheckoutSession: RequestHandler = async (req, res, next) => {
    const { amount, userId, subscriptionId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "Abonnement Musique" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONT_URL}/payment-success`,
      cancel_url: `${process.env.FRONT_URL}/payment-cancel`,
      metadata: { userId, subscriptionId },
    });

    res.status(200).json({ url: session.url });
  };

  static handleWebhook: RequestHandler = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    if (!sig || !endpointSecret) {
      res.status(400).send(`Signature ou secret de webhook manquant.`);
      return;
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error("Erreur de vérification du webhook :", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Paiement réussi pour la session : ${session.id}`);

        const { userId, subscriptionId } = session.metadata as {
          userId: string;
          subscriptionId: string;
        };

        if (!userId || !subscriptionId) {
          console.warn("Données metadata manquantes dans la session Stripe.");
          break;
        }

        // 📦 Mettre à jour la subscription dans la BDD
        await db
          .update(schema.subscriptions)
          .set({
            status: "active",
            stripeSessionId: session.id,
          })
          .where(eq(schema.subscriptions.id, subscriptionId));

        // 📦 Optionnel : marquer le user comme abonné
        await db
          .update(schema.users)
          .set({ isSubscribed: true })
          .where(eq(schema.users.id, userId));

        console.log(
          `Subscription ${subscriptionId} et user ${userId} mis à jour.`
        );
        break;

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Paiement intent réussi : ${paymentIntent.id}`);
        break;

      default:
        console.log(`Événement non géré : ${event.type}`);
    }

    res.status(200).send("Webhook reçu et traité.");
  };
}
