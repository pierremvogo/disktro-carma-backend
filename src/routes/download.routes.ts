import { Router, Request, Response } from "express";
import axios from "axios";
import cloudinary from "../cloudinary";
import { AuthMiddleware } from "../middleware/auth.middleware";

const downloadRoute = Router();

/**
 * Récupère l'URL Cloudinary d'un fichier via son public_id
 */
async function getCloudinaryUrl(publicId: string): Promise<string | null> {
  try {
    const resource = await cloudinary.api.resource(publicId, {
      resource_type: "auto",
    });
    return resource.secure_url;
  } catch (e) {
    return null;
  }
}

/**
 * Stream d'un fichier Cloudinary vers le client
 */
async function streamFromCloudinary(url: string, res: Response): Promise<void> {
  try {
    console.log("URL -------- URL : ", url);
    const cloudRes = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    res.setHeader(
      "Content-Type",
      cloudRes.headers["content-type"] || "application/octet-stream"
    );

    if (cloudRes.headers["content-length"]) {
      res.setHeader("Content-Length", cloudRes.headers["content-length"]);
    }

    cloudRes.data.pipe(res);
  } catch (err) {
    console.error("Stream Cloudinary Error:", err);
    res.status(500).json({ message: "Erreur de lecture Cloudinary" });
  }
}

// ────────────── ROUTES ──────────────

/**
 * @swagger
 * /download/audio/{file}:
 *   get:
 *     tags:
 *       - Download
 *     summary: Télécharger un fichier audio via streaming Cloudinary
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: file
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom du fichier audio à télécharger (public_id Cloudinary)
 *     responses:
 *       200:
 *         description: Fichier audio envoyé avec succès
 *         content:
 *           audio/mpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Fichier introuvable
 *       500:
 *         description: Erreur serveur
 */
downloadRoute.get(
  "/image/:file(*)",
  AuthMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const publicId = req.params.file; // ex: "images/1764267342872-391023650"

    const url = await getCloudinaryUrl(publicId);

    if (!url) {
      res.status(404).json({ message: "Fichier introuvable" });
      return;
    }

    await streamFromCloudinary(url, res);
  }
);

/**
 * @swagger
 * /download/video/{file}:
 *   get:
 *     tags:
 *       - Download
 *     summary: Télécharger un fichier vidéo via streaming Cloudinary
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: file
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom du fichier vidéo à télécharger (public_id Cloudinary)
 *     responses:
 *       200:
 *         description: Fichier vidéo envoyé avec succès
 *         content:
 *           video/mp4:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Fichier introuvable
 *       500:
 *         description: Erreur serveur
 */
downloadRoute.get(
  "/video/:file(*)",
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const publicId = req.params.file;
    const url = await getCloudinaryUrl(publicId);
    if (!url) {
      res.status(404).json({ message: "Fichier introuvable" });
      return; // <- juste return pour sortir de la fonction, pas return res
    }
    await streamFromCloudinary(url, res);
  }
);

/**
 * @swagger
 * /download/image/{file}:
 *   get:
 *     tags:
 *       - Download
 *     summary: Télécharger ou afficher une image via streaming Cloudinary
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: file
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom du fichier image à télécharger (public_id Cloudinary)
 *     responses:
 *       200:
 *         description: Image envoyée avec succès
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Fichier introuvable
 *       500:
 *         description: Erreur serveur
 */
downloadRoute.get(
  "/image/:file(*)",
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const publicId = req.params.file;
    const url = await getCloudinaryUrl(publicId);
    if (!url) {
      res.status(404).json({ message: "Fichier introuvable" });
      return; // <- juste return pour sortir de la fonction, pas return res
    }

    await streamFromCloudinary(url, res);
  }
);

export default downloadRoute;
