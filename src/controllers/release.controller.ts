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

export class ReleaseController {
  static createRelease: RequestHandler = async (req, res, next) => {
    const artists = await db.query.artists.findFirst({
      where: and(eq(schema.artists.id, req.body.artistId)),
    });
    if (!artists) {
      res.status(404).send({
        message: "Artist Id does not exist",
      });
      return;
    }

    const release = await db
      .insert(schema.release)
      .values({
        artistId: req.body.artistId,
        title: req.body.title,
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
        message: "Error occured when creating Release",
      });
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

  static PrepareAndValidateRelease: RequestHandler<{ releaseId: string }> =
    async (req, res, next) => {
      const messageId = `release-${uuidv4()}`;
      const releaseData: ReleaseData = req.body;

      try {
        // Valider et préparer les données de la release
        ReleaseService.validateReleaseData(releaseData);
        const ddexXml = DDEXMapper.mapToDDEX(releaseData, messageId);
        res
          .status(200)
          .json({ message: "Release data prepared successfully", ddexXml });
      } catch (error) {
        res.status(400).json({ error: error });
      }
    };

  static CreateReleasePackage: RequestHandler<{ releaseId: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const releaseData: ReleaseData = req.body;
      const files = (req.files as Express.Multer.File[] | undefined) ?? [];

      const releaseFolder = AssetPackager.packageRelease(releaseData, files);
      res
        .status(200)
        .json({ message: "Release package created", releaseFolder });
    } catch (error) {
      res.status(500).json({ error: "Error creating release package" });
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

  static SendReleaseFromAPI: RequestHandler<{ releaseId: string }> = async (
    req,
    res,
    next
  ) => {
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

  static ACKNotification: RequestHandler<{ releaseId: string }> = async (
    req,
    res,
    next
  ) => {
    const { ackXml } = req.body;

    try {
      NotificationService.processACK(ackXml);
      res.status(200).json({ message: "ACK processed successfully" });
    } catch (error) {
      res.status(400).json({ error: "Error processing ACK" });
    }
  };

  static SalesReport: RequestHandler<{ releaseId: string }> = async (
    req,
    res,
    next
  ) => {
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
