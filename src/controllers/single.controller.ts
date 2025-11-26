import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import type { Artist, Single, Tag, Track } from "../models";
import slugify from "slugify";
export class SingleController {
  static create: RequestHandler = async (req, res, next) => {
    const { title, duration, userId, coverUrl } = req.body;
    const singleSlug = slugify(title, { lower: true, strict: true });

    const existingName = await db.query.singles.findFirst({
      where: eq(schema.singles.slug, singleSlug),
    });

    if (existingName) {
      res
        .status(409)
        .json({ message: "An single with this name already exists" });
      return;
    }
    const single = await db
      .insert(schema.singles)
      .values({
        title: title,
        slug: singleSlug,
        userId: userId,
        duration: duration,
        coverUrl: coverUrl,
      })
      .$returningId();

    const createdSingle = single[0];

    if (!createdSingle) {
      res.status(400).send({
        message: "Error ocuured when creating single",
      });
    }
    res.status(200).send({
      message: "Single create successfully : ",
      data: createdSingle as Single,
    });
  };

  static FindAllSingles: RequestHandler = async (req, res, next) => {
    const allSingles = await db.query.singles.findMany({
      columns: {
        id: true,
        title: true,
        slug: true,
        duration: true,
        coverUrl: true,
      },
    });

    if (allSingles.length === 0) {
      res.status(400).send({
        message: "No Singles found",
      });
      return;
    }
    res.status(200).send({
      data: allSingles as Single[],
      message: "Successfully get all singles",
    });
  };

  static FindSingleByArtistAndSlug: RequestHandler = async (req, res, next) => {
    const query = db
      .select({
        id: schema.singles.id,
        title: schema.singles.title,
        slug: schema.singles.slug,
        duration: schema.singles.duration,
        coverUrl: schema.singles.coverUrl,
        tracks: schema.tracks,
      })
      .from(schema.singles)
      .innerJoin(
        schema.singleArtists,
        eq(schema.singles.id, schema.singleArtists.singleId)
      )
      .innerJoin(
        schema.artists,
        eq(schema.artists.id, schema.singleArtists.artistId)
      )
      .where(
        and(
          eq(schema.singles.slug, req.body.singleSlug),
          eq(schema.artists.slug, req.body.artistSlug)
        )
      )
      .limit(1);
    const coll = await query.execute();
    res.status(200).send({
      message: `Get single by artist and slug :  ${coll[0] as Single}.`,
    });
  };

  static FindSingleById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const single = await db.query.singles.findFirst({
        where: eq(schema.singles.id, req.params.id),
        with: {
          trackSingles: {
            with: {
              track: true,
            },
          },
          singleTags: {
            with: {
              tag: true,
            },
          },
        },
      });
      if (!single) {
        res.status(400).send({
          message: `No single found with id ${req.params.id}.`,
        });
        return;
      }
      const a: Single = { ...single };
      if (a) {
        a.tags = single?.singleTags.map((a: any) => a.tag as Tag);
        a.tracks = single?.trackSingles.map((t: any) => t.track as Track);
        delete a.singleTags;
        delete a.trackSingles;
        res.status(200).send({
          message: `Successfully get Single`,
          single: a as Single,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Internal server error.`,
      });
    }
  };

  static FindSinglesByUserId: RequestHandler<{ userId: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const userId = req.params.userId;

      // Vérifie que l'utilisateur existe
      const artist = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
      });

      if (!artist) {
        res
          .status(404)
          .send({ message: "Artist not found with the given ID." });
        return;
      }

      // Récupère tous les singles créés par cet utilisateur
      const singles = await db.query.singles.findMany({
        where: eq(schema.singles.userId, userId),
        with: {
          user: true, // si tu veux inclure les infos de l'utilisateur
          trackSingles: {
            with: {
              track: true,
            },
          },
        },
      });

      res.status(200).send({
        message: "Successfully retrieved all singles for this artist.",
        singles,
      });
    } catch (err) {
      console.error("Error retrieving singles:", err);
      res.status(500).send({ message: "Internal server error." });
    }
  };

  static UpdateSingle: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const { id } = req.params;
      const updatedFields: Partial<typeof schema.singles.$inferInsert> = {};

      if (req.body.title !== undefined) updatedFields.title = req.body.title;
      const singleSlug = slugify(req.body.title, {
        lower: true,
        strict: true,
      });
      updatedFields.slug = singleSlug;
      if (req.body.duration !== undefined)
        updatedFields.duration = req.body.duration;
      if (req.body.coverUrl !== undefined)
        updatedFields.coverUrl = req.body.coverUrl;

      // Mise à jour dans la base
      await db
        .update(schema.singles)
        .set(updatedFields)
        .where(eq(schema.singles.id, id));

      // Récupérer l'single mis à jour
      const updatedSingle = await db.query.singles.findFirst({
        where: eq(schema.singles.id, id),
      });

      if (!updatedSingle) {
        res.status(404).send({ message: "Single not found" });
        return;
      }

      res.status(200).send({
        message: "Single updated successfully",
        data: updatedSingle as Single,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error: ${err}`,
      });
    }
  };

  static DeleteSingle: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const { id } = req.params;

      // Vérifier si l'single existe
      const single = await db.query.singles.findFirst({
        where: eq(schema.singles.id, id),
      });
      if (!single) {
        res.status(404).send({ message: "Single not found" });
        return;
      }

      // Supprimer l'single
      await db.delete(schema.singles).where(eq(schema.singles.id, id));

      res.status(200).send({ message: "Single deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error: ${err}`,
      });
    }
  };
}
