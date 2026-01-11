"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleTagsRelations = exports.singleTags = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
const single_schema_1 = require("./single.schema");
const tags_schema_1 = require("./tags.schema");
const nanoid_1 = require("nanoid");
exports.singleTags = (0, mysql_core_1.mysqlTable)("single_tags", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    singleId: (0, mysql_core_1.varchar)("single_id", { length: 32 })
        .notNull()
        .references(() => single_schema_1.singles.id, {
        onDelete: "cascade", // 🔥 indispensable
    }),
    tagId: (0, mysql_core_1.varchar)("tag_id", { length: 32 })
        .notNull()
        .references(() => tags_schema_1.tags.id, {
        onDelete: "cascade", // 🔥 indispensable
    }),
}, (table) => ({
    singleTagUniqueIndex: (0, mysql_core_1.uniqueIndex)("single_tag_unique_idx").on(table.singleId, table.tagId),
}));
// Relations
exports.singleTagsRelations = (0, drizzle_orm_1.relations)(exports.singleTags, ({ one }) => ({
    single: one(single_schema_1.singles, {
        relationName: "single",
        fields: [exports.singleTags.singleId],
        references: [single_schema_1.singles.id],
    }),
    tag: one(tags_schema_1.tags, {
        relationName: "tag",
        fields: [exports.singleTags.tagId],
        references: [tags_schema_1.tags.id],
    }),
}));
