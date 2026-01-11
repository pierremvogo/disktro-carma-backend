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
exports.TrackEpController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class TrackEpController {
}
exports.TrackEpController = TrackEpController;
_a = TrackEpController;
TrackEpController.createTrackEp = async (req, res, next) => {
    const ep = await db_1.db.query.eps.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.eps.id, req.params.epId)),
    });
    if (!ep) {
        res.status(400).send({
            message: `Ep not found with id : ${req.params.epId}`,
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
    const trackEps = await db_1.db.query.trackEps.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackEps.trackId, req.params.trackId), (0, drizzle_orm_1.eq)(schema.trackEps.epId, req.params.epId)),
    });
    if (trackEps) {
        res.status(404).send({
            message: "TrackEp Already exist !",
        });
        return;
    }
    const trackEp = await db_1.db
        .insert(schema.trackEps)
        .values({
        epId: req.params.epId,
        trackId: req.params.trackId,
    })
        .$returningId();
    const createdTrackEp = trackEp[0];
    if (!createdTrackEp) {
        res.status(400).send({
            message: "Some Error occured when creating Track Ep",
        });
    }
    res.status(200).send(createdTrackEp);
};
TrackEpController.FindTrackEpByTrackIdAndEpId = async (req, res, next) => {
    const trackEp = await db_1.db.query.trackEps.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackEps.epId, req.params.epId), (0, drizzle_orm_1.eq)(schema.trackEps.trackId, req.params.trackId)),
    });
    if (!trackEp) {
        res.status(400).send({
            message: "Error occured when getting Track Ep by trackId and epId",
        });
    }
    res.status(200).send(trackEp);
};
TrackEpController.FindTrackEpByTrackId = async (req, res, next) => {
    const trackEp = await db_1.db.query.trackEps.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackEps.trackId, req.params.trackId)),
    });
    if (!trackEp) {
        res.status(400).send({
            message: "Error occured when getting Track Ep by trackId",
        });
    }
    res.status(200).send(trackEp);
};
TrackEpController.FindTrackEpByEpId = async (req, res, next) => {
    const trackEp = await db_1.db.query.trackEps.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackEps.epId, req.params.epId)),
    });
    if (!trackEp) {
        res.status(400).send({
            message: "Error occured when getting Track Ep by epId",
        });
    }
    res.status(200).send(trackEp);
};
TrackEpController.FindTrackEpById = async (req, res, next) => {
    const trackEp = await db_1.db.query.trackEps.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackEps.id, req.params.id)),
    });
    if (!trackEp) {
        res.status(400).send({
            message: "Error occured when getting Track Ep by id",
        });
    }
    res.status(200).send(trackEp);
};
