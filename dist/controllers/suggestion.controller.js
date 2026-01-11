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
exports.SuggestionController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class SuggestionController {
}
exports.SuggestionController = SuggestionController;
_a = SuggestionController;
SuggestionController.Create = async (req, res, next) => {
    const existingSuggestion = await db_1.db.query.suggestion.findFirst({
        where: (0, drizzle_orm_1.eq)(schema.suggestion.email, req.body.email),
    });
    if (existingSuggestion) {
        res
            .status(409)
            .json({ message: "An suggestion with this email already exists" });
        return;
    }
    const result = await db_1.db
        .insert(schema.suggestion)
        .values({
        email: req.body.email,
        song: req.body.song,
    })
        .$returningId();
    const createdSuggestion = result[0];
    if (!createdSuggestion) {
        res.status(400).send({
            message: "Error while creating Suggestion!",
        });
        return;
    }
    res.status(200).send({
        message: "Successfuly created Suggestion",
        data: createdSuggestion,
    });
};
SuggestionController.FindAllSuggestions = async (req, res, next) => {
    const allSuggestions = await db_1.db.query.suggestion.findMany({
        columns: {
            id: true,
            email: true,
            song: true,
        },
    });
    if (!allSuggestions) {
        res.status(400).send({
            message: "Some error occurred: No Suggestions found",
        });
        return;
    }
    res.status(200).send({
        data: allSuggestions,
        message: "Successfully get all suggestions",
    });
};
SuggestionController.FindSuggestionById = async (req, res, next) => {
    try {
        if (req.params.id == null) {
            res.status(400).send({
                message: "No suggestion ID given.!",
            });
            return;
        }
        const result = await db_1.db.query.suggestion.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.suggestion.id, req.params.id),
        });
        if (!result) {
            res.status(400).send({
                message: `no suggestion with id ${req.params.id} found`,
            });
            return;
        }
        res.status(200).send({
            message: `Successfuly get suggestion`,
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
SuggestionController.UpdateSuggestion = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { song } = req.body;
        if (song) {
            res.status(400).send({
                message: "Suggestion song is required for update.",
            });
            return;
        }
        // Vérifier que la suggestion existe
        const existingSuggestion = await db_1.db.query.suggestion.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.suggestion.id, id),
        });
        if (!existingSuggestion) {
            res.status(404).send({ message: "Suggestion not found." });
            return;
        }
        // Mettre à jour le suggestion
        await db_1.db
            .update(schema.suggestion)
            .set({ song })
            .where((0, drizzle_orm_1.eq)(schema.suggestion.id, id));
        // Récupérer le suggestion mis à jour
        const updatedSuggestion = await db_1.db.query.suggestion.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.suggestion.id, id),
        });
        res.status(200).send({
            message: "Suggestion updated successfully.",
            data: updatedSuggestion,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error." });
    }
};
SuggestionController.DeleteSuggestion = async (req, res, next) => {
    try {
        const id = req.params.id;
        // Vérifier que le suggestion existe
        const existingSuggestion = await db_1.db.query.suggestion.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.suggestion.id, id),
        });
        if (!existingSuggestion) {
            res.status(404).send({ message: "Suggestion not found." });
            return;
        }
        // Supprimer le suggestion
        await db_1.db.delete(schema.suggestion).where((0, drizzle_orm_1.eq)(schema.suggestion.id, id));
        res.status(200).send({
            message: "Suggestion deleted successfully.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error." });
    }
};
