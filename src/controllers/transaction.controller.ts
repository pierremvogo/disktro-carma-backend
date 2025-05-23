import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
export class TransactionController {
  static getAllTransactions: RequestHandler = async (req, res, next) => {
    try {
      const result = await db.select().from(schema.transactions);
      if (!result) {
        res.status(404).json({ message: "Not Found transaction" });
      }
      res.status(200).json(result);
      return;
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
      return;
    }
  };

  static createTransaction: RequestHandler = async (req, res, next) => {
    try {
      const { userId, subscriptionId, amount, status } = req.body;
      if (
        !userId ||
        !subscriptionId ||
        !amount ||
        typeof amount !== "number" ||
        !status ||
        typeof status !== "string"
      ) {
        res.status(400).json({ message: "Invalid input data" });
        return;
      }

      await db
        .insert(schema.transactions)
        .values({ userId, subscriptionId, amount: amount.toString(), status });

      res.status(201).json({ message: "Transaction created" });
      return;
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  };
}
