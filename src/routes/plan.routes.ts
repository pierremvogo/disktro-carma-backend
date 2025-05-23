import { Router } from "express";
import { PlanController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";

const planRoute = Router();

/**
 * @swagger
 * /plan/create:
 *   post:
 *     tags:
 *       - Plan
 *     summary: Créer un nouveau plan
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
 *                 type: string
 *               billingCycle:
 *                 type: string
 *             required:
 *               - name
 *               - price
 *               - billingCycle
 *     responses:
 *       201:
 *         description: Plan créé avec succès
 *       400:
 *         description: Requête invalide
 */

planRoute.post("/create", AuthMiddleware, PlanController.create);

/**
 * @swagger
 * /plan/{id}:
 *   get:
 *     tags:
 *       - Plan
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
 */
planRoute.get("/:id", PlanController.FindPlanById);

/**
 * @swagger
 * /plan:
 *   get:
 *     tags:
 *       - Plan
 *     summary: Récupérer tous les plans
 *     responses:
 *       200:
 *         description: Liste des plans
 */
planRoute.get("/", PlanController.GetAllPlans);

/**
 * @swagger
 * /plan/update/{id}:
 *   put:
 *     tags:
 *       - Plan
 *     summary: Mettre à jour un plan
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
 *                 type: string
 *               billingCycle:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plan mis à jour
 *       404:
 *         description: Plan non trouvé
 */
planRoute.put("/update/:id", PlanController.UpdatePlan);

/**
 * @swagger
 * /plan/delete/{id}:
 *   delete:
 *     tags:
 *       - Plan
 *     summary: Supprimer un plan
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
 *       404:
 *         description: Plan non trouvé
 */
planRoute.delete("/delete/:id", PlanController.DeletePlan);

planRoute.put("/plans/:id", PlanController.UpdatePlan);
planRoute.delete("/plans/:id", PlanController.DeletePlan);

export default planRoute;
