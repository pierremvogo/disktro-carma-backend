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
exports.ArtistTagController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class ArtistTagController {
}
exports.ArtistTagController = ArtistTagController;
_a = ArtistTagController;
ArtistTagController.create = async (req, res, next) => {
    const artist = await db_1.db.query.artists.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.artists.id, req.params.artistId)),
    });
    if (!artist) {
        res.status(400).send({
            message: `Artist not found with id : ${req.params.artistId}`,
        });
        return;
    }
    const tag = await db_1.db.query.tags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.tags.id, req.params.tagId)),
    });
    if (!tag) {
        res.status(400).send({
            message: `Tag not found with id : ${req.params.tagId}`,
        });
        return;
    }
    const artistTags = await db_1.db.query.artistTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.artistTags.artistId, req.params.artistId), (0, drizzle_orm_1.eq)(schema.artistTags.tagId, req.params.tagId)),
    });
    if (artistTags) {
        res.status(404).send({
            message: "ArtistTag Already exist",
        });
        return;
    }
    const artistTag = await db_1.db
        .insert(schema.artistTags)
        .values({
        artistId: req.params.artistId,
        tagId: req.params.tagId,
    })
        .$returningId();
    const createdTag = artistTag[0];
    if (!createdTag) {
        res.status(400).send({
            message: "Error occured when creating artistTag",
        });
        return;
    }
    res.status(200).send(createdTag);
};
ArtistTagController.FindArtistTagByArtistIdAndTagId = async (req, res, next) => {
    const artistTag = await db_1.db.query.artistTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.artistTags.artistId, req.params.artistId), (0, drizzle_orm_1.eq)(schema.artistTags.tagId, req.params.tagId)),
    });
    if (!artistTag) {
        res.status(404).send({
            message: "Not found artistTag",
        });
        return;
    }
    res.status(200).send({ data: artistTag, message: "" });
};
ArtistTagController.FindArtistTagByArtistId = async (req, res, next) => {
    const artistTag = await db_1.db.query.artistTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.artistTags.artistId, req.params.artistId)),
    });
    if (!artistTag) {
        res.status(404).send({
            message: "Not found artistTag",
        });
        return;
    }
    res.status(200).send({ data: artistTag, message: "" });
};
ArtistTagController.FindArtistTagBytagId = async (req, res, next) => {
    const artistTag = await db_1.db.query.artistTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.artistTags.tagId, req.params.tagId)),
    });
    if (!artistTag) {
        res.status(404).send({
            message: "Not found artistTag",
        });
        return;
    }
    res.status(200).send({ data: artistTag, message: "" });
};
ArtistTagController.FindArtistTagById = async (req, res, next) => {
    const artistTag = await db_1.db.query.artistTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.artistTags.id, req.params.id)),
    });
    if (!artistTag) {
        res.status(404).send({
            message: "Not found artistTag",
        });
        return;
    }
    res.status(200).send({ data: artistTag, message: "" });
};
