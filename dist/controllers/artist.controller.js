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
exports.ArtistController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
const slugify_1 = __importDefault(require("slugify"));
class ArtistController {
}
exports.ArtistController = ArtistController;
_a = ArtistController;
ArtistController.CreateArtist = async (req, res, next) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    const artistSlug = (0, slugify_1.default)(req.body.name, { lower: true, strict: true });
    const existingName = await db_1.db.query.artists.findFirst({
        where: (0, drizzle_orm_1.eq)(schema.artists.slug, artistSlug),
    });
    if (existingName) {
        res
            .status(409)
            .json({ message: "An artist with this name already exists" });
        return;
    }
    try {
        const artist = await db_1.db
            .insert(schema.artists)
            .values({
            name: req.body.name,
            media_url: req.body.media_url,
            location: req.body.location,
            profileImageUrl: req.body.profileImageUrl,
            biography: req.body.biography,
            slug: artistSlug,
            spotify_artist_link: req.body.spotify_artist_link,
            deezer_artist_link: req.body.deezer_artist_link,
            tidal_artist_link: req.body.tidal_artist_link,
        })
            .$returningId();
        const createdArtist = artist[0];
        if (!createdArtist) {
            res.status(400).send({
                message: "Some error occurred while creating the Artist.",
            });
            return;
        }
        res.status(200).send({
            message: "Artist created successfully",
            data: createdArtist,
        });
    }
    catch (err) {
        res.status(500).send({
            message: `Internal server Error ... ${err}`,
        });
    }
};
ArtistController.FindArtistById = async (req, res, next) => {
    const result = await db_1.db.query.artists.findFirst({
        where: (0, drizzle_orm_1.eq)(schema.artists.id, req.params.id),
        with: {
            albumArtists: {
                with: {
                    album: true,
                },
            },
        },
    });
    if (!result) {
        res.status(404).send({
            message: `Some error occurred: No artist found with ID : ${req.params.id}`,
        });
        return;
    }
    const a = { ...result };
    if (a) {
        a.albums = result?.albumArtists.map((a) => a.album);
        delete a.albumArtists;
        res.status(200).send({
            data: a,
            message: "Successfully get artists By Id",
        });
    }
};
ArtistController.FindArtistBySlug = async (req, res, next) => {
    const result = await db_1.db.query.artists.findFirst({
        where: (0, drizzle_orm_1.eq)(schema.artists.slug, req.params.slug),
    });
    if (!result) {
        res.status(400).send({
            message: `Some error occurred: No artist found with slug : ${req.params.slug}`,
        });
        return;
    }
    res.status(200).send({
        data: result,
        message: "Successfully get artists By Slug",
    });
};
ArtistController.FindArtistsAdminedByUser = async (req, res, next) => {
    const result = await db_1.db.query.artistAdmins.findMany({
        where: (0, drizzle_orm_1.eq)(schema.artistAdmins.userId, req.params.userId),
        with: {
            artist: true,
        },
    });
    if (!result) {
        res.status(400).send({
            message: "Some error occurred: No artistAdmin By User found",
        });
        return;
    }
    res.status(200).send({
        data: result.map((aa) => aa.artist),
        message: "Successfully get artistsAdmin By User Id",
    });
};
ArtistController.FindArtistsByUserEmail = async (req, res, next) => {
    const result = await db_1.db
        .select({
        id: schema.artists.id,
        name: schema.artists.name,
        slug: schema.artists.slug,
        media_url: schema.artists.media_url,
        location: schema.artists.location,
        biography: schema.artists.biography,
        profileImageUrl: schema.artists.profileImageUrl,
        createdAt: schema.artists.createdAt,
    })
        .from(schema.artists)
        .innerJoin(schema.artistAdmins, (0, drizzle_orm_1.eq)(schema.artists.id, schema.artistAdmins.artistId))
        .innerJoin(schema.users, (0, drizzle_orm_1.eq)(schema.users.id, schema.artistAdmins.userId))
        .where((0, drizzle_orm_1.eq)(schema.users.email, req.body.userEmail));
    if (!result) {
        res.status(400).send({
            message: "Some error occurred: No artist By UserEmail found",
        });
    }
    res.status(200).send({
        data: result,
        message: "Successfully get artists By UserEmail ",
    });
};
ArtistController.FindArtistsWithTag = async (req, res, next) => {
    const artistTags = await db_1.db.query.artistTags.findMany({
        where: (0, drizzle_orm_1.eq)(schema.tags.id, req.body.tagId),
        with: {
            artist: true,
        },
    });
    if (!artistTags) {
        res.status(400).send({
            message: "Some error occurred: No artist tag found",
        });
    }
    let result = [];
    result = artistTags.map((at) => at.artist);
    res.status(200).send({
        data: result,
        message: "Successfully get artists with Tag ",
    });
};
ArtistController.FindAllArtists = async (req, res, next) => {
    const randArtists = await db_1.db.query.artists.findMany({
        columns: {
            name: true,
            id: true,
            slug: true,
            createdAt: true,
            media_url: true,
            location: true,
            biography: true,
            profileImageUrl: true,
        },
        //orderBy: [asc(schema.artists.id)]`,
        //limit: req.params.count,
    });
    if (!randArtists) {
        res.status(400).send({
            message: "Some error occurred: No artist found",
        });
        return;
    }
    res.status(200).send({
        data: randArtists,
        message: "Successfully get all artists",
    });
};
ArtistController.UpdateArtist = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedFields = {};
        if (req.body.name !== undefined)
            updatedFields.name = req.body.name;
        if (req.body.media_url !== undefined)
            updatedFields.media_url = req.body.media_url;
        if (req.body.location !== undefined)
            updatedFields.location = req.body.location;
        if (req.body.profileImageUrl !== undefined)
            updatedFields.profileImageUrl = req.body.profileImageUrl;
        if (req.body.biography !== undefined)
            updatedFields.biography = req.body.biography;
        if (req.body.slug !== undefined)
            updatedFields.slug = req.body.slug;
        if (req.body.spotify_artist_link !== undefined)
            updatedFields.spotify_artist_link = req.body.spotify_artist_link;
        if (req.body.deezer_artist_link !== undefined)
            updatedFields.deezer_artist_link = req.body.deezer_artist_link;
        if (req.body.tidal_artist_link !== undefined)
            updatedFields.tidal_artist_link = req.body.tidal_artist_link;
        await db_1.db
            .update(schema.artists)
            .set(updatedFields)
            .where((0, drizzle_orm_1.eq)(schema.artists.id, id));
        const updatedArtist = await db_1.db.query.artists.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.artists.id, id),
        });
        if (!updatedArtist) {
            res.status(404).send({ message: "Artist not found" });
            return;
        }
        res.status(200).send({
            message: "Artist updated successfully",
            data: updatedArtist,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error: ${err}`,
        });
    }
};
ArtistController.DeleteArtist = async (req, res, next) => {
    try {
        const { id } = req.params;
        const artist = await db_1.db.query.artists.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.artists.id, id),
        });
        if (!artist) {
            res.status(404).send({ message: "Artist not found" });
            return;
        }
        await db_1.db.delete(schema.artists).where((0, drizzle_orm_1.eq)(schema.artists.id, id));
        res.status(200).send({ message: "Artist deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error: ${err}`,
        });
    }
};
