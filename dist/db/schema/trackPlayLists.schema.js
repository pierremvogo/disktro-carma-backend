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
exports.trackPlaylistsRelations = exports.trackPlayLists = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const schema = __importStar(require("./index"));
const nanoid_1 = require("nanoid");
exports.trackPlayLists = (0, mysql_core_1.mysqlTable)("track_playlists", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    playlistId: (0, mysql_core_1.varchar)("playlist_id", { length: 32 })
        .notNull()
        .references(() => schema.playlists.id, {
        onDelete: "cascade", // 🔥 indispensable
    }),
    trackId: (0, mysql_core_1.varchar)("track_id", { length: 32 })
        .notNull()
        .references(() => schema.tracks.id, { onDelete: "cascade" }),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
}, (t) => [(0, mysql_core_1.uniqueIndex)("playlist_track_unique_idx").on(t.playlistId, t.trackId)]);
exports.trackPlaylistsRelations = (0, drizzle_orm_1.relations)(exports.trackPlayLists, ({ one }) => ({
    track: one(schema.tracks, {
        relationName: "track",
        fields: [exports.trackPlayLists.trackId],
        references: [schema.tracks.id],
    }),
    playlist: one(schema.playlists, {
        relationName: "playlist",
        fields: [exports.trackPlayLists.playlistId],
        references: [schema.playlists.id],
    }),
}));
