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
exports.trackStreamsRelations = exports.trackStreams = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const nanoid_1 = require("nanoid");
const schema = __importStar(require("./index"));
exports.trackStreams = (0, mysql_core_1.mysqlTable)("track_streams", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    trackId: (0, mysql_core_1.varchar)("track_id", { length: 32 })
        .notNull()
        .references(() => schema.tracks.id, {
        onDelete: "cascade", // 🔥 indispensable
    }),
    // si tu as un modèle users dans ton schema
    userId: (0, mysql_core_1.varchar)("user_id", { length: 32 })
        .notNull()
        .references(() => schema.users.id, { onDelete: "cascade" }),
    ipAddress: (0, mysql_core_1.varchar)("ip_address", { length: 45 }), // IPv4 / IPv6
    country: (0, mysql_core_1.varchar)("country", { length: 2 }), // ex: "FR", "ES"
    city: (0, mysql_core_1.varchar)("city", { length: 191 }),
    device: (0, mysql_core_1.varchar)("device", { length: 50 }), // "mobile", "desktop", etc.
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (t) => [
    (0, mysql_core_1.index)("track_streams_track_id_idx").on(t.trackId),
    (0, mysql_core_1.index)("track_streams_user_id_idx").on(t.userId),
    (0, mysql_core_1.index)("track_streams_created_at_idx").on(t.createdAt),
]);
exports.trackStreamsRelations = (0, drizzle_orm_1.relations)(exports.trackStreams, ({ one }) => ({
    track: one(schema.tracks, {
        relationName: "track",
        fields: [exports.trackStreams.trackId],
        references: [schema.tracks.id],
    }),
    // décommente ceci si tu as schema.users
    user: one(schema.users, {
        relationName: "user",
        fields: [exports.trackStreams.userId],
        references: [schema.users.id],
    }),
}));
