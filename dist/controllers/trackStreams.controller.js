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
exports.TrackStreamsController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class TrackStreamsController {
}
exports.TrackStreamsController = TrackStreamsController;
_a = TrackStreamsController;
/**
 * ➤ CREATE STREAM
 */
// ...
TrackStreamsController.createTrackStream = async (req, res, next) => {
    try {
        const { trackId, userId } = req.params;
        const { city: cityFromFront, device: deviceFromFront } = req.body;
        // 1️⃣ Vérifier que le track existe
        const track = await db_1.db.query.tracks.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.tracks.id, trackId),
        });
        if (!track) {
            res
                .status(404)
                .send({ message: `Track not found with id: ${trackId}` });
            return;
        }
        // 2️⃣ Vérifier que userId est présent
        if (!userId) {
            res.status(400).send({ message: "Missing userId" });
            return;
        }
        // 3️⃣ Récupérer l'utilisateur pour lire son country (Option B)
        const user = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, userId),
            columns: { country: true },
        });
        if (!user) {
            res.status(404).send({ message: `User not found with id: ${userId}` });
            return;
        }
        const countryFromUser = user.country ?? null;
        // 4️⃣ Anti-spam : vérifier si un stream récent (30 secondes) existe déjà
        const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
        const recentStream = await db_1.db.query.trackStreams.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.trackStreams.trackId, trackId), (0, drizzle_orm_1.eq)(schema.trackStreams.userId, userId), (0, drizzle_orm_1.gte)(schema.trackStreams.createdAt, thirtySecondsAgo)),
        });
        if (recentStream) {
            // On ne crée pas un nouveau stream, on renvoie le récent
            res.status(200).send(recentStream);
            return;
        }
        // 5️⃣ INFORMATION IP
        const ipAddress = req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            null;
        // 6️⃣ DEVICE (si non envoyé par le front)
        const userAgent = req.headers["user-agent"] || "";
        const device = deviceFromFront ||
            (userAgent.includes("Mobile") ? "mobile" : "desktop");
        // 7️⃣ INSERT du nouveau stream
        const inserted = await db_1.db
            .insert(schema.trackStreams)
            .values({
            trackId,
            userId,
            ipAddress: ipAddress ?? undefined,
            country: countryFromUser, // ISO2 attendu (CM, FR, etc.)
            city: cityFromFront ?? null,
            device,
        })
            .$returningId();
        const created = inserted[0];
        if (!created) {
            res.status(400).send({
                message: "Some error occurred when creating Track Stream",
            });
            return;
        }
        res.status(201).send(created);
    }
    catch (err) {
        console.error("Error in createTrackStream:", err);
        next(err);
    }
};
/**
 * ➤ GET STREAMS BY TRACK ID
 */
TrackStreamsController.findTrackStreamsByTrackId = async (req, res) => {
    try {
        const { trackId } = req.params;
        const streams = await db_1.db.query.trackStreams.findMany({
            where: (0, drizzle_orm_1.eq)(schema.trackStreams.trackId, trackId),
        });
        res.status(200).send(streams);
    }
    catch (err) {
        console.error("Error in findTrackStreamsByTrackId:", err);
        res.status(400).send({
            message: "Error occurred when getting Track Streams by trackId",
        });
    }
};
/**
 * ➤ GET STREAMS BY USER ID
 */
TrackStreamsController.findTrackStreamsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const streams = await db_1.db.query.trackStreams.findMany({
            where: (0, drizzle_orm_1.eq)(schema.trackStreams.userId, userId),
        });
        res.status(200).send(streams);
    }
    catch (err) {
        console.error("Error in findTrackStreamsByUserId:", err);
        res.status(400).send({
            message: "Error occurred when getting Track Streams by userId",
        });
    }
};
/**
 * ➤ GET STREAM BY ID
 */
TrackStreamsController.findTrackStreamById = async (req, res) => {
    try {
        const { id } = req.params;
        const stream = await db_1.db.query.trackStreams.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.trackStreams.id, id),
        });
        if (!stream) {
            res.status(404).send({ message: "Track Stream not found" });
            return;
        }
        res.status(200).send(stream);
    }
    catch (err) {
        console.error("Error in findTrackStreamById:", err);
        res.status(400).send({
            message: "Error occurred when getting Track Stream by id",
        });
    }
};
/**
 * ➤ GET ALL STREAMS
 * Route suggérée : GET /trackStream/get/all
 */
TrackStreamsController.findAllTrackStreams = async (req, res) => {
    try {
        const streams = await db_1.db.query.trackStreams.findMany();
        res.status(200).send(streams);
    }
    catch (err) {
        console.error("Error in findAllTrackStreams:", err);
        res.status(400).send({
            message: "Error occurred while retrieving all Track Streams",
        });
    }
};
