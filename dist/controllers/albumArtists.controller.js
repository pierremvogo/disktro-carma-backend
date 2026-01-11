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
exports.AlbumArtistController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class AlbumArtistController {
}
exports.AlbumArtistController = AlbumArtistController;
_a = AlbumArtistController;
AlbumArtistController.createAlbumArtist = async (req, res, next) => {
    const artist = await db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.users.id, req.params.userId)),
    });
    if (!artist) {
        res.status(400).send({
            message: `Artist not found with id : ${req.params.userId}`,
        });
        return;
    }
    const album = await db_1.db.query.albums.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.albums.id, req.params.albumId)),
    });
    if (!album) {
        res.status(404).send({
            message: `Album not found with id : ${req.params.albumId}`,
        });
        return;
    }
    const albumArtists = await db_1.db.query.albumArtists.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.albumArtists.artistId, req.params.userId), (0, drizzle_orm_1.eq)(schema.albumArtists.albumId, req.params.albumId)),
    });
    if (albumArtists) {
        res.status(404).send({
            message: "AlbumArtist Already exist !",
        });
        return;
    }
    const albumArtist = await db_1.db
        .insert(schema.albumArtists)
        .values({
        artistId: req.params.userId,
        albumId: req.params.albumId,
    })
        .$returningId();
    const createdAlbumArtist = albumArtist[0];
    if (!createdAlbumArtist) {
        res.status(404).send({
            message: "Error occured when creating albumArtist",
        });
    }
    res.status(200).send({
        message: "Album successfuly associated to artist",
        data: createdAlbumArtist,
    });
};
AlbumArtistController.FindAlbumArtistByArtistIdAndAlbumId = async (req, res, next) => {
    const albumArtist = await db_1.db.query.albumArtists.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.albumArtists.artistId, req.params.artistId), (0, drizzle_orm_1.eq)(schema.albumArtists.albumId, req.params.albumId)),
    });
    if (!albumArtist) {
        res.status(404).send({
            message: "This artist is not associated with this album.",
        });
    }
    res.status(200).send(albumArtist);
};
AlbumArtistController.FindAlbumArtistByArtistId = async (req, res, next) => {
    const albumArtist = await db_1.db.query.albumArtists.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.albumArtists.artistId, req.params.artistId)),
    });
    if (!albumArtist) {
        res.status(404).send({
            message: "Error occured when getting album Artist by artistId",
        });
    }
    res.status(200).send(albumArtist);
};
AlbumArtistController.FindAlbumArtistByAlbumId = async (req, res, next) => {
    const albumArtist = await db_1.db.query.albumArtists.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.albumArtists.albumId, req.params.albumId)),
    });
    if (!albumArtist) {
        res.status(404).send({
            message: "Error occured when getting album Artist by albumId",
        });
        return;
    }
    res.status(200).send(albumArtist);
};
AlbumArtistController.FindAlbumArtistById = async (req, res, next) => {
    const albumArtist = await db_1.db.query.albumArtists.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.albumArtists.id, req.params.id)),
    });
    if (!albumArtist) {
        res.status(404).send({
            message: "Error occured when getting album Artist by albumId",
        });
    }
    res.status(200).send(albumArtist);
};
