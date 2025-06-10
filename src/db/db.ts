import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import * as schema from "../db/schema";

if (!process.env.DB_URL) {
  throw new Error("DB credentials error");
}
const connection = mysql.createConnection(process.env.DB_URL);
export const db: MySql2Database<typeof schema> = drizzle(connection, {
  schema,
  mode: "default",
});
