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
exports.tracksRelations = exports.tracks = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const schema = __importStar(require("."));
const nanoid_1 = require("nanoid");
exports.tracks = (0, mysql_core_1.mysqlTable)("tracks", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    isrcCode: (0, mysql_core_1.varchar)("isrc_code", { length: 256 }).notNull(),
    title: (0, mysql_core_1.varchar)("title", { length: 256 }),
    slug: (0, mysql_core_1.varchar)("slug", { length: 256 }).notNull(),
    type: (0, mysql_core_1.varchar)("type", { length: 256 }).notNull(),
    // ✅ userId optionnel (nullable)
    userId: (0, mysql_core_1.varchar)("user_id", { length: 32 }).references(() => schema.users.id, { onDelete: "cascade" }),
    duration: (0, mysql_core_1.double)("duration"),
    moodId: (0, mysql_core_1.varchar)("mood_id", { length: 32 })
        .references(() => schema.mood.id)
        .notNull(),
    audioUrl: (0, mysql_core_1.varchar)("audio_url", { length: 2048 }).notNull(),
    audioFileName: (0, mysql_core_1.varchar)("audio_file_name", { length: 255 }),
    // 🆕 Paroles du morceau
    lyrics: (0, mysql_core_1.text)("lyrics"),
    // 🆕 URL de la vidéo en langue des signes (accessibilité)
    signLanguageVideoUrl: (0, mysql_core_1.varchar)("sign_language_video_url", {
        length: 2048,
    }),
    signLanguageFileName: (0, mysql_core_1.varchar)("sign_language_file_name", {
        length: 255,
    }),
    // 🆕 URL du fichier braille (BRF / BRL / TXT généré)
    brailleFileUrl: (0, mysql_core_1.varchar)("braille_file_url", {
        length: 2048,
    }),
    brailleFileName: (0, mysql_core_1.varchar)("braille_file_name", { length: 255 }),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => [(0, mysql_core_1.index)("track_slug_idx").on(table.slug)]);
exports.tracksRelations = (0, drizzle_orm_1.relations)(exports.tracks, ({ many, one }) => ({
    trackAlbums: many(schema.trackAlbums),
    trackTags: many(schema.trackTags),
    trackReleases: many(schema.trackReleases),
    trackPlayLists: many(schema.trackPlayLists),
    mood: one(schema.mood, {
        fields: [exports.tracks.moodId],
        references: [schema.mood.id],
    }),
    user: one(schema.users, {
        fields: [exports.tracks.userId],
        references: [schema.users.id],
    }),
}));
