import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../db/schema";

const url = process.env.DB_URL;

if (!url) {
  throw new Error("❌ Missing DB_URL environment variable");
}

export const pool = mysql.createPool({
  uri: url,
  connectionLimit: 10,
});

export const db: MySql2Database<typeof schema> = drizzle(pool, {
  schema,
  mode: "default",
});

console.log("✅ Connected to MySQL database");
