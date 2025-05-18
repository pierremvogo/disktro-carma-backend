// models/listen.model.ts
import { mysqlTable, int, datetime } from "drizzle-orm/mysql-core";
import { users } from "./user.model";
import { tracks } from "./track.model";

export const listens = mysqlTable("listens", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id),
  trackId: int("track_id").notNull().references(() => tracks.id),
  listenedAt: datetime("listened_at").defaultNow(),
});


// routes/report.routes.ts
import { Router } from "express";
import { getListeningStats } from "../controllers/report.controller";

const router = Router();

router.get("/listens", getListeningStats);

export default router;


// controllers/report.controller.ts
import { Request, Response } from "express";
import { db } from "../config/db";
import { listens } from "../models/listen.model";
import { sql } from "drizzle-orm";

export const getListeningStats = async (req: Request, res: Response) => {
  const stats = await db.execute(sql`
    SELECT track_id, COUNT(*) as total_listens
    FROM listens
    GROUP BY track_id
    ORDER BY total_listens DESC
    LIMIT 10
  `);

  res.json(stats);
};


// app.ts → ajout route
import reportRoutes from "./routes/report.routes";
app.use("/api/reports", reportRoutes);

