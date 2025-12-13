import { Router } from "express";
import { RoyaltiesController } from "../controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";

const royaltiesRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Royalties
 *     description: Gestion des royalties (revenus générés par les streams)
 */

/**
 * @swagger
 * /royalties/artist/me/summary:
 *   get:
 *     tags:
 *       - Royalties
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer le résumé des royalties (artiste connecté)
 *     description: >
 *       Retourne un résumé des royalties générées par les streams de l'artiste :
 *       - totalRoyalties (toutes périodes)
 *       - thisMonth (30 derniers jours)
 *       - pending (royalties non encore payées)
 *       - totalStreams
 *       - monthlyStreams
 *       - ratePerStream
 *     responses:
 *       200:
 *         description: Résumé des royalties récupéré avec succès
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
 *                     currency:
 *                       type: string
 *                       example: "EUR"
 *                     ratePerStream:
 *                       type: number
 *                       example: 0.003
 *                     totalStreams:
 *                       type: integer
 *                       example: 12450
 *                     monthlyStreams:
 *                       type: integer
 *                       example: 1320
 *                     totalRoyalties:
 *                       type: string
 *                       example: "37.35"
 *                     thisMonth:
 *                       type: string
 *                       example: "3.96"
 *                     totalPaid:
 *                       type: string
 *                       example: "20.00"
 *                     pending:
 *                       type: string
 *                       example: "17.35"
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
royaltiesRoute.get(
  "/artist/me/summary",
  AuthMiddleware,
  RoyaltiesController.GetMyRoyaltiesSummary
);

/**
 * @swagger
 * /royalties/artist/me/by-track:
 *   get:
 *     tags:
 *       - Royalties
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer les revenus par morceau (artiste connecté)
 *     description: >
 *       Retourne la liste des morceaux de l'artiste avec :
 *       - nombre de streams
 *       - revenus générés par morceau
 *       Les résultats sont triés par nombre de streams décroissant.
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre maximum de morceaux retournés (max 50)
 *     responses:
 *       200:
 *         description: Royalties par morceau récupérées avec succès
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
 *                       trackId:
 *                         type: string
 *                         example: "ZvrF65eo3cJO1-KolhGdv"
 *                       name:
 *                         type: string
 *                         example: "My Hit Song"
 *                       streams:
 *                         type: integer
 *                         example: 4200
 *                       revenue:
 *                         type: string
 *                         example: "12.60"
 *                       currency:
 *                         type: string
 *                         example: "EUR"
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
royaltiesRoute.get(
  "/artist/me/by-track",
  AuthMiddleware,
  RoyaltiesController.GetMyRoyaltiesByTrack
);

export default royaltiesRoute;
