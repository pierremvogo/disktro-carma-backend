"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestion = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const nanoid_1 = require("nanoid");
exports.suggestion = (0, mysql_core_1.mysqlTable)("suggestion", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    email: (0, mysql_core_1.varchar)("email", { length: 256 }).notNull(),
    song: (0, mysql_core_1.varchar)("song", { length: 512 }).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow().notNull(),
});
