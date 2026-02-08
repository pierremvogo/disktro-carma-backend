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
 * /subscription/artist/me/stats:
 *   get:
 *     tags:
 *       - Subscription
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les statistiques d'abonnements (artiste connecté)
 *     description: >
 *       Retourne les statistiques globales des abonnements pour l'artiste connecté :
 *       - totalRevenue : revenus cumulés (toutes souscriptions)
 *       - totalSubscribers : nombre total de fans uniques ayant souscrit
 *       - activeSubscribers : nombre de fans actuellement abonnés (status=active et endDate > now)
 *       - growth : évolution (%) des nouveaux abonnés sur les 30 derniers jours
 *     responses:
 *       200:
 *         description: Statistiques d'abonnements récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription stats fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     currency:
 *                       type: string
 *                       example: "EUR"
 *                     totalRevenue:
 *                       type: string
 *                       example: "12450.00"
 *                     totalSubscribers:
 *                       type: integer
 *                       example: 120
 *                     activeSubscribers:
 *                       type: integer
 *                       example: 93
 *                     growth:
 *                       type: string
 *                       example: "12.4%"
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
subscriptionRoute.get(
  "/artist/me/stats",
  AuthMiddleware,
  SubscriptionController.GetMySubscriptionStats
);

/**
 * @swagger
 * /subscription/artist/{artistId}/status:
 *   get:
 *     tags:
 *       - Subscription
 *     security:
 *       - bearerAuth: []
 *     summary: "Vérifier si le fan est abonné à un artiste"
 *     description: >
 *       Retourne l'état d'abonnement du fan connecté pour un artiste donné.
 *       Un abonnement est considéré actif si :
 *       - status = active
 *       - endDate > maintenant
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID de l'artiste"
 *     responses:
 *       200:
 *         description: "Statut d'abonnement récupéré"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription status fetched"
 *                 data:
 *                   type: object
 *                   properties:
 *                     isSubscribed:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: "Non autorisé (fan non authentifié)"
 *       404:
 *         description: "Artiste non trouvé"
 *       500:
 *         description: "Erreur serveur"
 */
subscriptionRoute.get(
  "/artist/:artistId/status",
  AuthMiddleware,
  SubscriptionController.GetSubscriptionStatus
);

/**
 * @swagger
 * /subscription/artist/{artistId}/subscribe:
 *   post:
 *     tags:
 *       - Subscription
 *     security:
 *       - bearerAuth: []
 *     summary: "Souscrire à un artiste"
 *     description: >
 *       Crée une souscription ACTIVE entre le fan connecté et l'artiste.
 *       Si le fan est déjà abonné et que l'abonnement est actif,
 *       la requête ne recrée pas de doublon.
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID de l'artiste"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               months:
 *                 type: integer
 *                 description: "Durée de l'abonnement en mois"
 *                 example: 1
 *               price:
 *                 type: number
 *                 description: "Prix de l'abonnement"
 *                 example: 9.99
 *     responses:
 *       201:
 *         description: "Abonnement créé avec succès"
 *       200:
 *         description: "Fan déjà abonné (aucune modification)"
 *       401:
 *         description: "Non autorisé (fan non authentifié)"
 *       404:
 *         description: "Artiste non trouvé"
 *       500:
 *         description: "Erreur serveur"
 */
subscriptionRoute.post(
  "/artist/:artistId/subscribe",
  AuthMiddleware,
  SubscriptionController.SubscribeToArtist
);

/**
 * @swagger
 * /subscription/artist/{artistId}/unsubscribe:
 *   post:
 *     tags:
 *       - Subscription
 *     security:
 *       - bearerAuth: []
 *     summary: "Se désabonner d'un artiste"
 *     description: >
 *       Annule l'abonnement actif du fan connecté pour l'artiste donné.
 *       L'abonnement est marqué comme annulé (status = cancelled)
 *       et sa date de fin est mise à jour.
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID de l'artiste"
 *     responses:
 *       200:
 *         description: "Abonnement annulé avec succès"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unsubscribed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     isSubscribed:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: "Non autorisé (fan non authentifié)"
 *       404:
 *         description: "Artiste non trouvé"
 *       500:
 *         description: "Erreur serveur"
 */
subscriptionRoute.post(
  "/artist/:artistId/unsubscribe",
  AuthMiddleware,
  SubscriptionController.UnsubscribeFromArtist
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
 * /subscription/user/{userId}/{artistId}:
 *   get:
 *     tags:
 *       - Subscription
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer la souscription d’un utilisateur pour un artiste donné
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur (fan)
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste
 *     responses:
 *       200:
 *         description: Souscription récupérée avec succès
 *       404:
 *         description: Aucune souscription trouvée pour cet utilisateur et cet artiste
 *       500:
 *         description: Erreur serveur lors de la récupération de la souscription
 */
subscriptionRoute.get(
  "/user/:userId/:artistId",
  SubscriptionController.GetSubscriptionByUserAndArtist
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
