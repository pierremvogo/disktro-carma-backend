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
exports.epsTableInfo = exports.epsRelations = exports.eps = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const schema = __importStar(require("."));
const nanoid_1 = require("nanoid");
exports.eps = (0, mysql_core_1.mysqlTable)("eps", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    title: (0, mysql_core_1.varchar)("title", { length: 256 }).notNull(),
    slug: (0, mysql_core_1.varchar)("slug", { length: 256 }).notNull().unique(),
    duration: (0, mysql_core_1.int)("duration"),
    // Cover de l’EP
    coverUrl: (0, mysql_core_1.varchar)("cover_url", { length: 256 }).notNull(),
    coverFileName: (0, mysql_core_1.varchar)("cover_file_name", { length: 255 }).notNull(),
    // ============
    // Création / crédits (mêmes champs que albums/singles)
    // ============
    // Auteurs / compositeurs
    authors: (0, mysql_core_1.varchar)("authors", { length: 512 }),
    // Producteurs
    producers: (0, mysql_core_1.varchar)("producers", { length: 512 }),
    // Paroliers
    lyricists: (0, mysql_core_1.varchar)("lyricists", { length: 512 }),
    // Musiciens
    musiciansVocals: (0, mysql_core_1.varchar)("musicians_vocals", { length: 512 }),
    musiciansPianoKeyboards: (0, mysql_core_1.varchar)("musicians_piano_keyboards", {
        length: 512,
    }),
    musiciansWinds: (0, mysql_core_1.varchar)("musicians_winds", { length: 512 }),
    musiciansPercussion: (0, mysql_core_1.varchar)("musicians_percussion", { length: 512 }),
    musiciansStrings: (0, mysql_core_1.varchar)("musicians_strings", { length: 512 }),
    // Ingé mix / mastering
    mixingEngineer: (0, mysql_core_1.varchar)("mixing_engineer", { length: 512 }),
    masteringEngineer: (0, mysql_core_1.varchar)("mastering_engineer", { length: 512 }),
    // 👇 Clé étrangère vers la table `users`
    userId: (0, mysql_core_1.varchar)("user_id", { length: 32 })
        .notNull()
        .references(() => schema.users.id, { onDelete: "cascade" }),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => [(0, mysql_core_1.index)("ep_slug_idx").on(table.slug)]);
exports.epsRelations = (0, drizzle_orm_1.relations)(exports.eps, ({ one, many }) => ({
    user: one(schema.users, {
        fields: [exports.eps.userId],
        references: [schema.users.id],
    }),
    trackEps: many(schema.trackEps),
    epArtists: many(schema.epArtists),
    epTags: many(schema.epTags),
}));
exports.epsTableInfo = (0, mysql_core_1.getTableConfig)(exports.eps);
