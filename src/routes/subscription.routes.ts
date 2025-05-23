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
