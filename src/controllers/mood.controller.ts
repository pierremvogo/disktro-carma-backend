import { eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import type { Artist, Album, Mood, Track } from "../models";
import slugify from "slugify";

export class MoodController {
  static Create: RequestHandler = async (req, res, next) => {
    const existingMood = await db.query.mood.findFirst({
      where: eq(schema.mood.name, req.body.name),
    });
    if (existingMood) {
      res
        .status(409)
        .json({ message: "An mood with this name already exists" });
      return;
    }
    const result = await db
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
      data: createdMood as Mood,
    });
  };

  static FindAllMoods: RequestHandler = async (req, res, next) => {
    const allMoods = await db.query.mood.findMany({
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
      data: allMoods as Mood[],
      message: "Successfully get all moods",
    });
  };

  static FindMoodById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      if (req.params.id == null) {
        res.status(400).send({
          message: "No mood ID given.!",
        });
        return;
      }
      const result = await db.query.mood.findFirst({
        where: eq(schema.mood.id, req.params.id),
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
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error`,
      });
    }
  };

  static UpdateMood: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const id = req.params.id;
      const { name } = req.body;
      if (!name || name.trim() === "") {
        res.status(400).send({ message: "Mood name is required for update." });
        return;
      }
      // Vérifier que le mood existe
      const existingMood = await db.query.mood.findFirst({
        where: eq(schema.mood.id, id),
      });
      if (!existingMood) {
        res.status(404).send({ message: "Mood not found." });
        return;
      }
      // Mettre à jour le mood
      await db.update(schema.mood).set({ name }).where(eq(schema.mood.id, id));

      // Récupérer le mood mis à jour
      const updatedMood = await db.query.mood.findFirst({
        where: eq(schema.mood.id, id),
      });

      res.status(200).send({
        message: "Mood updated successfully.",
        data: updatedMood as Mood,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal server error." });
    }
  };

  static DeleteMood: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const id = req.params.id;
      // Vérifier que le mood existe
      const existingMood = await db.query.mood.findFirst({
        where: eq(schema.mood.id, id),
      });
      if (!existingMood) {
        res.status(404).send({ message: "Mood not found." });
        return;
      }
      // Supprimer le mood
      await db.delete(schema.mood).where(eq(schema.mood.id, id));

      res.status(200).send({
        message: "Mood deleted successfully.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal server error." });
    }
  };
}
