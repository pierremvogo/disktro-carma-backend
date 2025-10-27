import { Router } from "express";
import path from "path";
import fs, { promises as fsPromises } from "fs";
import { AuthMiddleware } from "../middleware/auth.middleware";

const deleteFileRoute = Router();

/**
 * Fonction utilitaire pour supprimer un fichier du serveur
 */
const deleteFile = async (
  folder: string,
  filename: string,
  res: any,
  type: string
) => {
  const filePath = path.join(__dirname, `../public/${folder}`, filename);
  console.log("FILE PATH TO DELETE: ", filePath);
  try {
    // Vérifie si le fichier existe
    await fsPromises.access(filePath, fs.constants.F_OK);

    // Supprime le fichier
    await fsPromises.unlink(filePath);

    res.status(200).json({
      message: `${type} supprimé avec succès : ${filename}`,
    });
  } catch (err: any) {
    if (err.code === "ENOENT") {
      res.status(404).json({ message: `${type} introuvable` });
      console.error(err);
    } else {
      console.error(err);
      res
        .status(500)
        .json({ message: `Erreur lors de la suppression du ${type}` });
    }
  }
};

// ===============================
// 🗑️ ROUTES DELETE
// ===============================

/**
 * @swagger
 * /delete/audio/{filename}:
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
deleteFileRoute.delete("/audio/:filename", AuthMiddleware, async (req, res) => {
  await deleteFile("audio_song", req.params.filename, res, "Fichier audio");
});

/**
 * @swagger
 * /delete/video/{filename}:
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
deleteFileRoute.delete("/video/:filename", AuthMiddleware, async (req, res) => {
  await deleteFile("video_song", req.params.filename, res, "Fichier vidéo");
});

/**
 * @swagger
 * /delete/image/{filename}:
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
deleteFileRoute.delete("/image/:filename", AuthMiddleware, async (req, res) => {
  await deleteFile("images", req.params.filename, res, "Image");
});

export default deleteFileRoute;
