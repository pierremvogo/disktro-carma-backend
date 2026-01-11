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
exports.AlbumTagController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class AlbumTagController {
}
exports.AlbumTagController = AlbumTagController;
_a = AlbumTagController;
AlbumTagController.createAlbumTag = async (req, res, next) => {
    const album = await db_1.db.query.albums.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.albums.id, req.params.albumId)),
    });
    if (!album) {
        res.status(400).send({
            message: `Album not found with id : ${req.params.albumId}`,
        });
        return;
    }
    const tag = await db_1.db.query.tags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.tags.id, req.params.tagId)),
    });
    if (!tag) {
        res.status(404).send({
            message: `Tag not found with id : ${req.params.tagId}`,
        });
        return;
    }
    const albumTags = await db_1.db.query.albumTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.albumTags.tagId, req.params.tagId), (0, drizzle_orm_1.eq)(schema.albumTags.albumId, req.params.albumId)),
    });
    if (albumTags) {
        res.status(404).send({
            message: "AlbumTag Already exist !",
        });
        return;
    }
    const albumTag = await db_1.db
        .insert(schema.albumTags)
        .values({
        tagId: req.params.tagId,
        albumId: req.params.albumId,
    })
        .$returningId();
    const createdAlbumTag = albumTag[0];
    if (!createdAlbumTag) {
        res.status(400).send({
            message: "Some Error occured when creating albumTag",
        });
    }
    res.status(200).send({
        message: "Tag successfully associated with album",
        data: createdAlbumTag,
    });
};
AlbumTagController.FindAlbumTagByAlbumIdAndTagId = async (req, res, next) => {
    const albumTag = await db_1.db.query.albumTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.albumTags.albumId, req.params.albumId), (0, drizzle_orm_1.eq)(schema.albumTags.tagId, req.params.tagId)),
    });
    if (!albumTag) {
        res.status(400).send({
            message: "Error occured when getting album Tag by albumId and tagId",
        });
    }
    res.status(200).send(albumTag);
};
AlbumTagController.FindAlbumTagByAlbumId = async (req, res, next) => {
    const albumTag = await db_1.db.query.albumTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.albumTags.albumId, req.params.albumId)),
    });
    if (!albumTag) {
        res.status(400).send({
            message: "Error occured when getting album Tag by albumId",
        });
    }
    res.status(200).send(albumTag);
};
AlbumTagController.FindAlbumTagByTagId = async (req, res, next) => {
    const albumTag = await db_1.db.query.albumTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.albumTags.tagId, req.params.tagId)),
    });
    if (!albumTag) {
        res.status(400).send({
            message: "Error occured when getting album Tag by tagId",
        });
    }
    res.status(200).send(albumTag);
};
AlbumTagController.FindAlbumTagById = async (req, res, next) => {
    const albumTag = await db_1.db.query.albumTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.albumTags.id, req.params.id)),
    });
    if (!albumTag) {
        res.status(400).send({
            message: "Error occured when getting album Tag by Id",
        });
    }
    res.status(200).send(albumTag);
};
