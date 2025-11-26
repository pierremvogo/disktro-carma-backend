import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../db/schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("❌ Missing DATABASE_URL environment variable");

const pool = mysql.createPool({
  uri: url,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false, // important pour Render
  },
});

export const db: MySql2Database<typeof schema> = drizzle(pool, {
  schema,
  mode: "default",
});

console.log("✅ Connected to external MySQL database with SSL");
