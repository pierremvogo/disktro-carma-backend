"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    schema: "./src/db/schema/index.ts",
    out: "./src/db/migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    dialect: "mysql",
};
