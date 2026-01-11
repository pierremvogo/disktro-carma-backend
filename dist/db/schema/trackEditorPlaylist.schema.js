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
exports.editorPlaylistTracksRelations = exports.editorPlaylistTracks = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const nanoid_1 = require("nanoid");
const schema = __importStar(require("./index"));
exports.editorPlaylistTracks = (0, mysql_core_1.mysqlTable)("editor_playlist_tracks", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    editorPlaylistId: (0, mysql_core_1.varchar)("editor_playlist_id", { length: 32 })
        .notNull()
        .references(() => schema.editorPlaylists.id, { onDelete: "cascade" }),
    trackId: (0, mysql_core_1.varchar)("track_id", { length: 32 })
        .notNull()
        .references(() => schema.tracks.id, { onDelete: "cascade" }),
    // ordre d'affichage
    position: (0, mysql_core_1.int)("position").default(0).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (t) => [
    (0, mysql_core_1.uniqueIndex)("editor_playlist_track_unique").on(t.editorPlaylistId, t.trackId),
    (0, mysql_core_1.index)("editor_playlist_tracks_playlist_idx").on(t.editorPlaylistId),
    (0, mysql_core_1.index)("editor_playlist_tracks_position_idx").on(t.position),
]);
exports.editorPlaylistTracksRelations = (0, drizzle_orm_1.relations)(exports.editorPlaylistTracks, ({ one }) => ({
    playlist: one(schema.editorPlaylists, {
        fields: [exports.editorPlaylistTracks.editorPlaylistId],
        references: [schema.editorPlaylists.id],
    }),
    track: one(schema.tracks, {
        fields: [exports.editorPlaylistTracks.trackId],
        references: [schema.tracks.id],
    }),
}));
