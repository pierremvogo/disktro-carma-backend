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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExclusiveContentController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class ExclusiveContentController {
}
exports.ExclusiveContentController = ExclusiveContentController;
_a = ExclusiveContentController;
/**
 * ✅ CREATE exclusive content (metadata only)
 * Le front upload le fichier (Cloudinary/S3) et envoie fileUrl ici.
 */
ExclusiveContentController.Create = async (req, res) => {
    try {
        // 🔐 ID de l'utilisateur connecté (via AuthMiddleware)
        const artistId = req.user?.id;
        if (!artistId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const { type, title, description, fileUrl } = req.body;
        if (!type || !title || !fileUrl) {
            res.status(400).send({
                message: "type, title and fileUrl are required.",
            });
            return;
        }
        // 1️⃣ Vérifier que l'utilisateur existe et est un ARTISTE
        const artist = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, artistId),
            columns: { id: true, type: true },
        });
        if (!artist) {
            res.status(404).send({ message: "User not found." });
            return;
        }
        if (artist.type !== "artist") {
            res.status(403).send({
                message: "Only artists can create exclusive content.",
            });
            return;
        }
        // 2️⃣ Valider le type de contenu
        const allowedTypes = ["music", "video", "photo", "document"];
        if (!allowedTypes.includes(type)) {
            res.status(400).send({
                message: `Invalid type. Allowed types: ${allowedTypes.join(", ")}`,
            });
            return;
        }
        // 3️⃣ Créer le contenu exclusif
        const inserted = await db_1.db
            .insert(schema.exclusiveContents)
            .values({
            artistId,
            type,
            title,
            description: description ?? null,
            fileUrl,
        })
            .$returningId();
        const created = inserted[0];
        if (!created) {
            res.status(400).send({
                message: "Error while creating exclusive content.",
            });
            return;
        }
        res.status(200).send({
            message: "Exclusive content created successfully",
            data: created,
        });
    }
    catch (err) {
        console.error("Error creating exclusive content:", err);
        res.status(500).send({
            message: err,
        });
    }
};
/**
 * ✅ GET ALL exclusive contents (admin / debug)
 */
ExclusiveContentController.FindAll = async (req, res, next) => {
    try {
        const all = await db_1.db.query.exclusiveContents.findMany({
            orderBy: [(0, drizzle_orm_1.desc)(schema.exclusiveContents.createdAt)],
        });
        if (all.length === 0) {
            res.status(200).send({
                message: "No exclusive content found",
                data: [],
            });
            return;
        }
        res.status(200).send({
            message: "Successfully get all exclusive contents",
            data: all,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error: ${err}`,
        });
    }
};
/**
 * ✅ GET exclusive content by id
 */
ExclusiveContentController.FindById = async (req, res, next) => {
    try {
        const result = await db_1.db.query.exclusiveContents.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.exclusiveContents.id, req.params.id),
        });
        if (!result) {
            res.status(404).send({
                message: `No exclusive content found with id ${req.params.id}.`,
            });
            return;
        }
        res.status(200).send({
            message: "Successfully get exclusive content by id",
            data: result,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error: ${err}`,
        });
    }
};
/**
 * ✅ GET exclusive contents by artistId
 */
ExclusiveContentController.FindByArtistId = async (req, res, next) => {
    try {
        const artistId = req.params.artistId;
        // 1️⃣ Vérifier que l'artiste existe
        const artist = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, artistId),
            columns: { id: true },
        });
        if (!artist) {
            res.status(404).send({ message: "Artist not found with given ID." });
            return;
        }
        const items = await db_1.db.query.exclusiveContents.findMany({
            where: (0, drizzle_orm_1.eq)(schema.exclusiveContents.artistId, artistId),
            orderBy: [(0, drizzle_orm_1.desc)(schema.exclusiveContents.createdAt)],
        });
        res.status(200).send({
            message: "Successfully retrieved exclusive contents for this artist.",
            contents: items,
        });
    }
    catch (err) {
        console.error("Error retrieving exclusive contents:", err);
        res.status(500).send({ message: err });
    }
};
/**
 * ✅ UPDATE exclusive content
 * (ex: titre/description/type/fileUrl)
 */
ExclusiveContentController.Update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { title, description, type, fileUrl } = req.body;
        const existing = await db_1.db.query.exclusiveContents.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.exclusiveContents.id, id),
        });
        if (!existing) {
            res.status(404).send({ message: "Exclusive content not found." });
            return;
        }
        // whitelist type si fourni
        if (type) {
            const allowedTypes = ["music", "video", "photo", "document"];
            if (!allowedTypes.includes(type)) {
                res.status(400).send({
                    message: `Invalid type. Allowed: ${allowedTypes.join(", ")}`,
                });
                return;
            }
        }
        await db_1.db
            .update(schema.exclusiveContents)
            .set({
            title: title ?? existing.title,
            description: description ?? existing.description,
            type: type ?? existing.type,
            fileUrl: fileUrl ?? existing.fileUrl,
        })
            .where((0, drizzle_orm_1.eq)(schema.exclusiveContents.id, id));
        const updated = await db_1.db.query.exclusiveContents.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.exclusiveContents.id, id),
        });
        res.status(200).send({
            message: "Exclusive content updated successfully.",
            data: updated,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: `Internal server error: ${err}` });
    }
};
/**
 * ✅ DELETE exclusive content
 */
ExclusiveContentController.Delete = async (req, res, next) => {
    try {
        const id = req.params.id;
        const existing = await db_1.db.query.exclusiveContents.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.exclusiveContents.id, id),
        });
        if (!existing) {
            res.status(404).send({ message: "Exclusive content not found." });
            return;
        }
        await db_1.db
            .delete(schema.exclusiveContents)
            .where((0, drizzle_orm_1.eq)(schema.exclusiveContents.id, id));
        res.status(200).send({
            message: "Exclusive content deleted successfully.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: `Internal server error: ${err}` });
    }
};
/**
 * ✅ DELETE content by artistId + contentId (protection)
 * Optionnel : plus sûr pour éviter qu’un artiste supprime le contenu d’un autre.
 */
ExclusiveContentController.DeleteByArtist = async (req, res, next) => {
    try {
        const { artistId, id } = req.params;
        const existing = await db_1.db.query.exclusiveContents.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.exclusiveContents.id, id), (0, drizzle_orm_1.eq)(schema.exclusiveContents.artistId, artistId)),
        });
        if (!existing) {
            res.status(404).send({ message: "Exclusive content not found." });
            return;
        }
        await db_1.db
            .delete(schema.exclusiveContents)
            .where((0, drizzle_orm_1.eq)(schema.exclusiveContents.id, id));
        res.status(200).send({
            message: "Exclusive content deleted successfully.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: `Internal server error: ${err}` });
    }
};
