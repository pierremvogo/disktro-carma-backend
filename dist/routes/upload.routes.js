"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const multerCloudinary_1 = require("../multerCloudinary");
const uploadRoute = (0, express_1.Router)();
// ────────────── Storages Cloudinary ──────────────
const storageAudio = (0, multerCloudinary_1.createCloudinaryStorage)("audio_song");
const storageVideo = (0, multerCloudinary_1.createCloudinaryStorage)("video_song");
const storageImage = (0, multerCloudinary_1.createCloudinaryStorage)("images");
const storageBraille = (0, multerCloudinary_1.createCloudinaryStorage)("braille_files");
const storageDocument = (0, multerCloudinary_1.createCloudinaryStorage)("document_files");
// ────────────── Middleware Multer ──────────────
const uploadAudio = (0, multer_1.default)({
    storage: storageAudio,
    fileFilter: multerCloudinary_1.audioFileFilter,
}).single("file");
const uploadVideo = (0, multer_1.default)({
    storage: storageVideo,
    fileFilter: multerCloudinary_1.videoFileFilter,
}).single("file");
const uploadImage = (0, multer_1.default)({
    storage: storageImage,
    fileFilter: multerCloudinary_1.imageFileFilter,
}).single("file");
const uploadBraille = (0, multer_1.default)({
    storage: storageBraille,
    fileFilter: multerCloudinary_1.brailleFileFilter,
}).single("file");
const uploadDocument = (0, multer_1.default)({
    storage: storageDocument,
    fileFilter: multerCloudinary_1.documentFileFilter,
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
            resourceType: "audio",
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
            resourceType: "video",
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
            resourceType: "image",
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
            resourceType: "raw",
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
            resourceType: "raw",
            fileName: req.file.filename,
            url: req.file.path, // URL Cloudinary
        });
    });
});
exports.default = uploadRoute;
