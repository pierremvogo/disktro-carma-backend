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
exports.exclusiveContentsRelations = exports.exclusiveContents = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const nanoid_1 = require("nanoid");
const schema = __importStar(require("./index"));
exports.exclusiveContents = (0, mysql_core_1.mysqlTable)("exclusive_contents", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    // l’artiste propriétaire du contenu
    artistId: (0, mysql_core_1.varchar)("artist_id", { length: 32 })
        .notNull()
        .references(() => schema.users.id, { onDelete: "cascade" }),
    type: (0, mysql_core_1.varchar)("type", { length: 16 }).notNull(), // music | video | photo | document
    title: (0, mysql_core_1.varchar)("title", { length: 256 }).notNull(),
    description: (0, mysql_core_1.text)("description"),
    // URL du fichier (Cloudinary / S3 / etc.)
    fileUrl: (0, mysql_core_1.varchar)("file_url", { length: 1024 }).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (t) => [(0, mysql_core_1.index)("exclusive_contents_artist_idx").on(t.artistId)]);
exports.exclusiveContentsRelations = (0, drizzle_orm_1.relations)(exports.exclusiveContents, ({ one }) => ({
    artist: one(schema.users, {
        fields: [exports.exclusiveContents.artistId],
        references: [schema.users.id],
    }),
}));
