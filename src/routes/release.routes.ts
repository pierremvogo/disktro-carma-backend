import { Router } from "express";
import { ReleaseController } from "../controllers";
const releaseRoute = Router();

/**
 * @swagger
 * /release/create:
 *   post:
 *     tags:
 *       - Release
 *     summary: Créer une nouvelle release
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               artistId:
 *                 type: string
 *                 default: ""
 *               title:
 *                 type: string
 *                 default: ""
 *               releaseDate:
 *                 type: string
 *               description:
 *                 type: string
 *               coverArt:
 *                 type: string
 *               label:
 *                 type: string
 *               releaseType:
 *                 type: string
 *               format:
 *                 type: string
 *               upcCode:
 *                 type: string
 *             required:
 *               - artistId
 *               - title
 *               - releaseDate
 *               - format
 *               - upcCode
 *     responses:
 *       201:
 *         description: Release créée avec succès
 *       400:
 *         description: Requête invalide
 */

/**
 * @swagger
 * /release/getById/{releaseId}:
 *   get:
 *     tags:
 *       - Release
 *     summary: Récupérer une release par son ID
 *     parameters:
 *       - in: path
 *         name: releaseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la release
 *     responses:
 *       200:
 *         description: Release trouvée
 *       404:
 *         description: Release non trouvée
 */

/**
 * @swagger
 * /release/package:
 *   post:
 *     tags:
 *       - Release
 *     summary: Créer un package d'assets pour une release (upload des fichiers)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               releaseData:
 *                 type: string
 *                 format: json
 *                 description: Données JSON de la release
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Fichiers uploadés
 *     responses:
 *       200:
 *         description: Package de la release créé avec succès
 *       500:
 *         description: Erreur lors de la création du package
 */

/**
 * @swagger
 * /release/prepare:
 *   post:
 *     tags:
 *       - Release
 *     summary: Préparer et valider une release avant envoi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReleaseData'
 *     responses:
 *       200:
 *         description: Release préparée et validée
 *       400:
 *         description: Erreur de validation
 */

/**
 * @swagger
 * /release/send/ftp:
 *   post:
 *     tags:
 *       - Release
 *     summary: Envoyer la release à un DSP via FTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               releaseId:
 *                 type: string
 *                 description: ID de la release à envoyer
 *               ftpConfig:
 *                 type: object
 *                 description: Configuration FTP (hôte, utilisateur, mot de passe, etc.)
 *     responses:
 *       200:
 *         description: Envoi FTP réussi
 *       500:
 *         description: Erreur lors de l'envoi FTP
 */

/**
 * @swagger
 * /release/send/api:
 *   post:
 *     tags:
 *       - Release
 *     summary: Envoyer la release à un DSP via API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               releaseId:
 *                 type: string
 *                 description: ID de la release à envoyer
 *               apiConfig:
 *                 type: object
 *                 description: Configuration API (endpoint, token, etc.)
 *     responses:
 *       200:
 *         description: Envoi API réussi
 *       500:
 *         description: Erreur lors de l'envoi API
 */

/**
 * @swagger
 * /release/ack:
 *   post:
 *     tags:
 *       - Release
 *     summary: Gérer l'ACK et la notification de la release
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               releaseId:
 *                 type: string
 *               status:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: ACK reçu et traité
 *       400:
 *         description: Requête invalide
 */

/**
 * @swagger
 * /release/sales-report:
 *   post:
 *     tags:
 *       - Release
 *     summary: Analyser et intégrer un rapport de vente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               releaseId:
 *                 type: string
 *               reportData:
 *                 type: object
 *                 description: Données du rapport de vente
 *     responses:
 *       200:
 *         description: Rapport de vente intégré avec succès
 *       400:
 *         description: Erreur dans le rapport ou intégration
 */

releaseRoute.post("/create", ReleaseController.createRelease);

releaseRoute.get("/getById/:releaseId", ReleaseController.FindReleaseById);

releaseRoute.post("/package", ReleaseController.CreateReleasePackage);

// Route pour préparer et valider une release
releaseRoute.post("/prepare", ReleaseController.PrepareAndValidateRelease);

// Route pour envoyer la release à un DSP via FTP
releaseRoute.post("/send/ftp", ReleaseController.SendReleaseFromFTP);

// Route pour envoyer la release à un DSP via API
releaseRoute.post("/send/api", ReleaseController.SendReleaseFromAPI);

// Route pour gérer l'ACK et la notification
releaseRoute.post("/ack", ReleaseController.ACKNotification);

// Route pour analyser et intégrer un rapport de vente
releaseRoute.post("/sales-report", ReleaseController.SalesReport);

export default releaseRoute;
