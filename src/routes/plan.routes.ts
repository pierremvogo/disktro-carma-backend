import { Router } from "express";
import { PlanController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";

const planRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Plan
 *     description: Gestion des plans d'abonnement
 */

/**
 * @swagger
 * /plan/create:
 *   post:
 *     tags:
 *       - Plan
 *     security:
 *       - bearerAuth: []
 *     summary: Créer un nouveau plan d'abonnement (artiste connecté)
 *     description: >
 *       Crée un plan pour l'artiste authentifié. Le backend déduit artistId depuis le token.
 *       billingCycle doit être monthly | quarterly | annual.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               currency:
 *                 type: string
 *                 example: "EUR"
 *               billingCycle:
 *                 type: string
 *                 enum: [monthly, quarterly, annual]
 *               active:
 *                 type: boolean
 *             required:
 *               - name
 *               - price
 *               - billingCycle
 *             example:
 *               name: "Monthly"
 *               description: "Monthly subscription"
 *               price: 9.99
 *               currency: "EUR"
 *               billingCycle: "monthly"
 *               active: true
 *     responses:
 *       201:
 *         description: Plan créé avec succès
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Seul un artiste peut créer des plans
 *       409:
 *         description: Un plan existe déjà pour ce billingCycle
 */
planRoute.post("/create", AuthMiddleware, PlanController.create);

/**
 * @swagger
 * /plan/artist/me:
 *   get:
 *     tags:
 *       - Plan
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les plans de l'artiste connecté
 *     responses:
 *       200:
 *         description: Plans de l'artiste récupérés
 *       401:
 *         description: Non autorisé
 */
planRoute.get("/artist/me", AuthMiddleware, PlanController.FindMyPlans);

/**
 * @swagger
 * /plan:
 *   get:
 *     tags:
 *       - Plan
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer tous les plans (admin/debug)
 *     responses:
 *       200:
 *         description: Liste des plans
 *       401:
 *         description: Non autorisé
 */
planRoute.get("/", AuthMiddleware, PlanController.FindPlans);
/**
 * @swagger
 * /plan/artist/me/pricing:
 *   post:
 *     tags:
 *       - Plan
 *     security:
 *       - bearerAuth: []
 *     summary: Définir le pricing des abonnements (monthly / quarterly / annual)
 *     description: >
 *       Permet à l'artiste connecté de définir le prix mensuel.
 *       Le backend calcule automatiquement :
 *       - quarterly = monthly × 4
 *       - annual = monthly × 12
 *       et crée ou met à jour les 3 plans correspondants.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monthlyPrice:
 *                 type: number
 *                 minimum: 0
 *                 example: 9.99
 *             required:
 *               - monthlyPrice
 *     responses:
 *       200:
 *         description: Pricing mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     monthlyPrice:
 *                       type: string
 *                       example: "9.99"
 *                     quarterlyPrice:
 *                       type: string
 *                       example: "39.96"
 *                     annualPrice:
 *                       type: string
 *                       example: "119.88"
 *                     currency:
 *                       type: string
 *                       example: "EUR"
 *       400:
 *         description: Prix invalide
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Seul un artiste peut définir le pricing
 *       500:
 *         description: Erreur serveur
 */
planRoute.post(
  "/artist/me/pricing",
  AuthMiddleware,
  PlanController.UpsertMyPricing
);

/**
 * @swagger
 * /plan/artist/{artistId}:
 *   get:
 *     tags:
 *       - Plan
 *     security:
 *       - bearerAuth: []
 *     summary: "Récupérer les plans d'un artiste (côté fan)"
 *     description: |
 *       Retourne la liste des plans d'abonnement disponibles pour un artiste donné.
 *       Utile côté fan pour afficher les options (monthly / quarterly / annual) avant Stripe Checkout.
 *       Par défaut, seuls les plans actifs sont retournés (activeOnly=true).
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID de l'artiste (users.id)"
 *         example: "yNPh-HluZ69rg8RA_qOi-"
 *       - in: query
 *         name: activeOnly
 *         required: false
 *         schema:
 *           type: boolean
 *           default: true
 *         description: "Si true, retourne uniquement les plans actifs"
 *         example: true
 *     responses:
 *       200:
 *         description: "Plans de l'artiste récupérés"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Plans fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "mghjVw2SOXnDPoucf8wpw"
 *                       artistId:
 *                         type: string
 *                         example: "yNPh-HluZ69rg8RA_qOi-"
 *                       name:
 *                         type: string
 *                         example: "Monthly"
 *                       description:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       price:
 *                         type: string
 *                         example: "0.05"
 *                       currency:
 *                         type: string
 *                         example: "EUR"
 *                       billingCycle:
 *                         type: string
 *                         enum: [monthly, quarterly, annual]
 *                         example: "monthly"
 *                       active:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         example: "2025-12-21T20:48:34.000Z"
 *                       updatedAt:
 *                         type: string
 *                         example: "2025-12-21T20:48:34.000Z"
 *       400:
 *         description: "artistId manquant"
 *       401:
 *         description: "Non autorisé"
 *       403:
 *         description: "User is not an artist"
 *       404:
 *         description: "Artiste introuvable"
 *       500:
 *         description: "Erreur serveur"
 */
planRoute.get(
  "/artist/:artistId",
  AuthMiddleware, // si tu veux token obligatoire côté fan, sinon enlève
  PlanController.FindPlansByArtistId
);

/**
 * @swagger
 * /plan/{id}:
 *   get:
 *     tags:
 *       - Plan
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer un plan par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du plan
 *     responses:
 *       200:
 *         description: Plan trouvé
 *       404:
 *         description: Plan non trouvé
 *       401:
 *         description: Non autorisé
 */
planRoute.get("/:id", AuthMiddleware, PlanController.FindPlanById);

/**
 * @swagger
 * /plan/update/{id}:
 *   put:
 *     tags:
 *       - Plan
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour un plan (artiste propriétaire uniquement)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               currency:
 *                 type: string
 *               billingCycle:
 *                 type: string
 *                 enum: [monthly, quarterly, annual]
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Plan mis à jour
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Forbidden (pas le propriétaire)
 *       404:
 *         description: Plan non trouvé
 *       409:
 *         description: Conflit (un plan existe déjà pour ce billingCycle)
 */
planRoute.put("/update/:id", AuthMiddleware, PlanController.UpdatePlan);

/**
 * @swagger
 * /plan/delete/{id}:
 *   delete:
 *     tags:
 *       - Plan
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un plan (artiste propriétaire uniquement)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du plan
 *     responses:
 *       200:
 *         description: Plan supprimé
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Forbidden (pas le propriétaire)
 *       404:
 *         description: Plan non trouvé
 */
planRoute.delete("/delete/:id", AuthMiddleware, PlanController.DeletePlan);

export default planRoute;
