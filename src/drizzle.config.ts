import "dotenv/config";

export default {
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  dialect: "mysql",
};
