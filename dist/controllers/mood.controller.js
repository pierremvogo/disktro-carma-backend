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
exports.MoodController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class MoodController {
}
exports.MoodController = MoodController;
_a = MoodController;
MoodController.Create = async (req, res, next) => {
    const existingMood = await db_1.db.query.mood.findFirst({
        where: (0, drizzle_orm_1.eq)(schema.mood.name, req.body.name),
    });
    if (existingMood) {
        res
            .status(409)
            .json({ message: "An mood with this name already exists" });
        return;
    }
    const result = await db_1.db
        .insert(schema.mood)
        .values({
        name: req.body.name,
    })
        .$returningId();
    const createdMood = result[0];
    if (!createdMood) {
        res.status(400).send({
            message: "Error while creating Mood!",
        });
        return;
    }
    res.status(200).send({
        message: "Successfuly created Mood",
        data: createdMood,
    });
};
MoodController.FindAllMoods = async (req, res, next) => {
    const allMoods = await db_1.db.query.mood.findMany({
        columns: {
            id: true,
            name: true,
        },
    });
    if (!allMoods) {
        res.status(400).send({
            message: "Some error occurred: No Moods found",
        });
        return;
    }
    res.status(200).send({
        data: allMoods,
        message: "Successfully get all moods",
    });
};
MoodController.FindMoodById = async (req, res, next) => {
    try {
        if (req.params.id == null) {
            res.status(400).send({
                message: "No mood ID given.!",
            });
            return;
        }
        const result = await db_1.db.query.mood.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.mood.id, req.params.id),
        });
        if (!result) {
            res.status(400).send({
                message: `no mood with id ${req.params.id} found`,
            });
            return;
        }
        res.status(200).send({
            message: `Successfuly get mood`,
            data: result,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error`,
        });
    }
};
MoodController.UpdateMood = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { name } = req.body;
        if (!name || name.trim() === "") {
            res.status(400).send({ message: "Mood name is required for update." });
            return;
        }
        // Vérifier que le mood existe
        const existingMood = await db_1.db.query.mood.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.mood.id, id),
        });
        if (!existingMood) {
            res.status(404).send({ message: "Mood not found." });
            return;
        }
        // Mettre à jour le mood
        await db_1.db.update(schema.mood).set({ name }).where((0, drizzle_orm_1.eq)(schema.mood.id, id));
        // Récupérer le mood mis à jour
        const updatedMood = await db_1.db.query.mood.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.mood.id, id),
        });
        res.status(200).send({
            message: "Mood updated successfully.",
            data: updatedMood,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error." });
    }
};
MoodController.DeleteMood = async (req, res, next) => {
    try {
        const id = req.params.id;
        // Vérifier que le mood existe
        const existingMood = await db_1.db.query.mood.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.mood.id, id),
        });
        if (!existingMood) {
            res.status(404).send({ message: "Mood not found." });
            return;
        }
        // Supprimer le mood
        await db_1.db.delete(schema.mood).where((0, drizzle_orm_1.eq)(schema.mood.id, id));
        res.status(200).send({
            message: "Mood deleted successfully.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error." });
    }
};
