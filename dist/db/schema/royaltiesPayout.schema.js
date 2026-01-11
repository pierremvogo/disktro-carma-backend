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
exports.royaltyPayoutsRelations = exports.royaltyPayouts = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const schema = __importStar(require("./index"));
const nanoid_1 = require("nanoid");
exports.royaltyPayouts = (0, mysql_core_1.mysqlTable)("royalty_payouts", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    // 🎤 Artiste concerné
    artistId: (0, mysql_core_1.varchar)("artist_id", { length: 32 })
        .notNull()
        .references(() => schema.users.id, { onDelete: "cascade" }),
    // 💰 Montant payé / à payer (snapshot)
    amount: (0, mysql_core_1.decimal)("amount", { precision: 10, scale: 2 }).notNull(),
    // Devise
    currency: (0, mysql_core_1.varchar)("currency", { length: 10 }).notNull().default("EUR"),
    // paid | pending
    status: (0, mysql_core_1.varchar)("status", { length: 20 }).notNull().default("paid"),
    // Date effective de paiement (null si pending)
    paidAt: (0, mysql_core_1.timestamp)("paid_at"),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (t) => [
    (0, mysql_core_1.index)("royalty_payouts_artist_id_idx").on(t.artistId),
    (0, mysql_core_1.index)("royalty_payouts_status_idx").on(t.status),
    (0, mysql_core_1.index)("royalty_payouts_created_at_idx").on(t.createdAt),
]);
exports.royaltyPayoutsRelations = (0, drizzle_orm_1.relations)(exports.royaltyPayouts, ({ one }) => ({
    artist: one(schema.users, {
        fields: [exports.royaltyPayouts.artistId],
        references: [schema.users.id],
    }),
}));
