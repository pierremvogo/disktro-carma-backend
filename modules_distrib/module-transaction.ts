// models/transaction.model.ts
import { mysqlTable, int, varchar, datetime, decimal } from "drizzle-orm/mysql-core";
import { users } from "./user.model";
import { subscriptions } from "./subscription.model";

export const transactions = mysqlTable("transactions", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id),
  subscriptionId: int("subscription_id").notNull().references(() => subscriptions.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: datetime("created_at").defaultNow(),
});


// routes/transaction.routes.ts
import { Router } from "express";
import { getAllTransactions, createTransaction } from "../controllers/transaction.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticateToken, getAllTransactions);
router.post("/", authenticateToken, createTransaction);

export default router;


// controllers/transaction.controller.ts
import { Request, Response } from "express";
import { db } from "../config/db";
import { transactions } from "../models/transaction.model";

export const getAllTransactions = async (req: Request, res: Response) => {
  const result = await db.select().from(transactions);
  res.json(result);
};

export const createTransaction = async (req: Request, res: Response) => {
  const { userId, subscriptionId, amount, status } = req.body;
  await db.insert(transactions).values({ userId, subscriptionId, amount, status });
  res.status(201).json({ message: "Transaction created" });
};


// app.ts → ajout route
import transactionRoutes from "./routes/transaction.routes";
app.use("/api/transactions", transactionRoutes);

