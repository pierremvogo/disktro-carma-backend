import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";

export class ArtistAdminController {
  static createArtistAdmin: RequestHandler<{
    adminId: string;
    artistId: string;
  }> = async (req, res, next) => {
    // 1. Vérification de l'existence de l'utilisateur
    const admin = await db.query.users.findFirst({
      where: eq(schema.users.id, req.params.adminId),
    });

    if (!admin) {
      res.status(404).send({
        message: "User ID not found",
      });
      return;
    }

    // 2. Vérification que l'utilisateur est bien de type "ADMIN"
    if (admin.type !== "ADMIN") {
      res.status(403).send({
        message: "User is not authorized to be an artist admin",
      });
      return;
    }

    // 3. Vérification de l'existence de l'artiste
    const artist = await db.query.artists.findFirst({
      where: eq(schema.artists.id, req.params.artistId),
    });

    if (!artist) {
      res.status(404).send({
        message: "Artist ID not found",
      });
      return;
    }

    // 4. Vérifier si cet artiste a déjà un administrateur (peu importe lequel)
    const existingAdminForArtist = await db.query.artistAdmins.findFirst({
      where: eq(schema.artistAdmins.artistId, req.params.artistId),
    });

    if (existingAdminForArtist) {
      res.status(409).send({
        message: "This artist already has an administrator",
      });
      return;
    }

    // 5. Création de la relation artist-admin
    const artistAdmin = await db
      .insert(schema.artistAdmins)
      .values({
        artistId: req.params.artistId,
        userId: req.params.adminId,
      })
      .$returningId();

    const createdArtistAdmin = artistAdmin[0];

    if (!createdArtistAdmin) {
      res.status(500).send({
        message: "Failed to create artistAdmin",
      });
      return;
    }

    // 6. Réponse OK
    res.status(200).send({
      artistAdminId: createdArtistAdmin,
      message: "Artist admin created successfully",
    });
  };

  static FindArtistAdminByUserIdAndArtistId: RequestHandler<{
    userId: string;
    artistId: string;
  }> = async (req, res, next) => {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, req.params.userId),
    });
    if (!user) {
      res.status(404).send({
        message: "User id is required!",
      });
      return;
    }
    const artist = await db.query.artists.findFirst({
      where: eq(schema.artists.id, req.params.artistId),
    });
    if (!artist) {
      res.status(404).send({
        message: "Artist id is required!",
      });
      return;
    }
    const artistAdmin = await db.query.artistAdmins.findFirst({
      where: and(
        eq(schema.artistAdmins.artistId, req.params.artistId),
        eq(schema.artistAdmins.userId, req.params.userId)
      ),
    });
    if (!artistAdmin) {
      res.status(400).send({
        message: "Error ocuured when getting artistAdmin",
      });
      return;
    }
    res.status(200).send(artistAdmin);
  };

  static FindArtistAdminByUserId: RequestHandler<{ userId: string }> = async (
    req,
    res,
    next
  ) => {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, req.params.userId),
    });
    if (!user) {
      res.status(404).send({
        message: "User id not Found!",
      });
      return;
    }

    const artistAdmin = await db.query.artistAdmins.findFirst({
      where: and(eq(schema.artistAdmins.userId, req.params.userId)),
    });
    if (!artistAdmin) {
      res.status(400).send({
        message: "Error ocuured when getting artistAdmin",
      });
      return;
    }
    res.status(200).send(artistAdmin);
  };

  static FindArtistAdminByArtistId: RequestHandler<{ artistId: string }> =
    async (req, res, next) => {
      const artist = await db.query.artists.findFirst({
        where: eq(schema.artists.id, req.params.artistId),
      });
      if (!artist) {
        res.status(404).send({
          message: "User id not Found!",
        });
        return;
      }
      const artistAdmin = await db.query.artistAdmins.findFirst({
        where: and(eq(schema.artistAdmins.artistId, req.params.artistId)),
      });
      if (!artistAdmin) {
        res.status(404).send({
          message: "Error ocuured when getting artistAdmin",
        });
        return;
      }
      res.status(200).send(artistAdmin);
    };

  static FindArtistAdminById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    const artistAdmin = await db.query.artistAdmins.findFirst({
      where: and(eq(schema.artistAdmins.id, req.params.id)),
    });
    if (!artistAdmin) {
      res.status(404).send({
        message: "Error ocuured when getting artistAdmin",
      });
      return;
    }
    res.status(200).send(artistAdmin);
  };
}
