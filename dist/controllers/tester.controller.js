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
exports.TesterController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
const schema_1 = require("../db/schema");
const email_1 = require("../utils/email");
class TesterController {
}
exports.TesterController = TesterController;
_a = TesterController;
/**
 * Crée une nouvelle entrée dans la table "testers"
 * Utilisé par ton Questionnaire (form data : name, email, ageRange, language)
 */
TesterController.CreateTester = async (req, res, next) => {
    try {
        if (!req.body) {
            res.status(400).send({ message: "Tester data is empty." });
            return;
        }
        // ✅ Validation des données avec Zod
        const parsed = schema_1.testerValidate.parse({
            name: req.body.name,
            email: req.body.email,
            ageRange: req.body.ageRange,
            language: req.body.language,
        });
        // Insert en BDD
        const result = await db_1.db
            .insert(schema.testers)
            .values(parsed)
            .$returningId();
        await (0, email_1.sendThankYouEmail)(req.body.email, req.body.language);
        const createdTester = result[0];
        if (!createdTester) {
            res.status(400).send({
                message: "Error creating tester entry.",
            });
            return;
        }
        res.status(201).send({
            data: createdTester,
            message: "Tester successfully created.",
        });
    }
    catch (err) {
        console.error(err);
        // Erreurs de validation ou autres
        res.status(500).send({
            message: `Internal server error: ${err}`,
        });
    }
};
/**
 * Récupère un tester par ID
 */
TesterController.FindTesterById = async (req, res, next) => {
    try {
        const testerId = req.params.id;
        if (!testerId) {
            res.status(400).send({
                message: "No tester ID given.",
            });
            return;
        }
        const tester = await db_1.db.query.testers.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.testers.id, testerId),
        });
        if (!tester) {
            res.status(404).send({
                message: `No tester found with ID: ${testerId}`,
            });
            return;
        }
        res.status(200).send({
            data: tester,
            message: "Successfully fetched tester by ID.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error: ${err}`,
        });
    }
};
/**
 * Récupère tous les testers (toutes les réponses au questionnaire)
 */
TesterController.FindAllTesters = async (req, res, next) => {
    try {
        const items = await db_1.db.query.testers.findMany({
            orderBy: [(0, drizzle_orm_1.asc)(schema_1.testers.createdAt)],
        });
        if (!items || items.length === 0) {
            res.status(200).send({
                data: [],
                message: "No testers found.",
            });
            return;
        }
        res.status(200).send({
            data: items,
            message: "Successfully fetched all testers.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error: ${err}`,
        });
    }
};
/**
 * Supprime un tester
 */
TesterController.DeleteTester = async (req, res, next) => {
    try {
        const testerId = req.params.id;
        if (!testerId) {
            res.status(400).send({ message: "No tester ID provided." });
            return;
        }
        const existing = await db_1.db.query.testers.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.testers.id, testerId),
        });
        if (!existing) {
            res.status(404).send({
                message: `No tester found with ID: ${testerId}`,
            });
            return;
        }
        await db_1.db.delete(schema.testers).where((0, drizzle_orm_1.eq)(schema.testers.id, testerId));
        res.status(200).send({
            message: "Tester successfully deleted.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error: ${err}`,
        });
    }
};
