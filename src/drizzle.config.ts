if (!process.env.DB_URL) {
  throw new Error("DB URL is missing");
}

export default {
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.DB_URL,
  },
  dialect: "mysql",
};
