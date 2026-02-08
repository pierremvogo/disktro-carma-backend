"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
class TransactionController {
}
exports.TransactionController = TransactionController;
_a = TransactionController;
TransactionController.getAllTransactions = async (req, res, next) => {
    try {
        const result = await db_1.db.select().from(schema.transactions);
        if (!result) {
            res.status(404).json({ message: "Not Found transaction" });
        }
        res.status(200).json(result);
        return;
    }
    catch (error) {
        console.error("Erreur lors de la récupération des transactions :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
        return;
    }
};
TransactionController.createTransaction = async (req, res, next) => {
    try {
        const { userId, subscriptionId, amount, status } = req.body;
        // Validation des données de base
        if (!userId ||
            !subscriptionId ||
            amount === undefined ||
            typeof amount !== "number" ||
            amount < 1 ||
            !status ||
            typeof status !== "string") {
            res
                .status(400)
                .json({ message: "Invalid input data. Amount must be >= 1." });
            return;
        }
        // Vérifier que le user existe
        const user = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, userId),
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Vérifier que l'abonnement existe
        const subscription = await db_1.db.query.subscriptions.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.subscriptions.id, subscriptionId),
        });
        if (!subscription) {
            res.status(404).json({ message: "Subscription not found" });
            return;
        }
        // Créer la transaction
        const result = await db_1.db
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
    }
    catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
TransactionController.getTransactionById = async (req, res, next) => {
    try {
        const { transactionId } = req.params;
        if (!transactionId) {
            res.status(400).json({ message: "Invalid transaction ID" });
            return;
        }
        const transaction = await db_1.db.query.transactions.findFirst({
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
    }
    catch (error) {
        console.error("Error fetching transaction:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};
TransactionController.deleteTransaction = async (req, res, next) => {
    try {
        const id = req.params.transactionId;
        if (!id) {
            res.status(400).json({ message: "Invalid transaction ID" });
            return;
        }
        const existingTransactions = await db_1.db.query.transactions.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.transactions.id, id),
        });
        if (!existingTransactions) {
            res.status(404).send({ message: "Transaction not found." });
            return;
        }
        await db_1.db
            .delete(schema.transactions)
            .where((0, drizzle_orm_1.eq)(schema.transactions.id, id));
        res.status(200).send({
            message: "Transaction deleted successfully.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: `Internal server error: ${err}` });
    }
};
TransactionController.updateTransaction = async (req, res) => {
    try {
        const transactionId = req.params.transactionId;
        const { userId, subscriptionId, amount, status } = req.body;
        if (!transactionId ||
            (!userId && !subscriptionId && amount === undefined && !status)) {
            res.status(400).json({ message: "Invalid input data" });
            return;
        }
        const updateData = {};
        if (typeof userId === "string")
            updateData.userId = userId;
        if (typeof subscriptionId === "string")
            updateData.subscriptionId = subscriptionId;
        if (amount !== undefined)
            updateData.amount = String(amount); // adapte au type colonne
        if (typeof status === "string")
            updateData.status = status;
        await db_1.db
            .update(schema.transactions)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema.transactions.id, transactionId));
        const [updatedTransaction] = await db_1.db
            .select()
            .from(schema.transactions)
            .where((0, drizzle_orm_1.eq)(schema.transactions.id, transactionId));
        if (!updatedTransaction) {
            res.status(404).json({ message: "Transaction not found" });
            return;
        }
        res.status(200).json({
            message: "Transaction updated successfully",
            data: updatedTransaction,
        });
        return;
    }
    catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};
