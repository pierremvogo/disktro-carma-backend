import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

// Extensions → MIME types
const mimeTypes = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  flac: "audio/flac",
  mp4: "video/mp4",
  mov: "video/quicktime",
};

// Générateur de storage selon dossier Cloudinary
export const createCloudinaryStorage = (folder: string) =>
  new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const ext = file.originalname.split(".").pop()?.toLowerCase() || "bin";
      return {
        folder,
        resource_type: "auto", // IMPORTANT pour audio / vidéo
        format: ext,
        public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      };
    },
  });

// Filtres personnalisés
export const audioFileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  const allowed = ["mp3", "wav", "flac"];
  const ext = file.originalname.split(".").pop()?.toLowerCase();
  allowed.includes(ext!)
    ? cb(null, true)
    : cb(new Error("Format de fichier audio invalide"));
};

export const videoFileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  const allowed = ["mp4", "mov"];
  const ext = file.originalname.split(".").pop()?.toLowerCase();
  allowed.includes(ext!)
    ? cb(null, true)
    : cb(new Error("Format de fichier vidéo invalide"));
};

export const imageFileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  const allowed = ["jpg", "jpeg", "png", "webp"];
  const ext = file.originalname.split(".").pop()?.toLowerCase();
  allowed.includes(ext!)
    ? cb(null, true)
    : cb(new Error("Format de fichier image invalide"));
};

export const brailleFileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  const allowed = ["brf", "brl", "txt"]; // extensions braille autorisées
  const ext = file.originalname.split(".").pop()?.toLowerCase();

  if (!ext || !allowed.includes(ext)) {
    return cb(
      new Error(
        "Format de fichier braille invalide (.brf .brl .txt uniquement)"
      )
    );
  }

  cb(null, true);
};

export const documentFileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  const allowed = ["txt"]; // extensions document autorisées
  const ext = file.originalname.split(".").pop()?.toLowerCase();

  if (!ext || !allowed.includes(ext)) {
    return cb(new Error("Format de document invalide (.txt uniquement)"));
  }

  cb(null, true);
};
