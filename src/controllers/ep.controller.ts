import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import type { Artist, Ep, Tag, Track } from "../models";
import slugify from "slugify";
export class EpController {
  static create: RequestHandler = async (req, res, next) => {
    const { title, duration, userId, coverUrl } = req.body;
    const epSlug = slugify(title, { lower: true, strict: true });

    const existingName = await db.query.eps.findFirst({
      where: eq(schema.eps.slug, epSlug),
    });

    if (existingName) {
      res.status(409).json({ message: "An ep with this name already exists" });
      return;
    }
    const ep = await db
      .insert(schema.eps)
      .values({
        title: title,
        slug: epSlug,
        userId: userId,
        duration: duration,
        coverUrl: coverUrl,
      })
      .$returningId();

    const createdEp = ep[0];

    if (!createdEp) {
      res.status(400).send({
        message: "Error ocuured when creating ep",
      });
    }
    res.status(200).send({
      message: "Ep create successfully : ",
      data: createdEp as Ep,
    });
  };

  static FindAllEps: RequestHandler = async (req, res, next) => {
    const allEps = await db.query.eps.findMany({
      columns: {
        id: true,
        title: true,
        slug: true,
        duration: true,
        coverUrl: true,
      },
    });

    if (allEps.length === 0) {
      res.status(400).send({
        message: "No Eps found",
      });
      return;
    }
    res.status(200).send({
      data: allEps as Ep[],
      message: "Successfully get all eps",
    });
  };

  static FindEpByArtistAndSlug: RequestHandler = async (req, res, next) => {
    const query = db
      .select({
        id: schema.eps.id,
        title: schema.eps.title,
        slug: schema.eps.slug,
        duration: schema.eps.duration,
        coverUrl: schema.eps.coverUrl,
        tracks: schema.tracks,
      })
      .from(schema.eps)
      .innerJoin(schema.epArtists, eq(schema.eps.id, schema.epArtists.epId))
      .innerJoin(
        schema.artists,
        eq(schema.artists.id, schema.epArtists.artistId)
      )
      .where(
        and(
          eq(schema.eps.slug, req.body.epSlug),
          eq(schema.artists.slug, req.body.artistSlug)
        )
      )
      .limit(1);
    const coll = await query.execute();
    res.status(200).send({
      message: `Get ep by artist and slug :  ${coll[0] as Ep}.`,
    });
  };

  static FindEpById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const ep = await db.query.eps.findFirst({
        where: eq(schema.eps.id, req.params.id),
        with: {
          trackEps: {
            with: {
              track: true,
            },
          },
          epTags: {
            with: {
              tag: true,
            },
          },
        },
      });
      if (!ep) {
        res.status(400).send({
          message: `No ep found with id ${req.params.id}.`,
        });
        return;
      }
      const a: Ep = { ...ep };
      if (a) {
        a.tags = ep?.epTags.map((a: any) => a.tag as Tag);
        a.tracks = ep?.trackEps.map((t: any) => t.track as Track);
        delete a.epTags;
        delete a.trackEps;
        res.status(200).send({
          message: `Successfully get Ep`,
          ep: a as Ep,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Internal server error.`,
      });
    }
  };

  static FindEpsByUserId: RequestHandler<{ userId: string }> = async (
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

      // Récupère tous les eps créés par cet utilisateur
      const eps = await db.query.eps.findMany({
        where: eq(schema.eps.userId, userId),
        with: {
          user: true, // si tu veux inclure les infos de l'utilisateur
          trackEps: {
            with: {
              track: true,
            },
          },
        },
      });

      res.status(200).send({
        message: "Successfully retrieved all eps for this artist.",
        eps,
      });
    } catch (err) {
      console.error("Error retrieving eps:", err);
      res.status(500).send({ message: "Internal server error." });
    }
  };

  static UpdateEp: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedFields: Partial<typeof schema.eps.$inferInsert> = {};

      if (req.body.title !== undefined) updatedFields.title = req.body.title;
      const epSlug = slugify(req.body.title, {
        lower: true,
        strict: true,
      });
      updatedFields.slug = epSlug;
      if (req.body.duration !== undefined)
        updatedFields.duration = req.body.duration;
      if (req.body.coverUrl !== undefined)
        updatedFields.coverUrl = req.body.coverUrl;

      // Mise à jour dans la base
      await db
        .update(schema.eps)
        .set(updatedFields)
        .where(eq(schema.eps.id, id));

      // Récupérer l'ep mis à jour
      const updatedEp = await db.query.eps.findFirst({
        where: eq(schema.eps.id, id),
      });

      if (!updatedEp) {
        res.status(404).send({ message: "Ep not found" });
        return;
      }

      res.status(200).send({
        message: "Ep updated successfully",
        data: updatedEp as Ep,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error: ${err}`,
      });
    }
  };

  static DeleteEp: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
      const { id } = req.params;

      // Vérifier si l'ep existe
      const ep = await db.query.eps.findFirst({
        where: eq(schema.eps.id, id),
      });
      if (!ep) {
        res.status(404).send({ message: "Ep not found" });
        return;
      }

      // Supprimer l'ep
      await db.delete(schema.eps).where(eq(schema.eps.id, id));

      res.status(200).send({ message: "Ep deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error: ${err}`,
      });
    }
  };
}
