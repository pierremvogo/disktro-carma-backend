import { asc, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { testers, testerValidate } from "../db/schema";

export class TesterController {
  /**
   * Crée une nouvelle entrée dans la table "testers"
   * Utilisé par ton Questionnaire (form data : name, email, ageRange, language)
   */
  static CreateTester: RequestHandler = async (req, res, next) => {
    try {
      if (!req.body) {
        res.status(400).send({ message: "Tester data is empty." });
        return;
      }

      // ✅ Validation des données avec Zod
      const parsed = testerValidate.parse({
        name: req.body.name,
        email: req.body.email,
        ageRange: req.body.ageRange,
        language: req.body.language,
      });

      // Insert en BDD
      const result = await db
        .insert(schema.testers)
        .values(parsed)
        .$returningId();

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
    } catch (err) {
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
  static FindTesterById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const testerId = req.params.id;

      if (!testerId) {
        res.status(400).send({
          message: "No tester ID given.",
        });
        return;
      }

      const tester = await db.query.testers.findFirst({
        where: eq(schema.testers.id, testerId),
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
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error: ${err}`,
      });
    }
  };

  /**
   * Récupère tous les testers (toutes les réponses au questionnaire)
   */
  static FindAllTesters: RequestHandler = async (req, res, next) => {
    try {
      const items = await db.query.testers.findMany({
        orderBy: [asc(testers.createdAt)],
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
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error: ${err}`,
      });
    }
  };

  /**
   * Supprime un tester
   */
  static DeleteTester: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const testerId = req.params.id;

      if (!testerId) {
        res.status(400).send({ message: "No tester ID provided." });
        return;
      }

      const existing = await db.query.testers.findFirst({
        where: eq(schema.testers.id, testerId),
      });

      if (!existing) {
        res.status(404).send({
          message: `No tester found with ID: ${testerId}`,
        });
        return;
      }

      await db.delete(schema.testers).where(eq(schema.testers.id, testerId));

      res.status(200).send({
        message: "Tester successfully deleted.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error: ${err}`,
      });
    }
  };
}
