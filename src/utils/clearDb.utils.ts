import { sql } from 'drizzle-orm'

import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
// import { DB_DATABASE, DB_HOST, DB_USER, DB_PORT } from '$env/static/private'
import * as schema from '$lib/db/schema'
import * as dotenv from 'dotenv'

dotenv.config({ path: './.env' })

const main = async () => {
    const client = new pg.Client({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
    })

    client.connect()

    const db = drizzle(client, { schema })
    const query = sql<string>`SELECT table_name
			FROM information_schema.tables
			WHERE table_schema = 'public'
			AND table_type = 'BASE TABLE';
		`

    const result = await db.execute(query) // retrieve tables
    const tables = result.rows

    for (const table of tables) {
        const query = sql.raw(
            `DROP TABLE IF EXISTS ${table.table_name} CASCADE;`
        )
        await db.execute(query) // Truncate (clear all the data) the table
    }

    client.end()
}

main()
