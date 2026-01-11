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
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionsRelations = exports.subscriptions = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const schema = __importStar(require("./index"));
const nanoid_1 = require("nanoid");
exports.subscriptions = (0, mysql_core_1.mysqlTable)("subscriptions", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    // 👤 FAN (celui qui s’abonne)
    userId: (0, mysql_core_1.varchar)("user_id", { length: 32 })
        .notNull()
        .references(() => schema.users.id, { onDelete: "cascade" }),
    // 🎤 ARTISTE (propriétaire du plan)
    artistId: (0, mysql_core_1.varchar)("artist_id", { length: 32 })
        .notNull()
        .references(() => schema.users.id, { onDelete: "cascade" }),
    // 📦 PLAN (monthly / quarterly / annual)
    planId: (0, mysql_core_1.varchar)("plan_id", { length: 32 })
        .notNull()
        .references(() => schema.plans.id, { onDelete: "cascade" }),
    // 🔄 STATUT
    status: (0, mysql_core_1.varchar)("status", { length: 20 }).notNull().default("active"),
    // active | cancelled | expired | past_due | pending
    // ⏱️ DATES
    startDate: (0, mysql_core_1.timestamp)("start_date").notNull().defaultNow(),
    endDate: (0, mysql_core_1.timestamp)("end_date").notNull(),
    // 💰 PRIX SNAPSHOT (au moment de l’abonnement)
    price: (0, mysql_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    currency: (0, mysql_core_1.varchar)("currency", { length: 10 }).notNull().default("EUR"),
    // 🔁 RENOUVELLEMENT AUTO
    autoRenew: (0, mysql_core_1.boolean)("auto_renew").notNull().default(true),
    // ✅ STRIPE (recommandé pour abonnement)
    stripeCustomerId: (0, mysql_core_1.varchar)("stripe_customer_id", { length: 64 }),
    stripeSubscriptionId: (0, mysql_core_1.varchar)("stripe_subscription_id", { length: 64 }),
    stripeCheckoutSessionId: (0, mysql_core_1.varchar)("stripe_checkout_session_id", {
        length: 128,
    }),
    // ⭐️ Nouveau champ pour stocker l'order_id Lygos
    lygosOrderId: (0, mysql_core_1.varchar)("lygos_order_id", { length: 128 }),
    lygosTransactionId: (0, mysql_core_1.varchar)("lygos_transaction_id", { length: 128 }),
    // (legacy) si tu veux garder l'ancien champ pour compat
    // stripeSessionId: varchar("stripe_session_id", { length: 255 }),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
}, (t) => [
    // 🚫 Un fan ne peut avoir QU’UN abonnement par artiste
    (0, mysql_core_1.uniqueIndex)("unique_user_artist").on(t.userId, t.artistId),
    (0, mysql_core_1.uniqueIndex)("subscriptions_lygos_transaction_unique").on(t.lygosTransactionId),
    // 🆕 Un order_id Lygos doit être unique si stocké
    (0, mysql_core_1.uniqueIndex)("subscriptions_lygos_order_unique").on(t.lygosOrderId),
    // ✅ Un abonnement Stripe est unique
    (0, mysql_core_1.uniqueIndex)("subscriptions_stripe_sub_unique").on(t.stripeSubscriptionId),
    // ✅ Une session Checkout est unique (optionnel mais utile)
    (0, mysql_core_1.uniqueIndex)("subscriptions_stripe_checkout_unique").on(t.stripeCheckoutSessionId),
    // 📊 Index utiles pour stats
    (0, mysql_core_1.index)("subscriptions_artist_idx").on(t.artistId),
    (0, mysql_core_1.index)("subscriptions_user_idx").on(t.userId),
    (0, mysql_core_1.index)("subscriptions_status_idx").on(t.status),
]);
exports.subscriptionsRelations = (0, drizzle_orm_1.relations)(exports.subscriptions, ({ one }) => ({
    fan: one(schema.users, {
        fields: [exports.subscriptions.userId],
        references: [schema.users.id],
    }),
    artist: one(schema.users, {
        fields: [exports.subscriptions.artistId],
        references: [schema.users.id],
    }),
    plan: one(schema.plans, {
        fields: [exports.subscriptions.planId],
        references: [schema.plans.id],
    }),
}));
