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
exports.TrackReleaseController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class TrackReleaseController {
}
exports.TrackReleaseController = TrackReleaseController;
_a = TrackReleaseController;
TrackReleaseController.createTrackRelease = async (req, res, next) => {
    const track = await db_1.db.query.tracks.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.tracks.id, req.params.trackId)),
    });
    if (!track) {
        res.status(404).send({
            message: `Track not found with id : ${req.params.trackId}`,
        });
        return;
    }
    const release = await db_1.db.query.release.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.release.id, req.params.releaseId)),
    });
    if (!release) {
        res.status(404).send({
            message: `Release not found with id : ${req.params.releaseId}`,
        });
        return;
    }
    const trackReleases = await db_1.db.query.trackReleases.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackReleases.releaseId, req.params.releaseId), (0, drizzle_orm_1.eq)(schema.trackReleases.trackId, req.params.trackId)),
    });
    if (trackReleases) {
        res.status(404).send({
            message: "TrackRelease Already exist !",
        });
        return;
    }
    const trackRelease = await db_1.db
        .insert(schema.trackReleases)
        .values({
        releaseId: req.params.releaseId,
        trackId: req.params.trackId,
    })
        .$returningId();
    const createdTrackRelease = trackRelease[0];
    if (!createdTrackRelease) {
        res.status(400).send({
            message: "Some Error occured when creating Track Release",
        });
    }
    res.status(200).send(createdTrackRelease);
};
TrackReleaseController.FindTrackReleaseByTrackIdAndReleaseId = async (req, res, next) => {
    const trackRelease = await db_1.db.query.trackReleases.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackReleases.releaseId, req.params.releaseId), (0, drizzle_orm_1.eq)(schema.trackReleases.trackId, req.params.trackId)),
    });
    if (!trackRelease) {
        res.status(400).send({
            message: "Error occured when getting Track Release by trackId and releaseId",
        });
    }
    res.status(200).send(trackRelease);
};
TrackReleaseController.FindTrackReleaseByTrackId = async (req, res, next) => {
    const trackRelease = await db_1.db.query.trackReleases.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackReleases.trackId, req.params.trackId)),
    });
    if (!trackRelease) {
        res.status(400).send({
            message: "Error occured when getting Track Release by trackId",
        });
    }
    res.status(200).send(trackRelease);
};
TrackReleaseController.FindTrackReleaseByReleaseId = async (req, res, next) => {
    const trackRelease = await db_1.db.query.trackReleases.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackReleases.releaseId, req.params.releaseId)),
    });
    if (!trackRelease) {
        res.status(400).send({
            message: "Error occured when getting Track Release by releaseId",
        });
    }
    res.status(200).send(trackRelease);
};
TrackReleaseController.FindTrackReleaseById = async (req, res, next) => {
    const trackRelease = await db_1.db.query.trackReleases.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackReleases.id, req.params.id)),
    });
    if (!trackRelease) {
        res.status(400).send({
            message: "Error occured when getting Track Release by id",
        });
    }
    res.status(200).send(trackRelease);
};
