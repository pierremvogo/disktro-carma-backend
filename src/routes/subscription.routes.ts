import { Router } from "express";
import { SubscriptionController } from "../controllers";

const subscriptionRoute = Router();

/**
 * @swagger
 * /subscription/create:
 *   post:
 *     tags:
 *       - Subscription
 *     summary: Créer une nouvelle souscription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               planId:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *               price:
 *                 type: string
 *               autoRenew:
 *                 type: boolean
 *             required:
 *               - userId
 *               - planId
 *               - startDate
 *               - status
 *               - price
 *             example:
 *                userId: "5yCbqEm3cFCGsELT5jxa6"
 *                planId: "aYehMfhFa3EdQ_DaPRDml"
 *                startDate: "2025-06-01"
 *                endDate: "2025-07-01"
 *                status: "active"
 *                price: 29.99
 *                autoRenew: true
 *     responses:
 *       201:
 *         description: Souscription créée
 *       400:
 *         description: Erreur
 */
subscriptionRoute.post("/create", SubscriptionController.CreateSubscription);

/**
 * @swagger
 * /subscription/{id}:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Récupérer une souscription par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la souscription
 *     responses:
 *       200:
 *         description: Souscription trouvée
 *       404:
 *         description: Souscription non trouvée
 */
subscriptionRoute.get("/:id", SubscriptionController.GetSubscriptionById);
/**
 * @swagger
 * /subscription/user/{userId}:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Récupérer les souscriptions par ID utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des souscriptions pour cet utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Aucune souscription trouvée pour cet utilisateur
 */
subscriptionRoute.get(
  "/user/:userId",
  SubscriptionController.GetSubscriptionsByUserId
);

/**
 * @swagger
 * /subscription/plan/{planId}:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Récupérer les souscriptions par ID de plan
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du plan
 *     responses:
 *       200:
 *         description: Liste des souscriptions pour ce plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Aucune souscription trouvée pour ce plan
 */
subscriptionRoute.get(
  "/plan/:planId",
  SubscriptionController.GetSubscriptionsByPlanId
);

/**
 * @swagger
 * /subscription:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Récupérer toutes les souscriptions
 *     responses:
 *       200:
 *         description: Liste des souscriptions
 */
subscriptionRoute.get("/", SubscriptionController.GetAllSubscriptions);

/**
 * @swagger
 * /subscription/update/{id}:
 *   put:
 *     tags:
 *       - Subscription
 *     summary: Mettre à jour une souscription
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la souscription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *               price:
 *                 type: string
 *               autoRenew:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Souscription mise à jour
 *       404:
 *         description: Souscription non trouvée
 */
subscriptionRoute.put("/update/:id", SubscriptionController.UpdateSubscription);

/**
 * @swagger
 * /subscription/delete/{id}:
 *   delete:
 *     tags:
 *       - Subscription
 *     summary: Supprimer une souscription
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la souscription
 *     responses:
 *       200:
 *         description: Souscription supprimée
 *       404:
 *         description: Souscription non trouvée
 */
subscriptionRoute.delete(
  "/delete/:id",
  SubscriptionController.DeleteSubscription
);

export default subscriptionRoute;
