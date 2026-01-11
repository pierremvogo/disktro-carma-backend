"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.albumTagsRelations = exports.albumTags = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
const albums_schema_1 = require("./albums.schema");
const tags_schema_1 = require("./tags.schema");
const nanoid_1 = require("nanoid");
exports.albumTags = (0, mysql_core_1.mysqlTable)("album_tags", {
    id: (0, mysql_core_1.varchar)("id", { length: 32 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, nanoid_1.nanoid)()),
    albumId: (0, mysql_core_1.varchar)("album_id", { length: 32 })
        .notNull()
        .references(() => albums_schema_1.albums.id, {
        onDelete: "cascade", // 🔥 indispensable
    }),
    tagId: (0, mysql_core_1.varchar)("tag_id", { length: 32 })
        .notNull()
        .references(() => tags_schema_1.tags.id, {
        onDelete: "cascade", // 🔥 indispensable
    }),
}, (table) => ({
    albumTagUniqueIndex: (0, mysql_core_1.uniqueIndex)("album_tag_unique_idx").on(table.albumId, table.tagId),
}));
// Relations
exports.albumTagsRelations = (0, drizzle_orm_1.relations)(exports.albumTags, ({ one }) => ({
    album: one(albums_schema_1.albums, {
        relationName: "album",
        fields: [exports.albumTags.albumId],
        references: [albums_schema_1.albums.id],
    }),
    tag: one(tags_schema_1.tags, {
        relationName: "tag",
        fields: [exports.albumTags.tagId],
        references: [tags_schema_1.tags.id],
    }),
}));
