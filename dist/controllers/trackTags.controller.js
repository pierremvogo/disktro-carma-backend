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
exports.TrackTagController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class TrackTagController {
}
exports.TrackTagController = TrackTagController;
_a = TrackTagController;
TrackTagController.createTrackTag = async (req, res, next) => {
    const tag = await db_1.db.query.tags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.tags.id, req.params.tagId)),
    });
    if (!tag) {
        res.status(400).send({
            message: `Tag not found with id : ${req.params.tagId}`,
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
    const trackTags = await db_1.db.query.trackTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackTags.tagId, req.params.tagId), (0, drizzle_orm_1.eq)(schema.trackTags.trackId, req.params.trackId)),
    });
    if (trackTags) {
        res.status(404).send({
            message: "TrackTag Already exist !",
        });
        return;
    }
    const trackTag = await db_1.db
        .insert(schema.trackTags)
        .values({
        tagId: req.params.tagId,
        trackId: req.params.trackId,
    })
        .$returningId();
    const createdTrackTag = trackTag[0];
    if (!createdTrackTag) {
        res.status(400).send({
            message: "Some Error occured when creating Track Tag",
        });
    }
    res.status(200).send(createdTrackTag);
};
TrackTagController.FindTrackTagByTrackIdAndTagId = async (req, res, next) => {
    const trackTag = await db_1.db.query.trackTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackTags.tagId, req.params.tagId), (0, drizzle_orm_1.eq)(schema.trackTags.trackId, req.params.trackId)),
    });
    if (!trackTag) {
        res.status(400).send({
            message: "Error occured when getting Track Tag",
        });
    }
    res.status(200).send(trackTag);
};
TrackTagController.FindTrackTagByTrackId = async (req, res, next) => {
    const trackTag = await db_1.db.query.trackTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackTags.trackId, req.params.trackId)),
    });
    if (!trackTag) {
        res.status(400).send({
            message: "Error occured when getting Track Tag by trackId",
        });
    }
    res.status(200).send(trackTag);
};
TrackTagController.FindTrackTagByTagId = async (req, res, next) => {
    const trackTag = await db_1.db.query.trackTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackTags.tagId, req.params.tagId)),
    });
    if (!trackTag) {
        res.status(400).send({
            message: "Error occured when getting Track Tag by tagId",
        });
    }
    res.status(200).send(trackTag);
};
TrackTagController.FindTrackTagById = async (req, res, next) => {
    const trackTag = await db_1.db.query.trackTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackTags.id, req.params.id)),
    });
    if (!trackTag) {
        res.status(400).send({
            message: "Error occured when getting Track Tag by id",
        });
    }
    res.status(200).send(trackTag);
};
TrackTagController.DeleteTrackTag = async (req, res, next) => {
    try {
        const existing = await db_1.db.query.trackTags.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.trackTags.id, req.params.id),
        });
        if (!existing) {
            res.status(404).send({ message: "TrackTag not found." });
            return;
        }
        await db_1.db
            .delete(schema.trackTags)
            .where((0, drizzle_orm_1.eq)(schema.trackTags.id, req.params.id));
        res.status(200).send({ message: "TrackTag successfully deleted." });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: `Internal server error: ${err}` });
    }
};
TrackTagController.UpdateTrackTag = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { tagId, trackId } = req.body;
        // Vérifier que le TrackTag existe
        const existingTrackTag = await db_1.db.query.trackTags.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.trackTags.id, id),
        });
        if (!existingTrackTag) {
            res.status(404).send({ message: "TrackTag not found." });
            return;
        }
        // Si tagId est fourni, vérifier que le tag existe
        if (tagId) {
            const tag = await db_1.db.query.tags.findFirst({
                where: (0, drizzle_orm_1.eq)(schema.tags.id, tagId),
            });
            if (!tag) {
                res.status(404).send({ message: `Tag not found with id: ${tagId}` });
                return;
            }
        }
        // Si trackId est fourni, vérifier que le track existe
        if (trackId) {
            const track = await db_1.db.query.tracks.findFirst({
                where: (0, drizzle_orm_1.eq)(schema.tracks.id, trackId),
            });
            if (!track) {
                res
                    .status(404)
                    .send({ message: `Track not found with id: ${trackId}` });
                return;
            }
        }
        // Vérifier qu'on ne crée pas un doublon TrackTag
        const duplicate = await db_1.db.query.trackTags.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackTags.tagId, tagId ?? existingTrackTag.tagId), (0, drizzle_orm_1.eq)(schema.trackTags.trackId, trackId ?? existingTrackTag.trackId), 
            // Exclure l'enregistrement actuel
            schema.trackTags.id.notEq(id)),
        });
        if (duplicate) {
            res.status(400).send({
                message: "TrackTag with this trackId and tagId already exists.",
            });
            return;
        }
        // Mise à jour
        await db_1.db
            .update(schema.trackTags)
            .set({
            tagId: tagId ?? existingTrackTag.tagId,
            trackId: trackId ?? existingTrackTag.trackId,
        })
            .where((0, drizzle_orm_1.eq)(schema.trackTags.id, id));
        const updatedTrackTag = await db_1.db.query.trackTags.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.trackTags.id, id),
            columns: {
                tagId: true,
                trackId: true,
            },
        });
        res.status(200).send({
            data: updatedTrackTag,
            message: "TrackTag updated successfully.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: `Internal server error: ${err}` });
    }
};
