"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const downloadRoute = (0, express_1.Router)();
const cache = new Map();
// Durée de vie des fichiers dans le cache: 10 minutes
const CACHE_TTL = 10 * 60 * 1000;
/**
 * Vérifie si le fichier est en cache et encore valide
 */
function getFromCache(url) {
    const cached = cache.get(url);
    if (!cached)
        return null;
    const isExpired = Date.now() - cached.timestamp > CACHE_TTL;
    if (isExpired) {
        cache.delete(url);
        return null;
    }
    return cached;
}
/**
 * Stream Cloudinary OU cache → vers client
 */
async function streamWithCache(url, res) {
    // ----- 1️⃣ Vérifier si le fichier est en cache
    const cached = getFromCache(url);
    if (cached) {
        console.log("➡️ Chargé depuis le cache :", url);
        // Appliquer les headers
        Object.entries(cached.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
        // Envoyer le contenu
        res.send(cached.buffer);
        return;
    }
    // ----- 2️⃣ Sinon → téléchargement depuis Cloudinary
    console.log("⬇️ Téléchargement Cloudinary :", url);
    try {
        const cloudRes = await (0, axios_1.default)({
            url,
            method: "GET",
            responseType: "arraybuffer", // On récupère tout en buffer
        });
        const headers = {
            "Content-Type": cloudRes.headers["content-type"] || "application/octet-stream",
            "Content-Length": cloudRes.headers["content-length"] || String(cloudRes.data.length),
        };
        // Stockage dans le cache
        cache.set(url, {
            headers,
            buffer: Buffer.from(cloudRes.data),
            timestamp: Date.now(),
        });
        // Appliquer les headers
        Object.entries(headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
        // Envoyer le fichier
        res.send(Buffer.from(cloudRes.data));
    }
    catch (err) {
        console.error("Erreur Cloudinary :", err);
        res.status(500).json({ message: "Erreur de lecture Cloudinary" });
    }
}
/* ------------------------------------------------------------------
   ROUTES SÉPARÉES — IMAGE / VIDEO / AUDIO
-------------------------------------------------------------------*/
/**
 * @swagger
 * /download/image:
 *   get:
 *     tags:
 *       - Download
 *     summary: Télécharger ou afficher une image via son URL Cloudinary (avec cache serveur)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: URL Cloudinary complète de l'image
 *     responses:
 *       200:
 *         description: Image envoyée avec succès
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: URL invalide ou manquante
 *       500:
 *         description: Erreur serveur
 */
downloadRoute.get("/image", async (req, res) => {
    const fileUrl = req.query.url;
    if (!fileUrl) {
        res.status(400).json({ message: "Aucune URL fournie" });
        return;
    }
    if (!fileUrl.startsWith("https://res.cloudinary.com/")) {
        res.status(400).json({ message: "URL Cloudinary invalide" });
        return;
    }
    await streamWithCache(fileUrl, res);
});
/**
 * @swagger
 * /download/video:
 *   get:
 *     tags:
 *       - Download
 *     summary: Télécharger une vidéo via son URL Cloudinary (avec cache serveur)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: URL Cloudinary complète de la vidéo
 *     responses:
 *       200:
 *         description: Vidéo envoyée avec succès
 *         content:
 *           video/mp4:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: URL invalide ou manquante
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur ou Cloudinary
 */
downloadRoute.get("/video", async (req, res) => {
    const fileUrl = req.query.url;
    if (!fileUrl) {
        res.status(400).json({ message: "Aucune URL fournie" });
        return;
    }
    if (!fileUrl.startsWith("https://res.cloudinary.com/")) {
        res.status(400).json({ message: "URL Cloudinary invalide" });
        return;
    }
    await streamWithCache(fileUrl, res);
});
/**
 * @swagger
 * /download/audio:
 *   get:
 *     tags:
 *       - Download
 *     summary: Télécharger un fichier audio via son URL Cloudinary (avec cache serveur)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: URL Cloudinary complète du fichier audio
 *     responses:
 *       200:
 *         description: Audio envoyé avec succès
 *         content:
 *           audio/mpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: URL invalide ou manquante
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur ou Cloudinary
 */
downloadRoute.get("/audio", async (req, res) => {
    const fileUrl = req.query.url;
    if (!fileUrl) {
        res.status(400).json({ message: "Aucune URL fournie" });
        return;
    }
    if (!fileUrl.startsWith("https://res.cloudinary.com/")) {
        res.status(400).json({ message: "URL Cloudinary invalide" });
        return;
    }
    await streamWithCache(fileUrl, res);
});
exports.default = downloadRoute;
