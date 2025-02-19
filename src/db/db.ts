import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import { env } from '../config';
import * as schema from '../db/schema';

if(!env.DB_URL) {
    throw new Error("DB credentials error");
}
const connection = mysql.createConnection(env.DB_URL);
export const db: MySql2Database<typeof schema> = drizzle(connection, { schema, mode:'default' }) 