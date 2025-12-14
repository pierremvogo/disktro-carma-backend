import { Router } from "express";
import { PayoutSettingsController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";

const payoutRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Payout
 *     description: Configuration des méthodes de paiement pour recevoir les revenus (subscriptions & royalties)
 */

/**
 * @swagger
 * /payout/get/me:
 *   get:
 *     tags:
 *       - Payout
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les méthodes de paiement de l'artiste connecté
 *     description: >
 *       Retourne la configuration des moyens de paiement enregistrée pour l'artiste connecté.
 *       Si aucune configuration n'existe, retourne un objet vide (valeurs null/empty).
 *     responses:
 *       200:
 *         description: Méthodes de paiement récupérées avec succès
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
 *                     bankAccountHolder:
 *                       type: string
 *                       example: "John Doe"
 *                     bankName:
 *                       type: string
 *                       example: "Bank of America"
 *                     accountNumber:
 *                       type: string
 *                       example: "123456789"
 *                     routingNumber:
 *                       type: string
 *                       example: "021000021"
 *                     swiftCode:
 *                       type: string
 *                       example: "BOFAUS3N"
 *                     iban:
 *                       type: string
 *                       example: "GB29NWBK60161331926819"
 *                     paypalEmail:
 *                       type: string
 *                       example: "artist@example.com"
 *                     bizumPhone:
 *                       type: string
 *                       example: "+34 600 000 000"
 *                     mobileMoneyProvider:
 *                       type: string
 *                       example: "MTN"
 *                     mobileMoneyPhone:
 *                       type: string
 *                       example: "+237 6xx xxx xxx"
 *                     orangeMoneyPhone:
 *                       type: string
 *                       example: "+225 00 00 00 00"
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
payoutRoute.get(
  "/get/me",
  AuthMiddleware,
  PayoutSettingsController.GetMyPayoutSettings
);

/**
 * @swagger
 * /payout/create/me:
 *   put:
 *     tags:
 *       - Payout
 *     security:
 *       - bearerAuth: []
 *     summary: Créer ou mettre à jour les méthodes de paiement de l'artiste connecté
 *     description: >
 *       Met à jour les informations de paiement utilisées pour recevoir les revenus
 *       des subscriptions et royalties. L'artisteId est déduit du token (pas depuis le body).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankAccountHolder:
 *                 type: string
 *               bankName:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               routingNumber:
 *                 type: string
 *               swiftCode:
 *                 type: string
 *               iban:
 *                 type: string
 *               paypalEmail:
 *                 type: string
 *               bizumPhone:
 *                 type: string
 *               mobileMoneyProvider:
 *                 type: string
 *               mobileMoneyPhone:
 *                 type: string
 *               orangeMoneyPhone:
 *                 type: string
 *           example:
 *             bankAccountHolder: "John Doe"
 *             bankName: "Bank of Africa"
 *             accountNumber: "123456789"
 *             routingNumber: "021000021"
 *             swiftCode: "BOFAUS3N"
 *             iban: "GB29NWBK60161331926819"
 *             paypalEmail: "artist@example.com"
 *             bizumPhone: "+34 600 000 000"
 *             mobileMoneyProvider: "MTN"
 *             mobileMoneyPhone: "+237 6xx xxx xxx"
 *             orangeMoneyPhone: "+225 00 00 00 00"
 *     responses:
 *       200:
 *         description: Méthodes de paiement mises à jour avec succès
 *       201:
 *         description: Méthodes de paiement créées avec succès
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
payoutRoute.post(
  "/create/me",
  AuthMiddleware,
  PayoutSettingsController.UpsertMyPayoutSettings
);

export default payoutRoute;
