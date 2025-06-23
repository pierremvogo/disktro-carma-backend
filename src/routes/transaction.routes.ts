import { Router } from "express";
import { TransactionController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";

const transactionRoute = Router();

/**
 * @swagger
 * /transaction/create:
 *   post:
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
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
 *             example:
 *               userId: "AwVjNkjBix_QW6uMnSB-R"
 *               subscriptionId: "TG4tS0xwj5XQPq8QfdhVP"
 *               amount: 19.99
 *               status: "succeeded"
 *     responses:
 *       201:
 *         description: Transaction créée
 *       400:
 *         description: Erreur
 */
transactionRoute.post(
  "/create",
  AuthMiddleware,
  TransactionController.createTransaction
);

/**
 * @swagger
 * /transaction/{transactionId}:
 *   get:
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer une transaction par son ID
 *     parameters:
 *       - in: path
 *         name: transactionId
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
transactionRoute.get(
  "/:transactionId",
  AuthMiddleware,
  TransactionController.getTransactionById
);

/**
 * @swagger
 * /transaction/update/{transactionId}:
 *   put:
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour une transaction existante
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la transaction à mettre à jour
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
 *             example:
 *               userId: "AwVjNkjBix_QW6uMnSB-R"
 *               subscriptionId: "TG4tS0xwj5XQPq8QfdhVP"
 *               amount: 24.99
 *               status: "pending"
 *     responses:
 *       200:
 *         description: Transaction mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Transaction non trouvée
 *       500:
 *         description: Erreur serveur
 */
transactionRoute.put(
  "/update/:transactionId",
  AuthMiddleware,
  TransactionController.updateTransaction
);

/**
 * @swagger
 * /transaction:
 *   get:
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer toutes les transactions
 *     responses:
 *       200:
 *         description: Liste des transactions
 */
transactionRoute.get(
  "/",
  AuthMiddleware,
  TransactionController.getAllTransactions
);

/**
 * @swagger
 * /transaction/delete/{transactionId}:
 *   delete:
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer une transaction
 *     parameters:
 *       - in: path
 *         name: transactionId
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
transactionRoute.delete(
  "/delete/:transactionId",
  AuthMiddleware,
  TransactionController.deleteTransaction
);

export default transactionRoute;
