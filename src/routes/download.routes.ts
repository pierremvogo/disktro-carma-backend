import { Router } from "express";
import * as fs from 'fs';
import path from "path";


const downloadRoute = Router();


downloadRoute.get("/audio/:file", (req, res) => {
  const address = path.join(__dirname, `../public/audio/${req.params.file}`);
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
  const address = path.join(__dirname, `../public/video/${req.params.file}`);
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
