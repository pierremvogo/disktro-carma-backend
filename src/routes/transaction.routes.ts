import { Router } from "express";
import { TransactionController } from "../controllers";

const transactionRoute = Router();

/**
 * @swagger
 * /transaction/create:
 *   post:
 *     tags:
 *       - Transaction
 *     summary: Créer une transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               subscriptionId:
 *                 type: string
 *               amount:
 *                 type: number
 *               status:
 *                 type: string
 *             required:
 *               - userId
 *               - amount
 *               - status
 *     responses:
 *       201:
 *         description: Transaction créée
 *       400:
 *         description: Erreur
 */
transactionRoute.post("/create", TransactionController.createTransaction);

/*/**
 * @swagger
 * /transaction/{id}:
 *   get:
 *     tags:
 *       - Transaction
 *     summary: Récupérer une transaction par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la transaction
 *     responses:
 *       200:
 *         description: Transaction trouvée
 *       404:
 *         description: Transaction non trouvée
 */
//transactionRoute.get("/:id", TransactionController.GetTransactionById);

/**
 * @swagger
 * /transaction:
 *   get:
 *     tags:
 *       - Transaction
 *     summary: Récupérer toutes les transactions
 *     responses:
 *       200:
 *         description: Liste des transactions
 */
transactionRoute.get("/", TransactionController.getAllTransactions);

/*/**
 * @swagger
 * /transaction/delete/{id}:
 *   delete:
 *     tags:
 *       - Transaction
 *     summary: Supprimer une transaction
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la transaction
 *     responses:
 *       200:
 *         description: Transaction supprimée
 *       404:
 *         description: Transaction non trouvée
 */
//transactionRoute.delete("/delete/:id", TransactionController.DeleteTransaction);

export default transactionRoute;
