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
exports.artistsRelations = exports.artists = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const schema = __importStar(require("./index"));
const nanoid_1 = require("nanoid");
exports.artists = (0, mysql_core_1.mysqlTable)("artists", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    name: (0, mysql_core_1.varchar)("name", { length: 256 }).notNull(),
    slug: (0, mysql_core_1.varchar)("slug", { length: 256 }).notNull().unique(),
    media_url: (0, mysql_core_1.varchar)("url", { length: 256 }),
    location: (0, mysql_core_1.varchar)("location", { length: 256 }),
    profileImageUrl: (0, mysql_core_1.varchar)("profile_image_url", { length: 256 }),
    biography: (0, mysql_core_1.varchar)("biography", { length: 256 }),
    spotify_artist_link: (0, mysql_core_1.varchar)("spotify_artist_link", {
        length: 256,
    }).unique(),
    deezer_artist_link: (0, mysql_core_1.varchar)("deezer_artist_link", { length: 256 }).unique(),
    tidal_artist_link: (0, mysql_core_1.varchar)("tidal_artist_link", { length: 256 }).unique(),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => [(0, mysql_core_1.uniqueIndex)("artist_slug_idx").on(table.slug)]);
exports.artistsRelations = (0, drizzle_orm_1.relations)(exports.artists, ({ many }) => ({
    release: many(schema.release),
    artistTags: many(schema.artistTags),
    albumArtists: many(schema.albumArtists),
    artistAdmins: many(schema.artistAdmins),
}));
