"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testerValidate = exports.testers = void 0;
// src/db/schema/testers.ts
const mysql_core_1 = require("drizzle-orm/mysql-core");
const nanoid_1 = require("nanoid");
const zod_1 = __importDefault(require("zod"));
exports.testers = (0, mysql_core_1.mysqlTable)("testers", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    name: (0, mysql_core_1.varchar)("name", { length: 256 }).notNull(),
    email: (0, mysql_core_1.varchar)("email", { length: 256 }).notNull(),
    ageRange: (0, mysql_core_1.varchar)("ageRange", { length: 16 }).notNull(), // "-18", "-22", etc.
    language: (0, mysql_core_1.varchar)("language", { length: 32 }).notNull(), // "english", "spanish", "catalan"
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
});
// Schéma Zod pour valider ce qui vient du front
exports.testerValidate = zod_1.default.object({
    name: zod_1.default.string().min(1).max(256),
    email: zod_1.default.string().email().max(256),
    ageRange: zod_1.default.enum(["-18", "-22", "-25", "-30", "-50", "+50"]),
    language: zod_1.default.enum(["english", "spanish", "catalan"]),
});
