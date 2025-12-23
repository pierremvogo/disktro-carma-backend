import axios from "axios";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { and, eq, gt } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Helpers
 */
function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

function toDbStatusFlutterwave(status: string): string {
  // Flutterwave statuses: successful, failed, pending
  if (status === "successful") return "active";
  if (status === "failed") return "cancelled";
  if (status === "pending") return "pending";
  return "pending";
}

export class FlutterwaveController {
  /**
   * POST /flutterwave/initialize
   * Auth required (fan)
   * body: { artistId, planId, email, phone, amount }
   *
   * Returns redirectUrl for payment.
   */
  static initializePayment: RequestHandler = async (req, res) => {
    try {
      const fanId = (req as any).user?.id as string | undefined;
      if (!fanId) {
        res.status(401).send({ message: "Unauthorized Fan" });
        return;
      }

      const { artistId, planId, email, phone, amount } = req.body;
      if (!artistId || !planId || !email || !phone || !amount) {
        res.status(400).send({ message: "Missing required fields" });
        return;
      }

      // 1) Ensure artist exists
      const artist = await db.query.users.findFirst({
        where: eq(schema.users.id, artistId),
      });
      if (!artist || artist.type !== "artist") {
        res.status(404).send({ message: "Artist not found" });
        return;
      }

      // 2) Load plan
      const plan = await db.query.plans.findFirst({
        where: eq(schema.plans.id, planId),
      });
      if (!plan) {
        res.status(404).send({ message: "Plan not found" });
        return;
      }

      // 3) Optional: prevent duplicate active subscription
      const now = new Date();
      const existing = await db.query.subscriptions.findFirst({
        where: and(
          eq(schema.subscriptions.artistId, artistId),
          eq(schema.subscriptions.userId, fanId),
          eq(schema.subscriptions.status, "active"),
          gt(schema.subscriptions.endDate, now)
        ),
      });
      if (existing) {
        res.status(200).send({
          message: "Already subscribed",
          data: { isSubscribed: true },
        });
        return;
      }

      const FLW_SECRET_KEY = getEnv("FLW_SECRET_KEY");
      const FRONT_URL = getEnv("FRONT_URL");

      // 4) Initialize Flutterwave payment
      const tx_ref = `sub_${Date.now()}_${nanoid(6)}`;
      const response = await axios.post(
        "https://api.flutterwave.com/v3/payments",
        {
          tx_ref,
          amount,
          currency: "XAF",
          redirect_url: `${FRONT_URL}/payment/callback`,
          payment_options: "mobilemoneycm", // MTN + Orange Cameroon
          customer: {
            email,
            phonenumber: phone,
            name: email,
          },
          meta: {
            fanId,
            artistId,
            planId,
          },
          customizations: {
            title: "Artist Subscription",
            description: `Subscription to ${artist.name}`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${FLW_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.status(200).json({
        message: "Payment initialized",
        data: { redirectUrl: response.data.data.link },
      });
      return;
    } catch (err: any) {
      console.error("FlutterwaveController.initializePayment:", err);
      res.status(500).send({
        message: "Flutterwave initialization failed",
        error: err?.message || String(err),
      });
      return;
    }
  };

  /**
   * POST /flutterwave/webhook
   * body: raw JSON
   * headers: verif-hash
   *
   * Handles payment confirmation and updates DB.
   */
  static handleWebhook: RequestHandler = async (req, res) => {
    const signature = req.headers["verif-hash"];
    const WEBHOOK_SECRET = getEnv("FLW_WEBHOOK_SECRET");

    if (!signature || signature !== WEBHOOK_SECRET) {
      res.sendStatus(401);
      return;
    }

    try {
      const event = req.body;

      const eventData = event?.data;
      if (!eventData) {
        res.status(400).send("Invalid event");
        return;
      }

      const fanId = eventData.meta?.fanId;
      const artistId = eventData.meta?.artistId;
      const planId = eventData.meta?.planId;

      if (!fanId || !artistId || !planId) {
        res.status(400).send("Missing metadata");
        return;
      }

      const status = eventData.status; // successful, failed, pending
      const dbStatus = toDbStatusFlutterwave(status);

      const existing = await db.query.subscriptions.findFirst({
        where: and(
          eq(schema.subscriptions.artistId, artistId),
          eq(schema.subscriptions.userId, fanId)
        ),
      });

      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours comme exemple

      if (existing) {
        await db
          .update(schema.subscriptions)
          .set({
            status: dbStatus,
            planId,
            startDate: new Date(),
            endDate,
            price: eventData.amount,
            currency: eventData.currency,
            autoRenew: true,
            flutterwaveTransactionId: eventData.id,
          } as any)
          .where(eq(schema.subscriptions.id, (existing as any).id));
      } else {
        await db.insert(schema.subscriptions).values({
          id: nanoid(),
          artistId,
          userId: fanId,
          planId,
          status: dbStatus,
          startDate: new Date(),
          endDate,
          price: eventData.amount,
          currency: eventData.currency,
          autoRenew: true,
          flutterwaveTransactionId: eventData.id,
        } as any);
      }

      res.status(200).send("OK");
      return;
    } catch (err: any) {
      console.error("Flutterwave webhook error:", err);
      res.status(500).send("Webhook processing failed");
      return;
    }
  };

  /**
   * POST /flutterwave/cancel-subscription
   * Auth required
   * body: { subscriptionId }
   *
   * Mobile Money n’a pas de vrai "cancel" API,
   * donc tu peux juste mettre "cancelled" dans DB et empêcher renouvellement.
   */
  static cancelSubscription: RequestHandler = async (req, res) => {
    try {
      const fanId = (req as any).user?.id as string | undefined;
      if (!fanId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }
      const { subscriptionId } = req.body;
      if (!subscriptionId) {
        res.status(400).send({ message: "Missing subscriptionId" });
        return;
      }

      const sub = await db.query.subscriptions.findFirst({
        where: and(
          eq(schema.subscriptions.id, subscriptionId),
          eq(schema.subscriptions.userId, fanId)
        ),
      });

      if (!sub) {
        res.status(404).send({ message: "Subscription not found" });
        return;
      }

      await db
        .update(schema.subscriptions)
        .set({ status: "cancelled", autoRenew: false } as any)
        .where(eq(schema.subscriptions.id, subscriptionId));

      res.status(200).send({ message: "Subscription cancelled" });
      return;
    } catch (err: any) {
      console.error("FlutterwaveController.cancelSubscription:", err);
      res.status(500).send({ message: "Internal server error" });
      return;
    }
  };

  /**
   * Vérifie le paiement Flutterwave via tx_ref et flw_ref
   */
  static verifyPayment: RequestHandler = async (req, res) => {
    try {
      const fanId = (req as any).user?.id as string | undefined;
      if (!fanId) {
        res.status(401).json({ message: "Unauthorized Fan" });
        return;
      }

      const { txRef, flwRef } = req.body;
      if (!txRef || !flwRef) {
        res.status(400).json({ message: "Missing txRef or flwRef" });
        return;
      }

      const FLW_SECRET_KEY = getEnv("FLUTTERWAVE_SECRET_KEY");

      // 1) Vérifie la transaction auprès de Flutterwave
      const response = await axios.get(
        `https://api.flutterwave.com/v3/transactions/${flwRef}/verify`,
        {
          headers: {
            Authorization: `Bearer ${FLW_SECRET_KEY}`,
          },
        }
      );

      const data = response.data?.data;
      if (!data) {
        res.status(500).json({ message: "Invalid Flutterwave response" });
        return;
      }

      // 2) Check tx_ref, status, amount
      if (data.tx_ref !== txRef) {
        res.status(400).json({ message: "tx_ref mismatch" });
        return;
      }

      if (data.status !== "successful") {
        res.status(400).json({ message: "Payment not successful" });
        return;
      }

      // ✅ Ici tu peux mettre à jour la DB : marquer l’abonnement actif
      // Exemple pseudo-code :
      // await db.subscriptions.update({ txRef, status: 'active' })

      res.status(200).json({
        message: "Payment verified successfully",
        data: {
          status: "success",
          flwRef: flwRef,
          txRef: txRef,
          amount: data.amount,
          currency: data.currency,
        },
      });
    } catch (err: any) {
      console.error("FlutterwaveController.verifyPayment:", err);
      res.status(500).json({
        message: "Verification failed",
        error: err.message || String(err),
      });
    }
  };
}
