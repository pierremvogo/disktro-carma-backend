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
 *                 default: "khD5cxGkiXKfp4_xQmvj4"
 *               title:
 *                 type: string
 *                 default: "Ocean Dreams"
 *               releaseDate:
 *                 type: string
 *                 default: "2025-06-01"
 *               description:
 *                 type: string
 *                 default: "A soothing single inspired by the sea."
 *               coverArt:
 *                 type: string
 *                 default: "https://example.com/covers/ocean-dreams.jpg"
 *               label:
 *                 type: string
 *                 default: "Wave Records"
 *               releaseType:
 *                 type: string
 *                 default: "single"
 *               format:
 *                 type: string
 *                 default: "digital"
 *               upcCode:
 *                 type: string
 *                 default: "123456789012"
 *             required:
 *               - artistId
 *               - title
 *               - releaseDate
 *               - format
 *               - upcCode
 *             example:
 *                artistId: "khD5cxGkiXKfp4_xQmvj4"
 *                title: "Ocean Dreams"
 *                releaseDate: "2025-06-01"
 *                description: "A soothing single inspired by the sea."
 *                coverArt: "https://example.com/covers/ocean-dreams.jpg"
 *                label: "Wave Records"
 *                releaseType: "single"
 *                format: "digital"
 *                upcCode: "123456789012"
 *
 *     responses:
 *       201:
 *         description: Release créée avec succès
 *       400:
 *         description: Requête invalide
 */

/**
 * @swagger
 * /release/update/{id}:
 *   put:
 *     tags:
 *       - Release
 *     summary: Mettre à jour une release existante
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la release à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               artistId:
 *                 type: string
 *               title:
 *                 type: string
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
 *             example:
 *               title: "Ocean Dreams (Remastered)"
 *               description: "Updated version with higher quality"
 *               label: "Wave Records Intl."
 *               format: "vinyl"
 *     responses:
 *       200:
 *         description: Release mise à jour avec succès
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Release non trouvée
 */

/**
 * @swagger
 * /release/delete/{id}:
 *   delete:
 *     tags:
 *       - Release
 *     summary: Supprimer une release par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la release à supprimer
 *     responses:
 *       200:
 *         description: Release supprimée avec succès
 *       404:
 *         description: Release non trouvée
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
 * /release/all:
 *   get:
 *     tags:
 *       - Release
 *     summary: Récupérer toutes les releases
 *     description: Retourne la liste complète des releases disponibles en base de données.
 *     responses:
 *       200:
 *         description: Liste des releases récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All releases fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Release'
 *       500:
 *         description: Erreur interne du serveur
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
releaseRoute.put("/update/:id", ReleaseController.updateRelease);
releaseRoute.delete("/delete/:id", ReleaseController.deleteRelease);
releaseRoute.get("/all", ReleaseController.getAllReleases);
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
