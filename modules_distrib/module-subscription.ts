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


// models/artist.model.ts
import { mysqlTable, int, varchar, datetime, text } from "drizzle-orm/mysql-core";

export const artists = mysqlTable("artists", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  bio: text("bio"),
  coverUrl: varchar("cover_url", { length: 500 }),
  createdAt: datetime("created_at").defaultNow(),
});


// models/track.model.ts
import { mysqlTable, int, varchar, datetime, text } from "drizzle-orm/mysql-core";
import { artists } from "./artist.model";

export const tracks = mysqlTable("tracks", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  audioUrl: varchar("audio_url", { length: 500 }).notNull(),
  coverUrl: varchar("cover_url", { length: 500 }),
  artistId: int("artist_id").notNull().references(() => artists.id),
  duration: int("duration"),
  releaseDate: datetime("release_date").defaultNow(),
  createdAt: datetime("created_at").defaultNow(),
});


// models/subscription.model.ts
import { mysqlTable, int, varchar, datetime, decimal } from "drizzle-orm/mysql-core";

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  durationInDays: int("duration_in_days").notNull(),
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


// routes/artist.routes.ts
import { Router } from "express";
import { getAllArtists, createArtist } from "../controllers/artist.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllArtists);
router.post("/", authenticateToken, createArtist);

export default router;


// routes/track.routes.ts
import { Router } from "express";
import { getAllTracks, createTrack } from "../controllers/track.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllTracks);
router.post("/", authenticateToken, createTrack);

export default router;


// routes/subscription.routes.ts
import { Router } from "express";
import { getAllSubscriptions, createSubscription } from "../controllers/subscription.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllSubscriptions);
router.post("/", authenticateToken, createSubscription);

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


// controllers/artist.controller.ts
import { Request, Response } from "express";
import { db } from "../config/db";
import { artists } from "../models/artist.model";

export const getAllArtists = async (req: Request, res: Response) => {
  const result = await db.select().from(artists);
  res.json(result);
};

export const createArtist = async (req: Request, res: Response) => {
  const { name, bio, coverUrl } = req.body;
  await db.insert(artists).values({ name, bio, coverUrl });
  res.status(201).json({ message: "Artist created" });
};


// controllers/track.controller.ts
import { Request, Response } from "express";
import { db } from "../config/db";
import { tracks } from "../models/track.model";

export const getAllTracks = async (req: Request, res: Response) => {
  const result = await db.select().from(tracks);
  res.json(result);
};

export const createTrack = async (req: Request, res: Response) => {
  const { title, audioUrl, coverUrl, artistId, duration, releaseDate } = req.body;
  await db.insert(tracks).values({ title, audioUrl, coverUrl, artistId, duration, releaseDate });
  res.status(201).json({ message: "Track created" });
};


// controllers/subscription.controller.ts
import { Request, Response } from "express";
import { db } from "../config/db";
import { subscriptions } from "../models/subscription.model";

export const getAllSubscriptions = async (req: Request, res: Response) => {
  const result = await db.select().from(subscriptions);
  res.json(result);
};

export const createSubscription = async (req: Request, res: Response) => {
  const { name, price, durationInDays } = req.body;
  await db.insert(subscriptions).values({ name, price, durationInDays });
  res.status(201).json({ message: "Subscription plan created" });
};

