import { relations } from 'drizzle-orm'
import { bigint, index, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core'

import * as schema from './index'

export const users = mysqlTable(
    'users',
    {
        id: bigint("id", {mode: "number", unsigned: true}).notNull().primaryKey().autoincrement(),
        name: varchar('name', {length: 256}).notNull(),
        email: varchar("email", {length: 256}).notNull().unique(),
        password: varchar("password", {length: 256}).notNull().unique(),
        type: varchar('type', {length: 256}),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
        
    },
    (table) => [
        index('email_idx').on(table.email),
    ]
)

export const usersRelations = relations(users, ({ many }) => ({
    artistAdmins: many(schema.artistAdmins),
}))
