import { Router, Request, Response } from "express";
import axios from "axios";
import cloudinary from "../cloudinary";
import { AuthMiddleware } from "../middleware/auth.middleware";

const downloadRoute = Router();

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

async function streamFromCloudinary(url: string, res: Response): Promise<void> {
  try {
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

/**
 * @swagger
 * /download/audio/{file}:
 *   get:
 *     tags:
 *       - Download
 *     security:
 *       - bearerAuth: []
 *     summary: Télécharger un fichier audio via streaming Cloudinary
 */
downloadRoute.get(
  "/audio/:file",
  AuthMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const publicId = req.params.file;

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
 *     security:
 *       - bearerAuth: []
 *     summary: Télécharger un fichier vidéo via streaming Cloudinary
 */
downloadRoute.get(
  "/video/:file",
  AuthMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const publicId = req.params.file;

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
 * /download/image/{file}:
 *   get:
 *     tags:
 *       - Download
 *     security:
 *       - bearerAuth: []
 *     summary: Télécharger ou afficher une image via streaming Cloudinary
 */
downloadRoute.get(
  "/image/:file",
  AuthMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const publicId = req.params.file;

    const url = await getCloudinaryUrl(publicId);
    if (!url) {
      res.status(404).json({ message: "Fichier introuvable" });
      return;
    }

    await streamFromCloudinary(url, res);
  }
);

export default downloadRoute;
