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
exports.plansRelations = exports.plans = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const schema = __importStar(require("./index"));
const nanoid_1 = require("nanoid");
exports.plans = (0, mysql_core_1.mysqlTable)("plans", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    // 🎤 Artiste propriétaire du plan
    artistId: (0, mysql_core_1.varchar)("artist_id", { length: 32 })
        .notNull()
        .references(() => schema.users.id, { onDelete: "cascade" }),
    // Nom affiché (ex: "Monthly", "Quarterly", "Annual")
    name: (0, mysql_core_1.varchar)("name", { length: 100 }).notNull(),
    description: (0, mysql_core_1.text)("description"),
    // Prix du plan
    price: (0, mysql_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    // Devise (si tu veux rester simple -> EUR partout)
    currency: (0, mysql_core_1.varchar)("currency", { length: 10 }).notNull().default("EUR"),
    // Cycle : monthly | quarterly | annual
    billingCycle: (0, mysql_core_1.varchar)("billing_cycle", { length: 20 }).notNull(),
    // ✅ (optionnel) période d’essai
    trialDays: (0, mysql_core_1.int)("trial_days").default(0).notNull(),
    // ✅ Stripe
    stripeProductId: (0, mysql_core_1.varchar)("stripe_product_id", { length: 64 }),
    stripePriceId: (0, mysql_core_1.varchar)("stripe_price_id", { length: 64 }),
    // Actif / inactif
    active: (0, mysql_core_1.boolean)("active").notNull().default(true),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
}, (t) => [
    (0, mysql_core_1.index)("plans_artist_id_idx").on(t.artistId),
    // 🚫 Un artiste ne peut pas avoir deux "monthly" par exemple
    (0, mysql_core_1.uniqueIndex)("unique_artist_cycle").on(t.artistId, t.billingCycle),
    // ✅ Un Stripe priceId doit être unique (si renseigné)
    (0, mysql_core_1.uniqueIndex)("plans_stripe_price_unique").on(t.stripePriceId),
]);
exports.plansRelations = (0, drizzle_orm_1.relations)(exports.plans, ({ one, many }) => ({
    artist: one(schema.users, {
        fields: [exports.plans.artistId],
        references: [schema.users.id],
    }),
    subscriptions: many(schema.subscriptions),
}));
