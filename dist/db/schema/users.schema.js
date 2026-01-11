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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.usersRelations = exports.users = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const schema = __importStar(require("./index"));
const nanoid_1 = require("nanoid");
const zod_1 = __importDefault(require("zod"));
exports.users = (0, mysql_core_1.mysqlTable)("users", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    name: (0, mysql_core_1.varchar)("name", { length: 256 }).notNull(),
    surname: (0, mysql_core_1.varchar)("surname", { length: 256 }).notNull(),
    videoIntroUrl: (0, mysql_core_1.varchar)("videoIntroUrl", { length: 512 }),
    videoIntroFileName: (0, mysql_core_1.varchar)("videoIntro_file_name", {
        length: 255,
    }),
    miniVideoLoopUrl: (0, mysql_core_1.varchar)("miniVideoLoopUrl", { length: 512 }),
    miniVideoLoopFileName: (0, mysql_core_1.varchar)("miniVideoLoop_file_name", {
        length: 255,
    }),
    username: (0, mysql_core_1.varchar)("username", { length: 256 }),
    email: (0, mysql_core_1.varchar)("email", { length: 256 }).notNull().unique(),
    password: (0, mysql_core_1.varchar)("password", { length: 256 }).notNull().unique(),
    profileImageUrl: (0, mysql_core_1.varchar)("profileImageUrl", { length: 512 }),
    profileImageFileName: (0, mysql_core_1.varchar)("profileImage_file_name", {
        length: 255,
    }),
    type: (0, mysql_core_1.varchar)("type", { length: 256 }),
    isSubscribed: (0, mysql_core_1.boolean)("isSubscribed").notNull().default(false),
    artistName: (0, mysql_core_1.varchar)("artistName", { length: 256 }),
    genre: (0, mysql_core_1.varchar)("genre", { length: 256 }),
    bio: (0, mysql_core_1.varchar)("bio", { length: 1024 }),
    // 🌍 NOUVEAU : country
    country: (0, mysql_core_1.varchar)("country", { length: 128 }),
    twoFactorEnabled: (0, mysql_core_1.boolean)("twoFactorEnabled").notNull().default(false),
    emailVerificationToken: (0, mysql_core_1.varchar)("emailVerificationToken", {
        length: 256,
    }),
    emailVerified: (0, mysql_core_1.boolean)("emailVerified").notNull().default(false),
    passwordResetToken: (0, mysql_core_1.varchar)("passwordResetToken", { length: 256 }),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => [(0, mysql_core_1.uniqueIndex)("email_idx").on(table.email)]);
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    albums: many(schema.albums),
    artistAdmins: many(schema.artistAdmins),
    playlists: many(schema.playlists),
    plans: many(schema.plans),
    userTags: many(schema.userTags),
}));
exports.validate = zod_1.default.object({
    country: zod_1.default.string().max(128).optional(),
    id: zod_1.default.string().max(32).optional(), // généré automatiquement
    name: zod_1.default.string().min(1).max(256),
    surname: zod_1.default.string().min(1).max(256),
    // 🔹 Fan (et éventuellement artiste) : pseudo
    username: zod_1.default.string().max(256).optional(),
    email: zod_1.default.string().email().max(256),
    password: zod_1.default.string().min(8).max(256),
    profileImageUrl: zod_1.default.string().max(512).optional(),
    type: zod_1.default.string().max(256).optional(),
    // 🔹 Artiste
    artistName: zod_1.default.string().max(256).optional(),
    genre: zod_1.default.string().max(256).optional(),
    // 🔹 Bio commune
    bio: zod_1.default.string().max(1024).optional(),
    // 🔹 2FA
    twoFactorEnabled: zod_1.default.boolean().optional(),
    emailVerificationToken: zod_1.default
        .string()
        .max(256, "Le token de vérification est trop long")
        .optional(),
    passwordResetToken: zod_1.default
        .string()
        .max(256, "Le token de réinitialisation est trop long")
        .optional(),
    emailVerified: zod_1.default.boolean(),
    isSubscribed: zod_1.default.boolean().optional(),
    createdAt: zod_1.default.date().optional(),
    updatedAt: zod_1.default.date().optional(),
});
