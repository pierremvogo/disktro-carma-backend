"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LygosController = void 0;
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const nanoid_1 = require("nanoid");
const uuid_1 = require("uuid");
/**
 * Helpers
 */
function getEnv(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing env ${name}`);
    return v;
}
function toDbStatusLygos(status) {
    if (status === "success")
        return "active";
    if (status === "failed")
        return "cancelled";
    if (status === "pending")
        return "pending";
    return "pending";
}
const EUR_TO_FCFA = 656;
const convertEuroToFcfa = (euro) => {
    return Math.round(euro * EUR_TO_FCFA);
};
class LygosController {
}
exports.LygosController = LygosController;
_a = LygosController;
/**
 * POST /lygos/initialize
 * Auth required (fan)
 * body: { artistId, planId, email, phone, amount }
 *
 * Returns redirectUrl to send user to Lygos payment page
 */
LygosController.initializePayment = async (req, res) => {
    try {
        const fanId = req.user?.id;
        if (!fanId) {
            res.status(401).send({ message: "Unauthorized Fan" });
            return;
        }
        const { artistId, planId, email, phone } = req.body;
        if (!artistId || !planId || !email || !phone) {
            res.status(400).send({ message: "Missing required fields" });
            return;
        }
        // 1️⃣ Vérifier l'artiste
        const artist = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, artistId),
        });
        if (!artist || artist.type !== "artist") {
            res.status(404).send({ message: "Artist not found" });
            return;
        }
        // 2️⃣ Charger le plan
        const plan = await db_1.db.query.plans.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.plans.id, planId),
        });
        if (!plan) {
            res.status(404).send({ message: "Plan not found" });
            return;
        }
        // 3️⃣ Empêcher double abonnement actif
        const existing = await db_1.db.query.subscriptions.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.subscriptions.artistId, artistId), (0, drizzle_orm_1.eq)(schema.subscriptions.userId, fanId), (0, drizzle_orm_1.eq)(schema.subscriptions.status, "active"), (0, drizzle_orm_1.gt)(schema.subscriptions.endDate, new Date())),
        });
        if (existing) {
            res.status(200).send({
                message: "Already subscribed",
                data: { isSubscribed: true },
            });
            return;
        }
        // 4️⃣ Montant sécurisé depuis le plan
        const amount = convertEuroToFcfa(Number(plan.price));
        const currency = "XOF";
        const LYGOS_API_KEY = getEnv("LYGOS_API_KEY");
        const FRONT_URL = getEnv("FRONT_URL");
        // 5️⃣ Génération d’un orderId (sera utilisé dans le webhook)
        const orderId = `sub_${Date.now()}_${(0, uuid_1.v4)()}`;
        const payload = {
            amount: amount,
            shop_name: artist.artistName,
            message: `Subscription to ${artist.artistName}`,
            success_url: `${FRONT_URL}/payment-success`,
            failure_url: `${FRONT_URL}/payment-cancel`,
            order_id: orderId,
        };
        const response = await axios_1.default.post("https://api.lygosapp.com/v1/gateway", payload, {
            headers: {
                "api-key": LYGOS_API_KEY,
                "Content-Type": "application/json",
            },
        });
        res.status(200).json({
            message: "Payment initialized",
            data: {
                redirectUrl: response.data.link,
                orderId,
            },
        });
        return;
    }
    catch (err) {
        console.error("LygosController.initializePayment:", err);
        res.status(500).send({
            message: "Lygos initialization failed",
            error: err?.message || String(err),
        });
        return;
    }
};
/**
 * POST /lygos/webhook
 * body: { amount, currency, order_id, status }
 *
 * status expected: success | failed | pending
 */
LygosController.handleWebhook = async (req, res) => {
    try {
        const eventData = req.body;
        if (!eventData) {
            res.status(400).send("Invalid webhook payload");
            return;
        }
        const { status, order_id, amount, currency, meta, transaction_id } = eventData;
        // 🔒 Vérifications minimales
        if (!order_id || !status || !amount || !currency) {
            res.status(400).send("Missing required fields");
            return;
        }
        if (!meta || typeof meta !== "object") {
            res.status(400).send("Missing meta object");
            return;
        }
        const { fanId, artistId, planId } = meta;
        if (!fanId || !artistId || !planId) {
            res.status(400).send("Missing metadata values");
            return;
        }
        // 🔁 Mapping statut Lygos → DB
        const dbStatus = toDbStatusLygos(status);
        /**
         * Idempotence :
         * si on a déjà traité ce order_id + transaction_id, on ignore
         */
        const alreadyProcessed = await db_1.db.query.subscriptions.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.subscriptions.lygosOrderId, order_id), transaction_id
                ? (0, drizzle_orm_1.eq)(schema.subscriptions.lygosTransactionId, transaction_id)
                : undefined),
        });
        if (alreadyProcessed) {
            res.status(200).send("Already processed");
            return;
        }
        // 🔍 Vérifier s'il existe déjà une souscription (fan + artiste)
        const existing = await db_1.db.query.subscriptions.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.subscriptions.artistId, artistId), (0, drizzle_orm_1.eq)(schema.subscriptions.userId, fanId)),
        });
        // ⏱️ Durée (30 jours par défaut)
        const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        if (existing) {
            await db_1.db
                .update(schema.subscriptions)
                .set({
                status: dbStatus,
                planId,
                startDate: new Date(),
                endDate,
                price: Number(amount),
                currency,
                autoRenew: true,
                lygosOrderId: order_id,
                lygosTransactionId: transaction_id ?? null,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema.subscriptions.id, existing.id));
        }
        else {
            await db_1.db.insert(schema.subscriptions).values({
                id: (0, nanoid_1.nanoid)(),
                artistId,
                userId: fanId,
                planId,
                status: dbStatus,
                startDate: new Date(),
                endDate,
                price: Number(amount),
                currency,
                autoRenew: true,
                lygosOrderId: order_id,
                lygosTransactionId: transaction_id ?? null,
                createdAt: new Date(),
            });
        }
        res.status(200).send("OK");
    }
    catch (err) {
        console.error("Lygos webhook error:", err);
        res.status(500).send("Webhook processing failed");
    }
};
/**
 * POST /lygos/cancel-subscription
 * body: { subscriptionId }
 */
LygosController.cancelSubscription = async (req, res) => {
    try {
        const fanId = req.user?.id;
        if (!fanId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const { subscriptionId } = req.body;
        if (!subscriptionId) {
            res.status(400).send({ message: "Missing subscriptionId" });
            return;
        }
        const sub = await db_1.db.query.subscriptions.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.subscriptions.id, subscriptionId), (0, drizzle_orm_1.eq)(schema.subscriptions.userId, fanId)),
        });
        if (!sub) {
            res.status(404).send({ message: "Subscription not found" });
            return;
        }
        await db_1.db
            .update(schema.subscriptions)
            .set({ status: "cancelled", autoRenew: false })
            .where((0, drizzle_orm_1.eq)(schema.subscriptions.id, subscriptionId));
        res.status(200).send({ message: "Subscription cancelled" });
    }
    catch (err) {
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
LygosController.verifyPayment = async (req, res) => {
    try {
        const fanId = req.user?.id;
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
    }
    catch (err) {
        console.error("LygosController.verifyPayment:", err);
        res.status(500).json({
            message: "Verification failed",
            error: err.message || String(err),
        });
    }
};
