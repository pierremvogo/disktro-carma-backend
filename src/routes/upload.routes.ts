import { Router, Request } from "express";
import multer from "multer";
import path from "path";
import { AuthMiddleware } from "../middleware/auth.middleware";

const uploadRoute = Router();

// Configuration Multer

// Stockage sur disque dans le dossier correspondant, avec nom de fichier unique
const storageAudio = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/audio_song"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const storageVideo = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/video_song"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const storageImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Filtres fichiers
const audioFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExt = ["mp3", "wav", "flac"];
  const ext = file.originalname.split(".").pop()?.toLowerCase();
  if (ext && allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Format de fichier audio invalide"));
  }
};

const videoFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExt = ["mp4", "mov"];
  const ext = file.originalname.split(".").pop()?.toLowerCase();
  if (ext && allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Format de fichier vidéo invalide"));
  }
};

const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExt = ["jpg", "jpeg", "png", "webp"];
  const ext = file.originalname.split(".").pop()?.toLowerCase();
  if (ext && allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Format de fichier image invalide"));
  }
};

// Middleware Multer
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
 *                 url:
 *                   type: string
 *       400:
 *         description: Format de fichier invalide
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
uploadRoute.post("/audio", AuthMiddleware, (req, res, next) => {
  uploadAudio(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        res.status(400).json({ message: err.message });
        return;
      }
      res.status(400).json({ message: err.message });
      return;
    }
    if (!req.file) {
      res.status(400).json({ message: "Aucun fichier audio reçu" });
      return;
    }

    res.status(200).json({
      message: "Audio song enregistrée avec succès",
      fileName: req.file.filename,
      url: `/download/audio/${req.file.filename}`,
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
 *         description: Vidéo uploadée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: Format de fichier invalide
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
uploadRoute.post("/video", AuthMiddleware, (req, res, next) => {
  uploadVideo(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        res.status(400).json({ message: err.message });
        return;
      }
      res.status(400).json({ message: err.message });
      return;
    }
    if (!req.file) {
      res.status(400).json({ message: "Aucun fichier vidéo reçu" });
      return;
    }

    res.status(200).json({
      message: "Vidéo enregistrée avec succès",
      fileName: req.file.filename,
      url: `/download/video/${req.file.filename}`,
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
 *                 url:
 *                   type: string
 *       400:
 *         description: Format de fichier invalide
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
uploadRoute.post("/image", AuthMiddleware, (req, res, next) => {
  uploadImage(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        res.status(400).json({ message: err.message });
        return;
      }
      res.status(400).json({ message: err.message });
      return;
    }
    if (!req.file) {
      res.status(400).json({ message: "Aucun fichier image reçu" });
      return;
    }

    res.status(200).json({
      message: "Image enregistrée avec succès",
      fileName: req.file.filename,
      url: `/download/image/${req.file.filename}`,
    });
  });
});

export default uploadRoute;
