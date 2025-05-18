// index.ts
import { config } from "dotenv";
import app from "./app";

config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// app.ts
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import authRoutes from "./routes/auth.routes";
import artistRoutes from "./routes/artist.routes";
import trackRoutes from "./routes/track.routes";
import subscriptionRoutes from "./routes/subscription.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use("/api/auth", authRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

export default app;


// config/db.ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { config } from "dotenv";

config();

const connection = await mysql.createConnection({
  uri: process.env.DATABASE_URL,
});

export const db = drizzle(connection);


// config/dotenv.ts
import { config } from "dotenv";
config();


// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
};


// models/user.model.ts
import { mysqlTable, varchar, int, datetime } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("user"),
  createdAt: datetime("created_at").defaultNow(),
});


// utils/jwt.ts
import jwt from "jsonwebtoken";

export const generateToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};


// utils/hash.ts
import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => await bcrypt.hash(password, 10);
export const comparePassword = async (password: string, hash: string) => await bcrypt.compare(password, hash);


// routes/auth.routes.ts
import { Router } from "express";
import { register, login } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;


// controllers/auth.controller.ts
import { Request, Response } from "express";
import { db } from "../config/db";
import { users } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const hashed = await hashPassword(password);
  await db.insert(users).values({ email, password: hashed });
  res.status(201).json({ message: "User registered" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const [user] = await db.select().from(users).where(users.email.eq(email));
  if (!user) return res.status(404).json({ message: "User not found" });
  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid password" });
  const token = generateToken({ id: user.id, role: user.role });
  res.json({ token });
};

