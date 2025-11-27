import { Router } from "express";
import multer from "multer";
import { AuthMiddleware } from "../middleware/auth.middleware";

import {
  createCloudinaryStorage,
  audioFileFilter,
  videoFileFilter,
  imageFileFilter,
} from "../multerCloudinary";

const uploadRoute = Router();

// ────────────── Storages Cloudinary ──────────────
const storageAudio = createCloudinaryStorage("audio_song");
const storageVideo = createCloudinaryStorage("video_song");
const storageImage = createCloudinaryStorage("images");

// ────────────── Middleware Multer ──────────────
const uploadAudio = multer({
  storage: storageAudio,
  fileFilter: audioFileFilter,
}).single("file");

const uploadVideo = multer({
  storage: storageVideo,
  fileFilter: videoFileFilter,
}).single("file");

const uploadImage = multer({
  storage: storageImage,
  fileFilter: imageFileFilter,
}).single("file");

// ────────────── ROUTES ──────────────

/**
 * @swagger
 * /upload/audio:
 *   post:
 *     summary: Upload d'un fichier audio
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Fichier audio uploadé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 fileName:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: Format de fichier invalide ou aucun fichier reçu
 *       401:
 *         description: Non autorisé
 */
uploadRoute.post("/audio", AuthMiddleware, (req, res) => {
  uploadAudio(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file)
      return res.status(400).json({ message: "Aucun fichier audio reçu" });

    res.status(200).json({
      message: "Audio uploadée avec succès",
      fileName: req.file.filename,
      url: req.file.path, // URL Cloudinary
    });
  });
});

/**
 * @swagger
 * /upload/video:
 *   post:
 *     summary: Upload d'un fichier vidéo
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Fichier vidéo uploadé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 fileName:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: Format de fichier invalide ou aucun fichier reçu
 *       401:
 *         description: Non autorisé
 */
uploadRoute.post("/video", AuthMiddleware, (req, res) => {
  uploadVideo(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file)
      return res.status(400).json({ message: "Aucun fichier vidéo reçu" });

    res.status(200).json({
      message: "Vidéo uploadée avec succès",
      fileName: req.file.filename,
      url: req.file.path,
    });
  });
});

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload d'un fichier image
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploadée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 fileName:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: Format de fichier invalide ou aucun fichier reçu
 *       401:
 *         description: Non autorisé
 */
uploadRoute.post("/image", AuthMiddleware, (req, res) => {
  uploadImage(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file)
      return res.status(400).json({ message: "Aucun fichier image reçu" });

    res.status(200).json({
      message: "Image uploadée avec succès",
      fileName: req.file.filename,
      url: req.file.path,
    });
  });
});

export default uploadRoute;
