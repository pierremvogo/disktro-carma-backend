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
exports.TrackSingleController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class TrackSingleController {
}
exports.TrackSingleController = TrackSingleController;
_a = TrackSingleController;
TrackSingleController.createTrackSingle = async (req, res, next) => {
    const single = await db_1.db.query.singles.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.singles.id, req.params.singleId)),
    });
    if (!single) {
        res.status(400).send({
            message: `Single not found with id : ${req.params.singleId}`,
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
    const trackSingles = await db_1.db.query.trackSingles.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackSingles.trackId, req.params.trackId), (0, drizzle_orm_1.eq)(schema.trackSingles.singleId, req.params.singleId)),
    });
    if (trackSingles) {
        res.status(404).send({
            message: "TrackSingle Already exist !",
        });
        return;
    }
    const trackSingle = await db_1.db
        .insert(schema.trackSingles)
        .values({
        singleId: req.params.singleId,
        trackId: req.params.trackId,
    })
        .$returningId();
    const createdTrackSingle = trackSingle[0];
    if (!createdTrackSingle) {
        res.status(400).send({
            message: "Some Error occured when creating Track Single",
        });
    }
    res.status(200).send(createdTrackSingle);
};
TrackSingleController.FindTrackSingleByTrackIdAndSingleId = async (req, res, next) => {
    const trackSingle = await db_1.db.query.trackSingles.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackSingles.singleId, req.params.singleId), (0, drizzle_orm_1.eq)(schema.trackSingles.trackId, req.params.trackId)),
    });
    if (!trackSingle) {
        res.status(400).send({
            message: "Error occured when getting Track Single by trackId and singleId",
        });
    }
    res.status(200).send(trackSingle);
};
TrackSingleController.FindTrackSingleByTrackId = async (req, res, next) => {
    const trackSingle = await db_1.db.query.trackSingles.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackSingles.trackId, req.params.trackId)),
    });
    if (!trackSingle) {
        res.status(400).send({
            message: "Error occured when getting Track Single by trackId",
        });
    }
    res.status(200).send(trackSingle);
};
TrackSingleController.FindTrackSingleBySingleId = async (req, res, next) => {
    const trackSingle = await db_1.db.query.trackSingles.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackSingles.singleId, req.params.singleId)),
    });
    if (!trackSingle) {
        res.status(400).send({
            message: "Error occured when getting Track Single by singleId",
        });
    }
    res.status(200).send(trackSingle);
};
TrackSingleController.FindTrackSingleById = async (req, res, next) => {
    const trackSingle = await db_1.db.query.trackSingles.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackSingles.id, req.params.id)),
    });
    if (!trackSingle) {
        res.status(400).send({
            message: "Error occured when getting Track Single by id",
        });
    }
    res.status(200).send(trackSingle);
};
