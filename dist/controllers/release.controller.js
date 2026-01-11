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
exports.ReleaseController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
const drizzle_orm_2 = require("drizzle-orm"); // nécessaire pour les requêtes brutes comme LOWER()
class ReleaseController {
}
exports.ReleaseController = ReleaseController;
_a = ReleaseController;
ReleaseController.createRelease = async (req, res, next) => {
    const { artistId, title } = req.body;
    // Vérifie si l'artiste existe
    const artist = await db_1.db.query.artists.findFirst({
        where: (0, drizzle_orm_1.eq)(schema.artists.id, artistId),
    });
    if (!artist) {
        res.status(404).send({
            message: "Artist ID does not exist",
        });
        return;
    }
    // Vérifie si une release avec le même titre (insensible à la casse) existe pour cet artiste
    const existingRelease = await db_1.db.query.release.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.release.artistId, artistId), (0, drizzle_orm_2.sql) `LOWER(${schema.release.title}) = LOWER(${title})`),
    });
    if (existingRelease) {
        res.status(409).send({
            message: "This artist already has a release with the same title (case-insensitive)",
        });
        return;
    }
    // Création de la nouvelle release
    const release = await db_1.db
        .insert(schema.release)
        .values({
        artistId,
        title,
        releaseDate: req.body.releaseDate,
        description: req.body.description,
        coverArt: req.body.coverArt,
        label: req.body.label,
        releaseType: req.body.releaseType,
        format: req.body.format,
        upcCode: req.body.upcCode,
    })
        .$returningId();
    const createdRelease = release[0];
    if (!createdRelease) {
        res.status(400).send({
            message: "Error occurred when creating release",
        });
        return;
    }
    res.status(200).send({
        message: "Release created successfully",
        data: createdRelease,
    });
};
ReleaseController.updateRelease = async (req, res, next) => {
    try {
        const releaseId = req.params.id;
        // Vérifie si la release existe
        const existingRelease = await db_1.db.query.release.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.release.id, releaseId),
        });
        if (!existingRelease) {
            res.status(404).send({ message: "Release not found" });
            return;
        }
        // Si artistId est présent, on vérifie qu'il existe aussi
        if (req.body.artistId) {
            const artist = await db_1.db.query.artists.findFirst({
                where: (0, drizzle_orm_1.eq)(schema.artists.id, req.body.artistId),
            });
            if (!artist) {
                res.status(404).send({ message: "Artist ID does not exist" });
                return;
            }
        }
        // Met à jour les champs de la release
        await db_1.db
            .update(schema.release)
            .set({
            ...req.body,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema.release.id, releaseId));
        res.status(200).send({ message: "Release updated successfully" });
    }
    catch (error) {
        next(error);
    }
};
ReleaseController.deleteRelease = async (req, res, next) => {
    try {
        const releaseId = req.params.id;
        const existingRelease = await db_1.db.query.release.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.release.id, releaseId),
        });
        if (!existingRelease) {
            res.status(404).send({ message: "Release not found" });
            return;
        }
        await db_1.db.delete(schema.release).where((0, drizzle_orm_1.eq)(schema.release.id, releaseId));
        res.status(200).send({ message: "Release deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
ReleaseController.FindReleaseById = async (req, res, next) => {
    try {
        // 1. Récupération de la release seule
        const release = await db_1.db.query.release.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.release.id, req.params.releaseId),
        });
        if (!release) {
            res.status(404).send({
                message: `Release not found with Id: ${req.params.releaseId}`,
            });
            return;
        }
        // 2. Récupération des trackReleases liés à cette release
        const trackReleases = await db_1.db.query.trackReleases.findMany({
            where: (0, drizzle_orm_1.eq)(schema.trackReleases.releaseId, release.id),
        });
        // 3. Récupération des tracks à partir des trackIds
        const trackIds = trackReleases.map((tr) => tr.trackId);
        let tracks = [];
        if (trackIds.length > 0) {
            tracks = await db_1.db.query.tracks.findMany({
                where: (0, drizzle_orm_1.inArray)(schema.tracks.id, trackIds),
            });
        }
        // 4. Assemblage de la réponse
        const releaseWithTracks = {
            ...release,
            tracks,
        };
        res.status(200).send({
            message: "Release retrieved successfully",
            data: releaseWithTracks,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error" });
    }
};
ReleaseController.getAllReleases = async (req, res, next) => {
    try {
        const releases = await db_1.db.query.release.findMany();
        res.status(200).send({
            message: "All releases fetched successfully",
            data: releases,
        });
    }
    catch (error) {
        next(error);
    }
};
