import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import type { Release } from "../models";
import { v4 as uuidv4 } from "uuid";
import { Multer } from "multer";
import ReleaseService from "../services/ReleaseService";
import DDEXMapper from "../services/DDEXMapper";
import AssetPackager from "../services/AssetPackager";
import DeliveryService from "../services/DeliveryService";
import NotificationService from "../services/NotificationService";
import ReportingService from "../services/ReportingService";
import { ReleaseData, SalesReport } from "../models";
import { sql } from "drizzle-orm"; // nécessaire pour les requêtes brutes comme LOWER()

export class ReleaseController {
  static createRelease: RequestHandler = async (req, res, next) => {
    const { artistId, title } = req.body;

    // Vérifie si l'artiste existe
    const artist = await db.query.artists.findFirst({
      where: eq(schema.artists.id, artistId),
    });

    if (!artist) {
      res.status(404).send({
        message: "Artist ID does not exist",
      });
      return;
    }

    // Vérifie si une release avec le même titre (insensible à la casse) existe pour cet artiste
    const existingRelease = await db.query.release.findFirst({
      where: and(
        eq(schema.release.artistId, artistId),
        sql`LOWER(${schema.release.title}) = LOWER(${title})`
      ),
    });

    if (existingRelease) {
      res.status(409).send({
        message:
          "This artist already has a release with the same title (case-insensitive)",
      });
      return;
    }

    // Création de la nouvelle release
    const release = await db
      .insert(schema.release)
      .values({
        artistId,
        title,
        releaseDate: req.body.releaseDate,
        description: req.body.description,
        coverArt: req.body.coverArt,
        label: req.body.label,
        releaseType: req.body.releaseType,
        format: req.body.format,
        upcCode: req.body.upcCode,
      })
      .$returningId();

    const createdRelease = release[0];

    if (!createdRelease) {
      res.status(400).send({
        message: "Error occurred when creating release",
      });
      return;
    }

    res.status(200).send({
      message: "Release created successfully",
      data: createdRelease as Release,
    });
  };

  static updateRelease: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const releaseId = req.params.id;

      // Vérifie si la release existe
      const existingRelease = await db.query.release.findFirst({
        where: eq(schema.release.id, releaseId),
      });

      if (!existingRelease) {
        res.status(404).send({ message: "Release not found" });
        return;
      }

      // Si artistId est présent, on vérifie qu'il existe aussi
      if (req.body.artistId) {
        const artist = await db.query.artists.findFirst({
          where: eq(schema.artists.id, req.body.artistId),
        });

        if (!artist) {
          res.status(404).send({ message: "Artist ID does not exist" });
          return;
        }
      }

      // Met à jour les champs de la release
      await db
        .update(schema.release)
        .set({
          ...req.body,
          updatedAt: new Date(),
        })
        .where(eq(schema.release.id, releaseId));

      res.status(200).send({ message: "Release updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  static deleteRelease: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const releaseId = req.params.id;

      const existingRelease = await db.query.release.findFirst({
        where: eq(schema.release.id, releaseId),
      });

      if (!existingRelease) {
        res.status(404).send({ message: "Release not found" });
        return;
      }

      await db.delete(schema.release).where(eq(schema.release.id, releaseId));

      res.status(200).send({ message: "Release deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  static FindReleaseById: RequestHandler<{ releaseId: string }> = async (
    req,
    res,
    next
  ) => {
    const release = await db.query.release.findFirst({
      where: and(eq(schema.release.id, req.params.releaseId)),
    });
    if (!release) {
      res.status(404).send({
        message: `Release not found with Id : ${req.params.releaseId}`,
      });
      return;
    }
    res
      .status(200)
      .send({ message: "Release get successffuly", data: release });
  };

  static getAllReleases: RequestHandler = async (req, res, next) => {
    try {
      const releases = await db.query.release.findMany();

      res.status(200).send({
        message: "All releases fetched successfully",
        data: releases,
      });
    } catch (error) {
      next(error);
    }
  };
  static CreateReleasePackage: RequestHandler<{ releaseId: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const releaseId = req.params.releaseId;

      // Vérifier que la release existe
      const releaseExists = await db.query.release.findFirst({
        where: eq(schema.release.id, releaseId),
      });

      if (!releaseExists) {
        res.status(400).json({
          message: `No release with id ${releaseId} found`,
        });
        return;
      }
      // Parse le JSON string dans releaseData
      const releaseDataRaw = req.body.releaseData;
      if (!releaseDataRaw) {
        res.status(400).json({ error: "releaseData field is required" });
        return;
      }
      let releaseData: ReleaseData;
      try {
        releaseData = JSON.parse(releaseDataRaw);
      } catch (error) {
        res.status(400).json({ error: "Invalid JSON in releaseData" });
        return;
      }
      const files = (req.files as Express.Multer.File[] | undefined) ?? [];
      // console.log("releaseData : ", releaseData);
      // console.log("files : ", files);
      const releaseFolder = AssetPackager.packageRelease(releaseData, files);

      res.status(200).json({
        message: "Release package successfuly created",
        releaseFolder,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error creating release package", message: error });
    }
  };

  static PrepareAndValidateRelease: RequestHandler<{ releaseId: string }> =
    async (req, res, next) => {
      const messageId = `release-${uuidv4()}`;
      const releaseData: ReleaseData = req.body;

      try {
        const releaseId = req.params.releaseId;

        // Vérifier que la release existe
        const releaseExists = await db.query.release.findFirst({
          where: eq(schema.release.id, releaseId),
        });

        if (!releaseExists) {
          res.status(400).json({
            message: `No release with id ${releaseId} found`,
          });
          return;
        }

        // Valider et préparer les données de la release
        console.log("releaseData : ", releaseData);
        ReleaseService.validateReleaseData(releaseData);
        const ddexXml = DDEXMapper.mapToDDEX(releaseData, messageId);
        res
          .status(200)
          .json({ message: "Release data prepared successfully", ddexXml });
      } catch (error) {
        res.status(500).json({
          error: "Error prepare and validate release",
          message: error,
        });
      }
    };

  static SendReleaseFromFTP: RequestHandler<{ releaseId: string }> = async (
    req,
    res,
    next
  ) => {
    const { releaseFolder, ftpDetails } = req.body;

    try {
      await DeliveryService.sendViaFTP(releaseFolder, ftpDetails);
      res.status(200).json({ message: "Release sent via FTP successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error sending release via FTP" });
    }
  };

  static SendReleaseFromAPI: RequestHandler = async (req, res, next) => {
    const { releaseData, apiEndpoint } = req.body;

    try {
      const response = await DeliveryService.sendViaAPI(
        releaseData,
        apiEndpoint
      );
      res.status(200).json({ message: "Release sent via API", response });
    } catch (error) {
      res.status(500).json({ error: "Error sending release via API" });
    }
  };

  static ACKNotification: RequestHandler = async (req, res, next) => {
    const { ackXml } = req.body;

    try {
      NotificationService.processACK(ackXml);
      res.status(200).json({ message: "ACK processed successfully" });
    } catch (error) {
      res.status(400).json({ error: "Error processing ACK" });
    }
  };

  static SalesReport: RequestHandler = async (req, res, next) => {
    const salesReport: SalesReport = req.body;

    try {
      ReportingService.analyzeSalesReport(salesReport);
      ReportingService.integrateSalesReport(salesReport);
      res.status(200).json({ message: "Sales report processed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error processing sales report" });
    }
  };
}
