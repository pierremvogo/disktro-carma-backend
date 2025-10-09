import { eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import type { Artist, Album, Suggestion, Track } from "../models";
import slugify from "slugify";

export class SuggestionController {
  static Create: RequestHandler = async (req, res, next) => {
    const existingSuggestion = await db.query.suggestion.findFirst({
      where: eq(schema.suggestion.email, req.body.email),
    });
    if (existingSuggestion) {
      res
        .status(409)
        .json({ message: "An suggestion with this email already exists" });
      return;
    }
    const result = await db
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
      data: createdSuggestion as Suggestion,
    });
  };

  static FindAllSuggestions: RequestHandler = async (req, res, next) => {
    const allSuggestions = await db.query.suggestion.findMany({
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
      data: allSuggestions as Suggestion[],
      message: "Successfully get all suggestions",
    });
  };

  static FindSuggestionById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      if (req.params.id == null) {
        res.status(400).send({
          message: "No suggestion ID given.!",
        });
        return;
      }
      const result = await db.query.suggestion.findFirst({
        where: eq(schema.suggestion.id, req.params.id),
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
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error`,
      });
    }
  };

  static UpdateSuggestion: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
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
      const existingSuggestion = await db.query.suggestion.findFirst({
        where: eq(schema.suggestion.id, id),
      });
      if (!existingSuggestion) {
        res.status(404).send({ message: "Suggestion not found." });
        return;
      }
      // Mettre à jour le suggestion
      await db
        .update(schema.suggestion)
        .set({ song })
        .where(eq(schema.suggestion.id, id));

      // Récupérer le suggestion mis à jour
      const updatedSuggestion = await db.query.suggestion.findFirst({
        where: eq(schema.suggestion.id, id),
      });

      res.status(200).send({
        message: "Suggestion updated successfully.",
        data: updatedSuggestion as Suggestion,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal server error." });
    }
  };

  static DeleteSuggestion: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const id = req.params.id;
      // Vérifier que le suggestion existe
      const existingSuggestion = await db.query.suggestion.findFirst({
        where: eq(schema.suggestion.id, id),
      });
      if (!existingSuggestion) {
        res.status(404).send({ message: "Suggestion not found." });
        return;
      }
      // Supprimer le suggestion
      await db.delete(schema.suggestion).where(eq(schema.suggestion.id, id));

      res.status(200).send({
        message: "Suggestion deleted successfully.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal server error." });
    }
  };
}
