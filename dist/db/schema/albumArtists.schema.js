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
exports.albumArtistsRelations = exports.albumArtists = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const schema = __importStar(require("./index"));
const nanoid_1 = require("nanoid");
// import { albums, tracks, users, artistTags } from '.'
exports.albumArtists = (0, mysql_core_1.mysqlTable)("album_artists", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    artistId: (0, mysql_core_1.varchar)("artist_id", { length: 32 })
        .notNull()
        .references(() => schema.artists.id, {
        onDelete: "cascade", // 🔥 indispensable
    }),
    albumId: (0, mysql_core_1.varchar)("album_id", { length: 32 })
        .notNull()
        .references(() => schema.albums.id, {
        onDelete: "cascade", // 🔥 indispensable
    }),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
}, (t) => [(0, mysql_core_1.uniqueIndex)("unique_artist_album").on(t.artistId, t.albumId)]);
exports.albumArtistsRelations = (0, drizzle_orm_1.relations)(exports.albumArtists, ({ one }) => ({
    album: one(schema.albums, {
        relationName: "album",
        fields: [exports.albumArtists.albumId],
        references: [schema.albums.id],
    }),
    artist: one(schema.users, {
        relationName: "users",
        fields: [exports.albumArtists.artistId],
        references: [schema.users.id],
    }),
}));
