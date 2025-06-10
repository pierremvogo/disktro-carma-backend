import { Router } from "express";
import * as fs from "fs";
import path from "path";

const downloadRoute = Router();

/**
 * @swagger
 * /download/audio/{file}:
 *   get:
 *     tags:
 *       - Download
 *     summary: Télécharger un fichier audio
 *     parameters:
 *       - in: path
 *         name: file
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom du fichier audio à télécharger
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
 */

/**
 * @swagger
 * /download/video/{file}:
 *   get:
 *     tags:
 *       - Download
 *     summary: Télécharger un fichier vidéo
 *     parameters:
 *       - in: path
 *         name: file
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom du fichier vidéo à télécharger
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
 */

/**
 * @swagger
 * /download/image/{file}:
 *   get:
 *     tags:
 *       - Download
 *     summary: Télécharger une image
 *     parameters:
 *       - in: path
 *         name: file
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom du fichier image à télécharger
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
 */

downloadRoute.get("/image/:file", (req, res) => {
  const address = path.join(__dirname, `../public/images/${req.params.file}`);
  fs.access(address, (err) => {
    if (err) {
      console.log(err);
      res.status(404).json({
        message: "Fichier introuvable",
      });
      return;
    }
    res.sendFile(address);
  });
});

downloadRoute.get("/audio/:file", (req, res) => {
  const address = path.join(
    __dirname,
    `../public/audio_song/${req.params.file}`
  );
  fs.access(address, (err) => {
    if (err) {
      res.status(404).json({
        message: "Fichier introuvable",
      });
      return;
    }
    res.sendFile(address);
  });
});

downloadRoute.get("/video/:file", (req, res) => {
  const address = path.join(
    __dirname,
    `../public/video_song/${req.params.file}`
  );
  fs.access(address, (err) => {
    if (err) {
      console.log(err);
      res.status(404).json({
        message: "Fichier introuvable",
      });
      return;
    }
    res.sendFile(address);
  });
});

export default downloadRoute;
