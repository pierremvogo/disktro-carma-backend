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
exports.ArtistAdminController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class ArtistAdminController {
}
exports.ArtistAdminController = ArtistAdminController;
_a = ArtistAdminController;
ArtistAdminController.createArtistAdmin = async (req, res, next) => {
    // 1. Vérification de l'existence de l'utilisateur
    const admin = await db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema.users.id, req.params.adminId),
    });
    if (!admin) {
        res.status(404).send({
            message: "User ID not found",
        });
        return;
    }
    // 2. Vérification que l'utilisateur est bien de type "ADMIN"
    if (admin.type !== "ADMIN") {
        res.status(403).send({
            message: "User is not authorized to be an artist admin",
        });
        return;
    }
    // 3. Vérification de l'existence de l'artiste
    const artist = await db_1.db.query.artists.findFirst({
        where: (0, drizzle_orm_1.eq)(schema.artists.id, req.params.artistId),
    });
    if (!artist) {
        res.status(404).send({
            message: "Artist ID not found",
        });
        return;
    }
    // 4. Vérifier si cet artiste a déjà un administrateur (peu importe lequel)
    const existingAdminForArtist = await db_1.db.query.artistAdmins.findFirst({
        where: (0, drizzle_orm_1.eq)(schema.artistAdmins.artistId, req.params.artistId),
    });
    if (existingAdminForArtist) {
        res.status(409).send({
            message: "This artist already has an administrator",
        });
        return;
    }
    // 5. Création de la relation artist-admin
    const artistAdmin = await db_1.db
        .insert(schema.artistAdmins)
        .values({
        artistId: req.params.artistId,
        userId: req.params.adminId,
    })
        .$returningId();
    const createdArtistAdmin = artistAdmin[0];
    if (!createdArtistAdmin) {
        res.status(500).send({
            message: "Failed to create artistAdmin",
        });
        return;
    }
    // 6. Réponse OK
    res.status(200).send({
        artistAdminId: createdArtistAdmin,
        message: "Artist admin created successfully",
    });
};
ArtistAdminController.FindArtistAdminByUserIdAndArtistId = async (req, res, next) => {
    const user = await db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema.users.id, req.params.userId),
    });
    if (!user) {
        res.status(404).send({
            message: "User id is required!",
        });
        return;
    }
    const artist = await db_1.db.query.artists.findFirst({
        where: (0, drizzle_orm_1.eq)(schema.artists.id, req.params.artistId),
    });
    if (!artist) {
        res.status(404).send({
            message: "Artist id is required!",
        });
        return;
    }
    const artistAdmin = await db_1.db.query.artistAdmins.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.artistAdmins.artistId, req.params.artistId), (0, drizzle_orm_1.eq)(schema.artistAdmins.userId, req.params.userId)),
    });
    if (!artistAdmin) {
        res.status(400).send({
            message: "Error ocuured when getting artistAdmin",
        });
        return;
    }
    res.status(200).send(artistAdmin);
};
ArtistAdminController.FindArtistAdminByUserId = async (req, res, next) => {
    const user = await db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema.users.id, req.params.userId),
    });
    if (!user) {
        res.status(404).send({
            message: "User id not Found!",
        });
        return;
    }
    const artistAdmin = await db_1.db.query.artistAdmins.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.artistAdmins.userId, req.params.userId)),
    });
    if (!artistAdmin) {
        res.status(400).send({
            message: "Error ocuured when getting artistAdmin",
        });
        return;
    }
    res.status(200).send(artistAdmin);
};
ArtistAdminController.FindArtistAdminByArtistId = async (req, res, next) => {
    const artist = await db_1.db.query.artists.findFirst({
        where: (0, drizzle_orm_1.eq)(schema.artists.id, req.params.artistId),
    });
    if (!artist) {
        res.status(404).send({
            message: "User id not Found!",
        });
        return;
    }
    const artistAdmin = await db_1.db.query.artistAdmins.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.artistAdmins.artistId, req.params.artistId)),
    });
    if (!artistAdmin) {
        res.status(404).send({
            message: "Error ocuured when getting artistAdmin",
        });
        return;
    }
    res.status(200).send(artistAdmin);
};
ArtistAdminController.FindArtistAdminById = async (req, res, next) => {
    const artistAdmin = await db_1.db.query.artistAdmins.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.artistAdmins.id, req.params.id)),
    });
    if (!artistAdmin) {
        res.status(404).send({
            message: "Error ocuured when getting artistAdmin",
        });
        return;
    }
    res.status(200).send(artistAdmin);
};
