"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.epTagsRelations = exports.epTags = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
const ep_schema_1 = require("./ep.schema");
const tags_schema_1 = require("./tags.schema");
const nanoid_1 = require("nanoid");
exports.epTags = (0, mysql_core_1.mysqlTable)("ep_tags", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    epId: (0, mysql_core_1.varchar)("ep_id", { length: 32 })
        .notNull()
        .references(() => ep_schema_1.eps.id, {
        onDelete: "cascade", // 🔥 indispensable
    }),
    tagId: (0, mysql_core_1.varchar)("tag_id", { length: 32 })
        .notNull()
        .references(() => tags_schema_1.tags.id, {
        onDelete: "cascade", // 🔥 indispensable
    }),
}, (table) => ({
    epTagUniqueIndex: (0, mysql_core_1.uniqueIndex)("ep_tag_unique_idx").on(table.epId, table.tagId),
}));
// Relations
exports.epTagsRelations = (0, drizzle_orm_1.relations)(exports.epTags, ({ one }) => ({
    ep: one(ep_schema_1.eps, {
        relationName: "ep",
        fields: [exports.epTags.epId],
        references: [ep_schema_1.eps.id],
    }),
    tag: one(tags_schema_1.tags, {
        relationName: "tag",
        fields: [exports.epTags.tagId],
        references: [tags_schema_1.tags.id],
    }),
}));
