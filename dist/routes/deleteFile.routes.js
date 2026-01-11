"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importStar(require("fs"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const cloudinary_1 = __importDefault(require("../cloudinary"));
const deleteFileRoute = (0, express_1.Router)();
/**
 * Fonction utilitaire pour supprimer un fichier du serveur
 */
const deleteFile = async (folder, filename, res, type) => {
    const filePath = path_1.default.join(__dirname, `../public/${folder}`, filename);
    console.log("FILE PATH TO DELETE: ", filePath);
    try {
        // Vérifie si le fichier existe
        await fs_1.promises.access(filePath, fs_1.default.constants.F_OK);
        // Supprime le fichier
        await fs_1.promises.unlink(filePath);
        res.status(200).json({
            message: `${type} supprimé avec succès : ${filename}`,
        });
    }
    catch (err) {
        if (err.code === "ENOENT") {
            res.status(404).json({ message: `${type} introuvable` });
            console.error(err);
        }
        else {
            console.error(err);
            res
                .status(500)
                .json({ message: `Erreur lors de la suppression du ${type}` });
        }
    }
};
/**
 * Supprime n'importe quel fichier sur Cloudinary
 */
const deleteCloudinaryFile = async (publicId, res, type, resourceType) => {
    console.log("CLOUDINARY DELETE:", { publicId, resourceType });
    try {
        const result = await cloudinary_1.default.uploader.destroy(publicId, {
            resource_type: resourceType,
        });
        if (result.result === "not found") {
            return res.status(404).json({
                message: `${type} introuvable`,
            });
        }
        if (result.result !== "ok") {
            throw new Error(`Cloudinary error: ${result.result}`);
        }
        return res.status(200).json({
            message: `${type} supprimé avec succès`,
            publicId,
        });
    }
    catch (error) {
        console.error("Cloudinary delete error:", error);
        return res.status(500).json({
            message: `Erreur lors de la suppression du ${type}`,
        });
    }
};
// ===============================
// 🗑️ ROUTES DELETE
// ===============================
/**
 * @swagger
 * /delete/local/audio/{filename}:
 *   delete:
 *     summary: Supprimer un fichier audio
 *     tags: [Delete]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom du fichier audio à supprimer
 *     responses:
 *       200:
 *         description: Fichier audio supprimé avec succès
 *       404:
 *         description: Fichier introuvable
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
deleteFileRoute.delete("/local/audio/:filename", auth_middleware_1.AuthMiddleware, async (req, res) => {
    await deleteFile("audio_song", req.params.filename, res, "Fichier audio");
});
/**
 * @swagger
 * /delete/local/video/{filename}:
 *   delete:
 *     summary: Supprimer un fichier vidéo
 *     tags: [Delete]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom du fichier vidéo à supprimer
 *     responses:
 *       200:
 *         description: Fichier vidéo supprimé avec succès
 *       404:
 *         description: Fichier introuvable
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
deleteFileRoute.delete("/local/video/:filename", auth_middleware_1.AuthMiddleware, async (req, res) => {
    await deleteFile("video_song", req.params.filename, res, "Fichier vidéo");
});
/**
 * @swagger
 * /delete/local/image/{filename}:
 *   delete:
 *     summary: Supprimer une image
 *     tags: [Delete]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom de l'image à supprimer
 *     responses:
 *       200:
 *         description: Image supprimée avec succès
 *       404:
 *         description: Image introuvable
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
deleteFileRoute.delete("/local/image/:filename", auth_middleware_1.AuthMiddleware, async (req, res) => {
    await deleteFile("images", req.params.filename, res, "Image");
});
/**
 * @swagger
 * /delete/cloud/audio/{publicId}:
 *   delete:
 *     summary: Supprimer un fichier audio (Cloudinary)
 *     tags: [Delete]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *         description: Public ID Cloudinary du fichier audio à supprimer
 *     responses:
 *       200:
 *         description: Fichier audio supprimé avec succès
 *       404:
 *         description: Fichier audio introuvable
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
deleteFileRoute.delete("/cloud/audio/:publicId(*)", auth_middleware_1.AuthMiddleware, async (req, res) => {
    await deleteCloudinaryFile(req.params.publicId, res, "Fichier audio", "video");
});
/**
 * @swagger
 * /delete/cloud/video/{publicId}:
 *   delete:
 *     summary: Supprimer un fichier vidéo (Cloudinary)
 *     tags: [Delete]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *         description: Public ID Cloudinary du fichier vidéo à supprimer
 *     responses:
 *       200:
 *         description: Fichier vidéo supprimé avec succès
 *       404:
 *         description: Fichier vidéo introuvable
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
deleteFileRoute.delete("/cloud/video/:publicId(*)", auth_middleware_1.AuthMiddleware, async (req, res) => {
    await deleteCloudinaryFile(req.params.publicId, res, "Fichier vidéo", "video");
});
/**
 * @swagger
 * /delete/cloud/image/{publicId}:
 *   delete:
 *     summary: Supprimer une image (Cloudinary)
 *     tags: [Delete]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *         description: Public ID Cloudinary de l'image à supprimer
 *     responses:
 *       200:
 *         description: Image supprimée avec succès
 *       404:
 *         description: Image introuvable
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
deleteFileRoute.delete("/cloud/image/:publicId(*)", auth_middleware_1.AuthMiddleware, async (req, res) => {
    await deleteCloudinaryFile(req.params.publicId, res, "Fichier Image", "image");
});
/**
 * @swagger
 * /delete/cloud/raw/{publicId}:
 *   delete:
 *     summary: Supprimer un fichier (PDF, TXT, Braille, ZIP...) sur Cloudinary
 *     tags: [Delete]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *         description: Public ID Cloudinary du fichier à supprimer
 *     responses:
 *       200:
 *         description: Fichier supprimé avec succès
 *       404:
 *         description: Fichier introuvable
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
deleteFileRoute.delete("/cloud/raw/:publicId(*)", auth_middleware_1.AuthMiddleware, async (req, res) => {
    await deleteCloudinaryFile(req.params.publicId, res, "Fichier Brut", "raw");
});
exports.default = deleteFileRoute;
