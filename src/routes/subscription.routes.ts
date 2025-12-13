import { Router } from "express";
import { SubscriptionController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";

const subscriptionRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Subscription
 *     description: Gestion des abonnements
 */

/**
 * @swagger
 * /subscription/create:
 *   post:
 *     tags:
 *       - Subscription
 *     security:
 *       - bearerAuth: []
 *     summary: Créer (ou mettre à jour) une souscription pour un plan
 *     description: >
 *       Crée un abonnement pour le plan donné. Le backend déduit l'artiste depuis le plan,
 *       calcule endDate selon billingCycle, et met à jour l'abonnement existant si le fan est déjà abonné à cet artiste.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planId:
 *                 type: string
 *                 description: ID du plan (monthly/quarterly/annual)
 *               autoRenew:
 *                 type: boolean
 *                 description: Renouvellement automatique (optionnel)
 *             required:
 *               - planId
 *             example:
 *               planId: "aYehMfhFa3EdQ_DaPRDml"
 *               autoRenew: true
 *     responses:
 *       201:
 *         description: Souscription créée
 *       200:
 *         description: Souscription mise à jour (si existante)
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Plan non trouvé
 */
subscriptionRoute.post(
  "/create",
  AuthMiddleware,
  SubscriptionController.CreateSubscription
);

/**
 * @swagger
 * /subscription/artist/me/recent:
 *   get:
 *     tags:
 *       - Subscription
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les abonnés récents actifs (artiste connecté)
 *     description: >
 *       Retourne la liste des fans ayant une souscription ACTIVE (status=active et endDate > now)
 *       la plus récente, triée par date de création décroissante.
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Nombre maximum de résultats (max 50)
 *     responses:
 *       200:
 *         description: Liste des abonnés récents actifs
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
subscriptionRoute.get(
  "/artist/me/recent",
  AuthMiddleware,
  SubscriptionController.GetMyRecentActiveSubscribers
);

/**
 * @swagger
 * /subscription/artist/me/by-location:
 *   get:
 *     tags:
 *       - Subscription
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les abonnements actifs par localisation (artiste connecté)
 *     description: >
 *       Groupe les abonnés actifs par pays (users.country) et renvoie subscribers + percentage.
 *     responses:
 *       200:
 *         description: Répartition des abonnés actifs par pays
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
 *                     type: object
 *                     properties:
 *                       location:
 *                         type: string
 *                         example: "CM"
 *                       subscribers:
 *                         type: integer
 *                         example: 12
 *                       percentage:
 *                         type: string
 *                         example: "40.0%"
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
subscriptionRoute.get(
  "/artist/me/by-location",
  AuthMiddleware,
  SubscriptionController.GetMyActiveSubscriptionsByLocation
);

/**
 * @swagger
 * /subscription/user/{userId}:
 *   get:
 *     tags:
 *       - Subscription
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les souscriptions d'un utilisateur (fan)
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
 *       404:
 *         description: Aucune souscription trouvée
 */
subscriptionRoute.get(
  "/user/:userId",
  AuthMiddleware,
  SubscriptionController.GetSubscriptionsByUserId
);

/**
 * @swagger
 * /subscription/plan/{planId}:
 *   get:
 *     tags:
 *       - Subscription
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les souscriptions par plan
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
 *       404:
 *         description: Aucune souscription trouvée
 */
subscriptionRoute.get(
  "/plan/:planId",
  AuthMiddleware,
  SubscriptionController.GetSubscriptionsByPlanId
);

/**
 * @swagger
 * /subscription/update/{id}:
 *   put:
 *     tags:
 *       - Subscription
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour une souscription (admin/maintenance)
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
 *                 example: "canceled"
 *               autoRenew:
 *                 type: boolean
 *             example:
 *               status: "canceled"
 *               autoRenew: false
 *     responses:
 *       200:
 *         description: Souscription mise à jour
 *       404:
 *         description: Souscription non trouvée
 */
subscriptionRoute.put(
  "/update/:id",
  AuthMiddleware,
  SubscriptionController.UpdateSubscription
);

/**
 * @swagger
 * /subscription/delete/{id}:
 *   delete:
 *     tags:
 *       - Subscription
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer une souscription (admin/maintenance)
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
  AuthMiddleware,
  SubscriptionController.DeleteSubscription
);

/**
 * @swagger
 * /subscription:
 *   get:
 *     tags:
 *       - Subscription
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer toutes les souscriptions (admin/debug)
 *     responses:
 *       200:
 *         description: Liste des souscriptions
 */
subscriptionRoute.get(
  "/",
  AuthMiddleware,
  SubscriptionController.GetAllSubscriptions
);

/**
 * @swagger
 * /subscription/{id}:
 *   get:
 *     tags:
 *       - Subscription
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer une souscription par ID
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
subscriptionRoute.get(
  "/:id",
  AuthMiddleware,
  SubscriptionController.GetSubscriptionById
);

export default subscriptionRoute;
