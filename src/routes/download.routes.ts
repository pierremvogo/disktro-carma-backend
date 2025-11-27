import { Router, Request, Response } from "express";
import axios from "axios";
import { AuthMiddleware } from "../middleware/auth.middleware";

const downloadRoute = Router();

/* ------------------------------------------------------------------
   CACHE SERVEUR (en RAM)
-------------------------------------------------------------------*/

type CachedFile = {
  headers: Record<string, string>;
  buffer: Buffer;
  timestamp: number;
};

const cache = new Map<string, CachedFile>();

// Durée de vie des fichiers dans le cache: 10 minutes
const CACHE_TTL = 10 * 60 * 1000;

/**
 * Vérifie si le fichier est en cache et encore valide
 */
function getFromCache(url: string): CachedFile | null {
  const cached = cache.get(url);
  if (!cached) return null;

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
async function streamWithCache(url: string, res: Response): Promise<void> {
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
    const cloudRes = await axios({
      url,
      method: "GET",
      responseType: "arraybuffer", // On récupère tout en buffer
    });

    const headers: Record<string, string> = {
      "Content-Type":
        cloudRes.headers["content-type"] || "application/octet-stream",
      "Content-Length":
        cloudRes.headers["content-length"] || String(cloudRes.data.length),
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
  } catch (err) {
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
downloadRoute.get(
  "/image",
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const fileUrl = req.query.url as string;

    if (!fileUrl) {
      res.status(400).json({ message: "Aucune URL fournie" });
      return;
    }
    if (!fileUrl.startsWith("https://res.cloudinary.com/")) {
      res.status(400).json({ message: "URL Cloudinary invalide" });
      return;
    }

    await streamWithCache(fileUrl, res);
  }
);

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
 *         description: Vidéo envoyée
 *         content:
 *           video/mp4:
 *             schema:
 *               type: string
 *               format: binary
 */
downloadRoute.get(
  "/video",
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const fileUrl = req.query.url as string;

    if (!fileUrl) {
      res.status(400).json({ message: "Aucune URL fournie" });
      return;
    }
    if (!fileUrl.startsWith("https://res.cloudinary.com/")) {
      res.status(400).json({ message: "URL Cloudinary invalide" });
      return;
    }

    await streamWithCache(fileUrl, res);
  }
);

/**
 * @swagger
 * /download/audio:
 *   get:
 *     tags:
 *       - Download
 *     summary: Télécharger un audio via son URL Cloudinary (avec cache serveur)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: URL Cloudinary complète du fichier audio
 */
downloadRoute.get(
  "/audio",
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const fileUrl = req.query.url as string;

    if (!fileUrl) {
      res.status(400).json({ message: "Aucune URL fournie" });
      return;
    }
    if (!fileUrl.startsWith("https://res.cloudinary.com/")) {
      res.status(400).json({ message: "URL Cloudinary invalide" });
      return;
    }

    await streamWithCache(fileUrl, res);
  }
);

export default downloadRoute;
