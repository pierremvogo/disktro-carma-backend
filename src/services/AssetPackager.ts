import fs from "fs";
import path from "path";
import { ReleaseData } from "../models/release.model";

class AssetPackager {
  /**
   * Prépare les assets d'une release : copie les fichiers dans un dossier dédié et génère un fichier metadata.json
   * @param releaseData - Données de la release (titre, upc, artiste, etc.)
   * @param files - Liste des fichiers uploadés via Multer
   * @returns Le chemin absolu vers le dossier contenant les assets de la release
   */
  static packageRelease(
    releaseData: ReleaseData,
    files: Express.Multer.File[]
  ): string {
    // 📂 Dossier de destination : /uploads/{upc}/
    const releaseFolder = path.join(
      __dirname,
      "../../uploads/",
      releaseData.upcCode
    );

    // 📦 Créer le dossier si il n'existe pas encore
    if (!fs.existsSync(releaseFolder)) {
      fs.mkdirSync(releaseFolder, { recursive: true });
    }

    // 📥 Copier chaque fichier uploadé dans le dossier de la release
    files.forEach((file) => {
      const destPath = path.join(releaseFolder, file.originalname);
      fs.renameSync(file.path, destPath);
    });

    // 📝 Créer un fichier metadata.json avec les infos de la release
    const metadataPath = path.join(releaseFolder, "metadata.json");
    fs.writeFileSync(
      metadataPath,
      JSON.stringify(releaseData, null, 2),
      "utf-8"
    );

    console.log(`✅ Assets packagés dans : ${releaseFolder}`);

    // 🔄 Retourner le chemin du dossier
    return releaseFolder;
  }
}

export default AssetPackager;
