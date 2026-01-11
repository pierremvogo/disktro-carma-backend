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
exports.TrackPlaylistController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class TrackPlaylistController {
}
exports.TrackPlaylistController = TrackPlaylistController;
_a = TrackPlaylistController;
TrackPlaylistController.createTrackPlaylist = async (req, res, next) => {
    const playlist = await db_1.db.query.playlists.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.playlists.id, req.params.playlistId)),
    });
    if (!playlist) {
        res.status(400).send({
            message: `Playlist not found with id : ${req.params.playlistId}`,
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
    const trackPlayLists = await db_1.db.query.trackPlayLists.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackPlayLists.playlistId, req.params.playlistId), (0, drizzle_orm_1.eq)(schema.trackPlayLists.trackId, req.params.trackId)),
    });
    if (trackPlayLists) {
        res.status(404).send({
            message: "Track already added to playlist !",
        });
        return;
    }
    const trackPlaylist = await db_1.db
        .insert(schema.trackPlayLists)
        .values({
        playlistId: req.params.playlistId,
        trackId: req.params.trackId,
    })
        .$returningId();
    const createdTrackPlaylist = trackPlaylist[0];
    if (!createdTrackPlaylist) {
        res.status(400).send({
            message: "Some Error occured when creating Track Playlist",
        });
    }
    res.status(200).send(createdTrackPlaylist);
};
TrackPlaylistController.FindTrackPlaylistByTrackIdAndPlaylistId = async (req, res, next) => {
    const trackPlaylist = await db_1.db.query.trackPlayLists.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackPlayLists.playlistId, req.params.playlistId), (0, drizzle_orm_1.eq)(schema.trackPlayLists.trackId, req.params.trackId)),
    });
    if (!trackPlaylist) {
        res.status(400).send({
            message: "Error occured when getting Track Playlist",
        });
    }
    res.status(200).send(trackPlaylist);
};
TrackPlaylistController.FindTrackPlaylistByTrackId = async (req, res, next) => {
    const trackPlaylist = await db_1.db.query.trackPlayLists.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackPlayLists.trackId, req.params.trackId)),
    });
    if (!trackPlaylist) {
        res.status(400).send({
            message: "Error occured when getting Track Playlist by trackId",
        });
    }
    res.status(200).send(trackPlaylist);
};
TrackPlaylistController.FindTrackPlaylistByPlaylistId = async (req, res, next) => {
    const trackPlaylist = await db_1.db.query.trackPlayLists.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackPlayLists.playlistId, req.params.playlistId)),
    });
    if (!trackPlaylist) {
        res.status(400).send({
            message: "Error occured when getting Track Playlist by playlistId",
        });
    }
    res.status(200).send(trackPlaylist);
};
TrackPlaylistController.FindTrackPlaylistById = async (req, res, next) => {
    const trackPlaylist = await db_1.db.query.trackPlayLists.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackPlayLists.id, req.params.id)),
    });
    if (!trackPlaylist) {
        res.status(400).send({
            message: "Error occured when getting Track Playlist by id",
        });
    }
    res.status(200).send(trackPlaylist);
};
TrackPlaylistController.DeleteTrackPlaylist = async (req, res, next) => {
    try {
        const existing = await db_1.db.query.trackPlayLists.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.trackPlayLists.id, req.params.id),
        });
        if (!existing) {
            res.status(404).send({ message: "TrackPlaylist not found." });
            return;
        }
        await db_1.db
            .delete(schema.trackPlayLists)
            .where((0, drizzle_orm_1.eq)(schema.trackPlayLists.trackId, req.params.id));
        res.status(200).send({ message: "TrackPlaylist successfully deleted." });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: `Internal server error: ${err}` });
    }
};
TrackPlaylistController.UpdateTrackPlaylist = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { playlistId, trackId } = req.body;
        // Vérifier que le TrackPlaylist existe
        const existingTrackPlaylist = await db_1.db.query.trackPlayLists.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.trackPlayLists.id, id),
        });
        if (!existingTrackPlaylist) {
            res.status(404).send({ message: "TrackPlaylist not found." });
            return;
        }
        // Si playlistId est fourni, vérifier que le playlist existe
        if (playlistId) {
            const playlist = await db_1.db.query.playlists.findFirst({
                where: (0, drizzle_orm_1.eq)(schema.playlists.id, playlistId),
            });
            if (!playlist) {
                res
                    .status(404)
                    .send({ message: `Playlist not found with id: ${playlistId}` });
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
        // Vérifier qu'on ne crée pas un doublon TrackPlaylist
        const duplicate = await db_1.db.query.trackPlayLists.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackPlayLists.playlistId, playlistId ?? existingTrackPlaylist.playlistId), (0, drizzle_orm_1.eq)(schema.trackPlayLists.trackId, trackId ?? existingTrackPlaylist.trackId), 
            // Exclure l'enregistrement actuel
            schema.trackPlayLists.id.notEq(id)),
        });
        if (duplicate) {
            res.status(400).send({
                message: "TrackPlaylist with this trackId and playlistId already exists.",
            });
            return;
        }
        // Mise à jour
        await db_1.db
            .update(schema.trackPlayLists)
            .set({
            playlistId: playlistId ?? existingTrackPlaylist.playlistId,
            trackId: trackId ?? existingTrackPlaylist.trackId,
        })
            .where((0, drizzle_orm_1.eq)(schema.trackPlayLists.id, id));
        const updatedTrackPlaylist = await db_1.db.query.trackPlayLists.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.trackPlayLists.id, id),
            columns: {
                playlistId: true,
                trackId: true,
            },
        });
        res.status(200).send({
            data: updatedTrackPlaylist,
            message: "TrackPlaylist updated successfully.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: `Internal server error: ${err}` });
    }
};
