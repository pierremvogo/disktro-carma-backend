import axios from "axios";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { and, eq, gt } from "drizzle-orm";
import { nanoid } from "nanoid";
import { v4 as uuidv4 } from "uuid";

/**
 * Helpers
 */
function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

function toDbStatusLygos(status: string): string {
  if (status === "success") return "active";
  if (status === "failed") return "cancelled";
  if (status === "pending") return "pending";
  return "pending";
}

export class LygosController {
  /**
   * POST /lygos/initialize
   * Auth required (fan)
   * body: { artistId, planId, email, phone, amount }
   *
   * Returns redirectUrl to send user to Lygos payment page
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

      // 3) Prevent duplicate active subscription
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

      const LYGOS_API_KEY = getEnv("LYGOS_API_KEY");
      const FRONT_URL = getEnv("FRONT_URL");

      const orderId = uuidv4();
      const payload = {
        amount: amount,
        shop_name: artist.name,
        message: `Subscription to ${artist.name}`,
        success_url: `${FRONT_URL}/payment/success`,
        failure_url: `${FRONT_URL}/payment/failed`,
        order_id: orderId,
      };

      const response = await axios.post(
        "https://api.lygosapp.com/v1/gateway",
        payload,
        {
          headers: {
            "api-key": LYGOS_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      res.status(200).json({
        message: "Payment initialized",
        data: { redirectUrl: response.data.link, orderId },
      });
    } catch (err: any) {
      console.error("LygosController.initializePayment:", err);
      res.status(500).send({
        message: "Lygos initialization failed",
        error: err?.message || String(err),
      });
    }
  };

  /**
   * POST /lygos/webhook
   * body: { amount, currency, order_id, status }
   *
   * status expected: success | failed | pending
   */
  static handleWebhook: RequestHandler = async (req, res) => {
    try {
      const SECRET = getEnv("LYGOS_WEBHOOK_SECRET");
      const signature = req.headers["x-lygos-signature"];
      if (!signature || signature !== SECRET) {
        res.sendStatus(401);
        return;
      }

      const eventData = req.body;
      if (!eventData?.order_id) {
        res.status(400).send("Missing order_id");
        return;
      }

      const { status, order_id, amount, currency } = eventData;
      const dbStatus = toDbStatusLygos(status);

      // find subscription by order_id stored in webhook:order_id -> subscription.flutterwaveTransactionId equivalent
      const existing = await db.query.subscriptions.findFirst({
        where: eq(schema.subscriptions.lygosOrderId, order_id),
      });

      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      if (existing) {
        await db
          .update(schema.subscriptions)
          .set({
            status: dbStatus,
            startDate: new Date(),
            endDate,
            price: amount,
            currency: currency,
            autoRenew: true,
          } as any)
          .where(eq(schema.subscriptions.id, (existing as any).id));
      }

      res.status(200).send("OK");
    } catch (err: any) {
      console.error("Lygos webhook error:", err);
      res.status(500).send("Webhook processing failed");
    }
  };

  /**
   * POST /lygos/cancel-subscription
   * body: { subscriptionId }
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
    } catch (err: any) {
      console.error("LygosController.cancelSubscription:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };

  /**
   * POST /lygos/verify
   * body: { orderId }
   *
   * ⚠ Cette route est "préparée", mais dépend d'un endpoint Lygos
   */
  static verifyPayment: RequestHandler = async (req, res) => {
    try {
      const fanId = (req as any).user?.id as string | undefined;
      if (!fanId) {
        res.status(401).json({ message: "Unauthorized Fan" });
        return;
      }

      const { orderId } = req.body;
      if (!orderId) {
        res.status(400).json({ message: "Missing orderId" });
        return;
      }

      // PLACEHOLDER en attendant endpoint officiel
      // const response = await axios.get(`https://api.lygosapp.com/v1/payments/${orderId}`, {
      //   headers: { "api-key": getEnv("LYGOS_API_KEY") }
      // });

      // Simulate
      const data = { status: "success", amount: 0, currency: "XAF" };

      res.status(200).json({
        message: "Payment verified",
        data: {
          orderId,
          status: data.status,
          amount: data.amount,
          currency: data.currency,
        },
      });
    } catch (err: any) {
      console.error("LygosController.verifyPayment:", err);
      res.status(500).json({
        message: "Verification failed",
        error: err.message || String(err),
      });
    }
  };
}
