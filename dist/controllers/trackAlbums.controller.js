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
exports.TrackAlbumController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class TrackAlbumController {
}
exports.TrackAlbumController = TrackAlbumController;
_a = TrackAlbumController;
TrackAlbumController.createTrackAlbum = async (req, res, next) => {
    const album = await db_1.db.query.albums.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.albums.id, req.params.albumId)),
    });
    if (!album) {
        res.status(400).send({
            message: `Album not found with id : ${req.params.albumId}`,
        });
        return;
    }
    const track = await db_1.db.query.tracks.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.tracks.id, req.params.trackId)),
    });
    if (!track) {
        res.status(404).send({
            message: `Track not found with id : ${req.params.trackId}`,
        });
        return;
    }
    const trackAlbums = await db_1.db.query.trackAlbums.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackAlbums.trackId, req.params.trackId), (0, drizzle_orm_1.eq)(schema.trackAlbums.albumId, req.params.albumId)),
    });
    if (trackAlbums) {
        res.status(404).send({
            message: "TrackAlbum Already exist !",
        });
        return;
    }
    const trackAlbum = await db_1.db
        .insert(schema.trackAlbums)
        .values({
        albumId: req.params.albumId,
        trackId: req.params.trackId,
    })
        .$returningId();
    const createdTrackAlbum = trackAlbum[0];
    if (!createdTrackAlbum) {
        res.status(400).send({
            message: "Some Error occured when creating Track Album",
        });
    }
    res.status(200).send(createdTrackAlbum);
};
TrackAlbumController.FindTrackAlbumByTrackIdAndAlbumId = async (req, res, next) => {
    const trackAlbum = await db_1.db.query.trackAlbums.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackAlbums.albumId, req.params.albumId), (0, drizzle_orm_1.eq)(schema.trackAlbums.trackId, req.params.trackId)),
    });
    if (!trackAlbum) {
        res.status(400).send({
            message: "Error occured when getting Track Album by trackId and albumId",
        });
    }
    res.status(200).send(trackAlbum);
};
TrackAlbumController.FindTrackAlbumByTrackId = async (req, res, next) => {
    const trackAlbum = await db_1.db.query.trackAlbums.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackAlbums.trackId, req.params.trackId)),
    });
    if (!trackAlbum) {
        res.status(400).send({
            message: "Error occured when getting Track Album by trackId",
        });
    }
    res.status(200).send(trackAlbum);
};
TrackAlbumController.FindTrackAlbumByAlbumId = async (req, res, next) => {
    const trackAlbum = await db_1.db.query.trackAlbums.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackAlbums.albumId, req.params.albumId)),
    });
    if (!trackAlbum) {
        res.status(400).send({
            message: "Error occured when getting Track Album by albumId",
        });
    }
    res.status(200).send(trackAlbum);
};
TrackAlbumController.FindTrackAlbumById = async (req, res, next) => {
    const trackAlbum = await db_1.db.query.trackAlbums.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackAlbums.id, req.params.id)),
    });
    if (!trackAlbum) {
        res.status(400).send({
            message: "Error occured when getting Track Album by id",
        });
    }
    res.status(200).send(trackAlbum);
};
