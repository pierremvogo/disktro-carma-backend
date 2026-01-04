import { Router } from "express";
import multer from "multer";

import {
  createCloudinaryStorage,
  audioFileFilter,
  videoFileFilter,
  imageFileFilter,
  brailleFileFilter,
  documentFileFilter,
} from "../multerCloudinary";

const uploadRoute = Router();

// ────────────── Storages Cloudinary ──────────────
const storageAudio = createCloudinaryStorage("audio_song");
const storageVideo = createCloudinaryStorage("video_song");
const storageImage = createCloudinaryStorage("images");
const storageBraille = createCloudinaryStorage("braille_files");
const storageDocument = createCloudinaryStorage("document_files");

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

const uploadBraille = multer({
  storage: storageBraille,
  fileFilter: brailleFileFilter,
}).single("file");

const uploadDocument = multer({
  storage: storageDocument,
  fileFilter: documentFileFilter,
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
uploadRoute.post("/audio", (req, res) => {
  uploadAudio(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(400).json({ message: err.message });
    }
    if (!req.file)
      return res.status(400).json({ message: "Aucun fichier audio reçu" });

    res.status(200).json({
      message: "Audio uploadée avec succès",
      publicId: (req.file as any).public_id,
      ressourceType: (req.file as any).ressource_type,
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
uploadRoute.post("/video", (req, res) => {
  uploadVideo(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(400).json({ message: err.message });
    }
    if (!req.file)
      return res.status(400).json({ message: "Aucun fichier vidéo reçu" });

    res.status(200).json({
      message: "Vidéo uploadée avec succès",
      publicId: (req.file as any).public_id,
      ressourceType: (req.file as any).ressource_type,
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
uploadRoute.post("/image", (req, res) => {
  uploadImage(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(400).json({ message: err.message });
    }
    if (!req.file)
      return res.status(400).json({ message: "Aucun fichier image reçu" });
    console.log("REQ FILE : ", req.file);
    res.status(200).json({
      message: "Image uploadée avec succès",
      publicId: (req.file as any).public_id,
      ressourceType: (req.file as any).ressource_type,
      fileName: req.file.filename,
      url: req.file.path,
    });
  });
});

/**
 * @swagger
 * /upload/braille:
 *   post:
 *     summary: Upload d'un fichier braille (paroles accessibles)
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
 *         description: Fichier braille uploadé avec succès
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
uploadRoute.post("/braille", (req, res) => {
  uploadBraille(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(400).json({ message: err.message });
    }
    if (!req.file)
      return res.status(400).json({ message: "Aucun fichier braille reçu" });

    res.status(200).json({
      message: "Fichier braille uploadé avec succès",
      publicId: (req.file as any).public_id,
      ressourceType: (req.file as any).ressource_type,
      fileName: req.file.filename,
      url: req.file.path, // URL Cloudinary
    });
  });
});

/**
 * @swagger
 * /upload/document:
 *   post:
 *     summary: Upload d'un document
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
 *         description: Document uploadé avec succès
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
uploadRoute.post("/document", (req, res) => {
  uploadDocument(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(400).json({ message: err.message });
    }
    if (!req.file)
      return res.status(400).json({ message: "Aucun  document reçu" });

    res.status(200).json({
      message: "Document uploadé avec succès",
      publicId: (req.file as any).public_id,
      ressourceType: (req.file as any).ressource_type,
      fileName: req.file.filename,
      url: req.file.path, // URL Cloudinary
    });
  });
});

export default uploadRoute;
