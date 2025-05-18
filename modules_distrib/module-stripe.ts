// config/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});


// routes/payment.routes.ts
import { Router } from "express";
import { createCheckoutSession, handleWebhook } from "../controllers/payment.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import express from "express";

const router = Router();

router.post("/create-session", authenticateToken, createCheckoutSession);
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

export default router;


// controllers/payment.controller.ts
import { Request, Response } from "express";
import { stripe } from "../config/stripe";
import { db } from "../config/db";
import { transactions } from "../models/transaction.model";

export const createCheckoutSession = async (req: Request, res: Response) => {
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

  res.json({ url: session.url });
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const { userId, subscriptionId } = session.metadata;
    const amount = session.amount_total / 100;

    await db.insert(transactions).values({
      userId: parseInt(userId),
      subscriptionId: parseInt(subscriptionId),
      amount,
      status: "paid",
    });
  }

  res.status(200).send("Received");
};


// app.ts → ajout route
import paymentRoutes from "./routes/payment.routes";
app.use("/api/payments", paymentRoutes);

