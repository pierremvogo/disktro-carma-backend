import { eq, and, desc } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";

// Si tu as un type dans ../models, tu peux l'importer.
// Sinon tu peux typer en any ou créer un type minimal.
import type { ExclusiveContent } from "../models";

export class ExclusiveContentController {
  /**
   * ✅ CREATE exclusive content (metadata only)
   * Le front upload le fichier (Cloudinary/S3) et envoie fileUrl ici.
   */

  static Create: RequestHandler = async (req, res) => {
    try {
      // 🔐 ID de l'utilisateur connecté (via AuthMiddleware)
      const artistId = (req as any).user?.id;

      if (!artistId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }

      const { type, title, description, fileUrl } = req.body;

      if (!type || !title || !fileUrl) {
        res.status(400).send({
          message: "type, title and fileUrl are required.",
        });
        return;
      }

      // 1️⃣ Vérifier que l'utilisateur existe et est un ARTISTE
      const artist = await db.query.users.findFirst({
        where: eq(schema.users.id, artistId),
        columns: { id: true, type: true },
      });

      if (!artist) {
        res.status(404).send({ message: "User not found." });
        return;
      }

      if (artist.type !== "artist") {
        res.status(403).send({
          message: "Only artists can create exclusive content.",
        });
        return;
      }

      // 2️⃣ Valider le type de contenu
      const allowedTypes = ["music", "video", "photo", "document"];
      if (!allowedTypes.includes(type)) {
        res.status(400).send({
          message: `Invalid type. Allowed types: ${allowedTypes.join(", ")}`,
        });
        return;
      }

      // 3️⃣ Créer le contenu exclusif
      const inserted = await db
        .insert(schema.exclusiveContents)
        .values({
          artistId,
          type,
          title,
          description: description ?? null,
          fileUrl,
        })
        .$returningId();

      const created = inserted[0];

      if (!created) {
        res.status(400).send({
          message: "Error while creating exclusive content.",
        });
        return;
      }

      res.status(200).send({
        message: "Exclusive content created successfully",
        data: created as ExclusiveContent,
      });
    } catch (err) {
      console.error("Error creating exclusive content:", err);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  };

  /**
   * ✅ GET ALL exclusive contents (admin / debug)
   */
  static FindAll: RequestHandler = async (req, res, next) => {
    try {
      const all = await db.query.exclusiveContents.findMany({
        orderBy: [desc(schema.exclusiveContents.createdAt)],
      });

      if (all.length === 0) {
        res.status(200).send({
          message: "No exclusive content found",
          data: [],
        });
        return;
      }

      res.status(200).send({
        message: "Successfully get all exclusive contents",
        data: all as ExclusiveContent[],
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error: ${err}`,
      });
    }
  };

  /**
   * ✅ GET exclusive content by id
   */
  static FindById: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
      const result = await db.query.exclusiveContents.findFirst({
        where: eq(schema.exclusiveContents.id, req.params.id),
      });

      if (!result) {
        res.status(404).send({
          message: `No exclusive content found with id ${req.params.id}.`,
        });
        return;
      }

      res.status(200).send({
        message: "Successfully get exclusive content by id",
        data: result as ExclusiveContent,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error: ${err}`,
      });
    }
  };

  /**
   * ✅ GET exclusive contents by artistId
   */
  static FindByArtistId: RequestHandler<{ artistId: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const artistId = req.params.artistId;

      // 1️⃣ Vérifier que l'artiste existe
      const artist = await db.query.users.findFirst({
        where: eq(schema.users.id, artistId),
        columns: { id: true },
      });

      if (!artist) {
        res.status(404).send({ message: "Artist not found with given ID." });
        return;
      }

      const items = await db.query.exclusiveContents.findMany({
        where: eq(schema.exclusiveContents.artistId, artistId),
        orderBy: [desc(schema.exclusiveContents.createdAt)],
      });

      res.status(200).send({
        message: "Successfully retrieved exclusive contents for this artist.",
        contents: items as ExclusiveContent[],
      });
    } catch (err) {
      console.error("Error retrieving exclusive contents:", err);
      res.status(500).send({ message: "Internal server error." });
    }
  };

  /**
   * ✅ UPDATE exclusive content
   * (ex: titre/description/type/fileUrl)
   */
  static Update: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
      const id = req.params.id;
      const { title, description, type, fileUrl } = req.body;

      const existing = await db.query.exclusiveContents.findFirst({
        where: eq(schema.exclusiveContents.id, id),
      });

      if (!existing) {
        res.status(404).send({ message: "Exclusive content not found." });
        return;
      }

      // whitelist type si fourni
      if (type) {
        const allowedTypes = ["music", "video", "photo", "document"];
        if (!allowedTypes.includes(type)) {
          res.status(400).send({
            message: `Invalid type. Allowed: ${allowedTypes.join(", ")}`,
          });
          return;
        }
      }

      await db
        .update(schema.exclusiveContents)
        .set({
          title: title ?? existing.title,
          description: description ?? existing.description,
          type: type ?? existing.type,
          fileUrl: fileUrl ?? existing.fileUrl,
        })
        .where(eq(schema.exclusiveContents.id, id));

      const updated = await db.query.exclusiveContents.findFirst({
        where: eq(schema.exclusiveContents.id, id),
      });

      res.status(200).send({
        message: "Exclusive content updated successfully.",
        data: updated as ExclusiveContent,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: `Internal server error: ${err}` });
    }
  };

  /**
   * ✅ DELETE exclusive content
   */
  static Delete: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
      const id = req.params.id;

      const existing = await db.query.exclusiveContents.findFirst({
        where: eq(schema.exclusiveContents.id, id),
      });

      if (!existing) {
        res.status(404).send({ message: "Exclusive content not found." });
        return;
      }

      await db
        .delete(schema.exclusiveContents)
        .where(eq(schema.exclusiveContents.id, id));

      res.status(200).send({
        message: "Exclusive content deleted successfully.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: `Internal server error: ${err}` });
    }
  };

  /**
   * ✅ DELETE content by artistId + contentId (protection)
   * Optionnel : plus sûr pour éviter qu’un artiste supprime le contenu d’un autre.
   */
  static DeleteByArtist: RequestHandler<{ artistId: string; id: string }> =
    async (req, res, next) => {
      try {
        const { artistId, id } = req.params;

        const existing = await db.query.exclusiveContents.findFirst({
          where: and(
            eq(schema.exclusiveContents.id, id),
            eq(schema.exclusiveContents.artistId, artistId)
          ),
        });

        if (!existing) {
          res.status(404).send({ message: "Exclusive content not found." });
          return;
        }

        await db
          .delete(schema.exclusiveContents)
          .where(eq(schema.exclusiveContents.id, id));

        res.status(200).send({
          message: "Exclusive content deleted successfully.",
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: `Internal server error: ${err}` });
      }
    };
}
