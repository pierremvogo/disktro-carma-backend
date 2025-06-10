import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
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

      // Validation des données de base
      if (
        !userId ||
        !subscriptionId ||
        amount === undefined ||
        typeof amount !== "number" ||
        amount < 1 ||
        !status ||
        typeof status !== "string"
      ) {
        res
          .status(400)
          .json({ message: "Invalid input data. Amount must be >= 1." });
        return;
      }

      // Vérifier que le user existe
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Vérifier que l'abonnement existe
      const subscription = await db.query.subscriptions.findFirst({
        where: eq(schema.subscriptions.id, subscriptionId),
      });

      if (!subscription) {
        res.status(404).json({ message: "Subscription not found" });
        return;
      }

      // Créer la transaction
      const result = await db
        .insert(schema.transactions)
        .values({
          userId,
          subscriptionId,
          amount: amount.toString(), // ou amount selon ton schéma
          status,
        })
        .$returningId();

      const createdTransaction = result[0];

      res.status(201).json({
        message: "Transaction created successfully",
        data: createdTransaction,
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  static getTransactionById: RequestHandler<{ transactionId: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const { transactionId } = req.params;

      if (!transactionId) {
        res.status(400).json({ message: "Invalid transaction ID" });
        return;
      }

      const transaction = await db.query.transactions.findFirst({
        where: (transactions, { eq }) => eq(transactions.id, transactionId),
      });

      if (!transaction) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }

      res.status(200).json({
        message: "Successfully get Transaction by Id",
        data: transaction,
      });
      return;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  };

  static deleteTransaction: RequestHandler<{ transactionId: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const id = req.params.transactionId;
      if (!id) {
        res.status(400).json({ message: "Invalid transaction ID" });
        return;
      }
      const existingTransactions = await db.query.transactions.findFirst({
        where: eq(schema.transactions.id, id),
      });

      if (!existingTransactions) {
        res.status(404).send({ message: "Transaction not found." });
        return;
      }
      await db
        .delete(schema.transactions)
        .where(eq(schema.transactions.id, id));
      res.status(200).send({
        message: "Transaction deleted successfully.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: `Internal server error: ${err}` });
    }
  };

  static updateTransaction: RequestHandler = async (req, res, next) => {
    try {
      const { transactionId } = req.params;
      const { userId, subscriptionId, amount, status } = req.body;

      if (
        !transactionId ||
        (!userId && !subscriptionId && !amount && !status)
      ) {
        res.status(400).json({ message: "Invalid input data" });
        return;
      }

      const updateData: any = {};
      if (userId) updateData.userId = userId;
      if (subscriptionId) updateData.subscriptionId = subscriptionId;
      if (typeof amount === "number") updateData.amount = amount.toString();
      if (typeof status === "string") updateData.status = status;

      await db
        .update(schema.transactions)
        .set(updateData)
        .where(eq(schema.transactions.id, transactionId));

      const updatedTransaction = await db.query.transactions.findFirst({
        where: eq(schema.transactions.id, transactionId),
      });
      if (!updatedTransaction) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }

      res.status(200).json({
        message: "Transaction updated successfully",
        data: updatedTransaction,
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
