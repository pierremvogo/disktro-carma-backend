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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
const slugify_1 = __importDefault(require("slugify"));
class TagController {
}
exports.TagController = TagController;
_a = TagController;
TagController.Create = async (req, res, next) => {
    const tagSlug = (0, slugify_1.default)(req.body.name, { lower: true, strict: true });
    const existingTag = await db_1.db.query.tags.findFirst({
        where: (0, drizzle_orm_1.eq)(schema.tags.slug, tagSlug),
    });
    if (existingTag) {
        res.status(409).json({ message: "An tag with this name already exists" });
        return;
    }
    const result = await db_1.db
        .insert(schema.tags)
        .values({
        name: req.body.name,
        slug: tagSlug,
    })
        .$returningId();
    const createdTag = result[0];
    if (!createdTag) {
        res.status(400).send({
            message: "Error while creating Tag!",
        });
        return;
    }
    res.status(200).send({
        message: "Successfuly created Tag",
        data: createdTag,
    });
};
TagController.FindAllTags = async (req, res, next) => {
    const allTags = await db_1.db.query.tags.findMany({
        columns: {
            id: true,
            name: true,
            slug: true,
        },
    });
    if (!allTags) {
        res.status(400).send({
            message: "Some error occurred: No Tags found",
        });
        return;
    }
    res.status(200).send({
        data: allTags,
        message: "Successfully get all tags",
    });
};
TagController.FindTagById = async (req, res, next) => {
    try {
        if (req.params.id == null) {
            res.status(400).send({
                message: "No tag ID given.!",
            });
            return;
        }
        const result = await db_1.db.query.tags.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.tags.id, req.params.id),
            with: {
                albumTags: {
                    with: {
                        album: true,
                    },
                },
                artistTags: {
                    with: {
                        artist: true,
                    },
                },
                trackTags: {
                    with: {
                        track: true,
                    },
                },
            },
        });
        if (!result) {
            res.status(400).send({
                message: `no tag with id ${req.params.id} found`,
            });
            return;
        }
        const tag = { ...result };
        if (tag == null) {
            res.status(400).send({
                message: `no tag with id ${req.params.id} found`,
            });
            return;
        }
        else {
            tag.albums = result?.albumTags.map((at) => at.album);
            tag.artists = result?.artistTags.map((at) => at.artist);
            tag.tracks = result?.trackTags.map((st) => st.track);
            delete tag.artistTags;
            delete tag.albumTags;
            delete tag.trackTags;
            res.status(200).send({
                message: `Successfuly get tag`,
                data: tag,
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error`,
        });
    }
};
TagController.FindTagBySlug = async (req, res, next) => {
    try {
        if (req.params.slug == "") {
            res.status(400).send({
                message: `No tag slug given.`,
            });
            return;
        }
        console.log(req.params.slug);
        const tagBySlug = await db_1.db.query.tags.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.tags.slug, req.params.slug),
        });
        if (!tagBySlug) {
            res.status(404).send({
                message: `Tag by slug not found`,
            });
            return;
        }
        res.status(200).send({
            message: `Successfuly find tag by slug.`,
            data: tagBySlug,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server Error.`,
        });
    }
};
TagController.FindTagAlbums = async (req, res, next) => {
    let limit = 4;
    const albumTags = await db_1.db.query.albumTags.findMany({
        where: (0, drizzle_orm_1.eq)(schema.albumTags.tagId, req.params.tagId),
        limit,
        with: {
            album: true,
        },
    });
    const tagAlbums = albumTags.map((ct) => ct.album);
    if (albumTags.length === 0) {
        res.status(400).send({
            message: `No album Tag Found`,
        });
        return;
    }
    res.status(200).send({
        message: `Successfuly find  album by tag.`,
        data: tagAlbums,
    });
};
TagController.FindTagArtists = async (req, res, next) => {
    let limit = 4;
    const artistTags = await db_1.db.query.artistTags.findMany({
        where: (0, drizzle_orm_1.eq)(schema.artistTags.tagId, req.params.tagId),
        limit,
        with: {
            artist: true,
        },
    });
    if (artistTags.length === 0) {
        res.status(400).send({
            message: `No artist Tag Found`,
        });
        return;
    }
    const tagArtists = artistTags.map((at) => at.artist);
    res.status(200).send({
        message: `Successfuly find artists By tag`,
        data: tagArtists,
    });
};
TagController.UpdateTag = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { name } = req.body;
        if (!name || name.trim() === "") {
            res.status(400).send({ message: "Tag name is required for update." });
            return;
        }
        // Génère un nouveau slug à partir du nouveau nom
        const slug = (0, slugify_1.default)(name, { lower: true, strict: true });
        // Vérifier que le tag existe
        const existingTag = await db_1.db.query.tags.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.tags.id, id),
        });
        if (!existingTag) {
            res.status(404).send({ message: "Tag not found." });
            return;
        }
        // Mettre à jour le tag
        await db_1.db
            .update(schema.tags)
            .set({ name, slug })
            .where((0, drizzle_orm_1.eq)(schema.tags.id, id));
        // Récupérer le tag mis à jour
        const updatedTag = await db_1.db.query.tags.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.tags.id, id),
        });
        res.status(200).send({
            message: "Tag updated successfully.",
            data: updatedTag,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error." });
    }
};
TagController.DeleteTag = async (req, res, next) => {
    try {
        const id = req.params.id;
        // Vérifier que le tag existe
        const existingTag = await db_1.db.query.tags.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.tags.id, id),
        });
        if (!existingTag) {
            res.status(404).send({ message: "Tag not found." });
            return;
        }
        // Supprimer le tag
        await db_1.db.delete(schema.tags).where((0, drizzle_orm_1.eq)(schema.tags.id, id));
        res.status(200).send({
            message: "Tag deleted successfully.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error." });
    }
};
