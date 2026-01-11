"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentFileFilter = exports.brailleFileFilter = exports.imageFileFilter = exports.videoFileFilter = exports.audioFileFilter = exports.createCloudinaryStorage = void 0;
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("./cloudinary"));
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
const createCloudinaryStorage = (folder) => new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
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
exports.createCloudinaryStorage = createCloudinaryStorage;
// Filtres personnalisés
const audioFileFilter = (req, file, cb) => {
    const allowed = ["mp3", "wav", "flac"];
    const ext = file.originalname.split(".").pop()?.toLowerCase();
    allowed.includes(ext)
        ? cb(null, true)
        : cb(new Error("Format de fichier audio invalide"));
};
exports.audioFileFilter = audioFileFilter;
const videoFileFilter = (req, file, cb) => {
    const allowed = ["mp4", "mov"];
    const ext = file.originalname.split(".").pop()?.toLowerCase();
    allowed.includes(ext)
        ? cb(null, true)
        : cb(new Error("Format de fichier vidéo invalide"));
};
exports.videoFileFilter = videoFileFilter;
const imageFileFilter = (req, file, cb) => {
    const allowed = ["jpg", "jpeg", "png", "webp"];
    const ext = file.originalname.split(".").pop()?.toLowerCase();
    allowed.includes(ext)
        ? cb(null, true)
        : cb(new Error("Format de fichier image invalide"));
};
exports.imageFileFilter = imageFileFilter;
const brailleFileFilter = (req, file, cb) => {
    const allowed = ["brf", "brl", "txt"]; // extensions braille autorisées
    const ext = file.originalname.split(".").pop()?.toLowerCase();
    if (!ext || !allowed.includes(ext)) {
        return cb(new Error("Format de fichier braille invalide (.brf .brl .txt uniquement)"));
    }
    cb(null, true);
};
exports.brailleFileFilter = brailleFileFilter;
const documentFileFilter = (req, file, cb) => {
    const allowed = ["txt"]; // extensions document autorisées
    const ext = file.originalname.split(".").pop()?.toLowerCase();
    if (!ext || !allowed.includes(ext)) {
        return cb(new Error("Format de document invalide (.txt uniquement)"));
    }
    cb(null, true);
};
exports.documentFileFilter = documentFileFilter;
