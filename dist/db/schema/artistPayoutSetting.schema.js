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
exports.artistPayoutSettingsRelations = exports.artistPayoutSettings = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const nanoid_1 = require("nanoid");
const schema = __importStar(require("./index"));
exports.artistPayoutSettings = (0, mysql_core_1.mysqlTable)("artist_payout_settings", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    artistId: (0, mysql_core_1.varchar)("artist_id", { length: 32 })
        .notNull()
        .references(() => schema.users.id, { onDelete: "cascade" }),
    // --- Bank ---
    bankAccountHolder: (0, mysql_core_1.varchar)("bank_account_holder", { length: 256 }),
    bankName: (0, mysql_core_1.varchar)("bank_name", { length: 256 }),
    accountNumber: (0, mysql_core_1.varchar)("account_number", { length: 128 }),
    routingNumber: (0, mysql_core_1.varchar)("routing_number", { length: 64 }),
    swiftCode: (0, mysql_core_1.varchar)("swift_code", { length: 32 }),
    iban: (0, mysql_core_1.varchar)("iban", { length: 64 }),
    // --- Digital ---
    paypalEmail: (0, mysql_core_1.varchar)("paypal_email", { length: 256 }),
    bizumPhone: (0, mysql_core_1.varchar)("bizum_phone", { length: 64 }),
    mobileMoneyProvider: (0, mysql_core_1.varchar)("mobile_money_provider", { length: 64 }),
    mobileMoneyPhone: (0, mysql_core_1.varchar)("mobile_money_phone", { length: 64 }),
    orangeMoneyPhone: (0, mysql_core_1.varchar)("orange_money_phone", { length: 64 }),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
}, (t) => [
    (0, mysql_core_1.uniqueIndex)("artist_payout_settings_artist_unique").on(t.artistId),
    (0, mysql_core_1.index)("artist_payout_settings_artist_idx").on(t.artistId),
]);
exports.artistPayoutSettingsRelations = (0, drizzle_orm_1.relations)(exports.artistPayoutSettings, ({ one }) => ({
    artist: one(schema.users, {
        fields: [exports.artistPayoutSettings.artistId],
        references: [schema.users.id],
    }),
}));
