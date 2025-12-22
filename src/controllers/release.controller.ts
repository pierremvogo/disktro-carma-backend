import { and, eq, inArray } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { v4 as uuidv4 } from "uuid";
import { Multer } from "multer";
import { ReleaseData, Release, Track, SalesReport } from "../models";
import { sql } from "drizzle-orm"; // nécessaire pour les requêtes brutes comme LOWER()
import path from "path";
import * as fs from "fs";

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
    try {
      // 1. Récupération de la release seule
      const release = await db.query.release.findFirst({
        where: eq(schema.release.id, req.params.releaseId),
      });

      if (!release) {
        res.status(404).send({
          message: `Release not found with Id: ${req.params.releaseId}`,
        });
        return;
      }

      // 2. Récupération des trackReleases liés à cette release
      const trackReleases = await db.query.trackReleases.findMany({
        where: eq(schema.trackReleases.releaseId, release.id),
      });

      // 3. Récupération des tracks à partir des trackIds
      const trackIds = trackReleases.map((tr) => tr.trackId);

      let tracks: Track[] = [];
      if (trackIds.length > 0) {
        tracks = await db.query.tracks.findMany({
          where: inArray(schema.tracks.id, trackIds),
        });
      }

      // 4. Assemblage de la réponse
      const releaseWithTracks = {
        ...release,
        tracks,
      };

      res.status(200).send({
        message: "Release retrieved successfully",
        data: releaseWithTracks,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal server error" });
    }
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
  //   static CreateReleasePackage: RequestHandler<{ releaseId: string }> = async (
  //     req,
  //     res,
  //     next
  //   ) => {
  //     try {
  //       const releaseId = req.params.releaseId;

  //       // 1. Récupérer la release seule
  //       const release = await db.query.release.findFirst({
  //         where: eq(schema.release.id, releaseId),
  //       });

  //       if (!release) {
  //         res.status(404).json({
  //           message: `No release found with id ${releaseId}`,
  //         });
  //         return;
  //       }

  //       // 2. Récupérer l'artiste
  //       const artist = await db.query.artists.findFirst({
  //         where: eq(schema.artists.id, release.artistId),
  //       });

  //       // 3. Récupérer les trackReleases associés à la release
  //       const trackReleases = await db.query.trackReleases.findMany({
  //         where: eq(schema.trackReleases.releaseId, releaseId),
  //       });

  //       // 4. Pour chaque trackRelease, récupérer le track
  //       const trackIds = trackReleases.map((tr) => tr.trackId);
  //       const tracks = await db.query.tracks.findMany({
  //         where: inArray(schema.tracks.id, trackIds),
  //       });

  //       // 5. Construire releaseData manuellement
  //       const releaseData: ReleaseData = {
  //         title: release.title,
  //         upcCode: release.upcCode ?? "",
  //         releaseDate: release.releaseDate ?? "",
  //         artistName: artist?.name ?? "Unknown Artist",
  //         label: release.label ?? "",
  //         format: release.format ?? "",
  //         MessageId: release.MessageId ?? "",
  //         releaseType: release.releaseType ?? "",
  //         tracks: tracks.map((track: Track) => ({
  //           isrcCode: track?.isrcCode ?? "",
  //           slug: track?.slug ?? "",
  //           audioUrl: track?.audioUrl ?? "",
  //           moodId: track?.moodId ?? "",
  //           title: track?.title ?? "Untitled",
  //           duration: track?.duration ?? 0,

  //           // 🆕 accessibilité / contenu
  //           lyrics: track?.lyrics ?? "",
  //           signLanguageVideoUrl: track?.signLanguageVideoUrl ?? "",
  //           brailleFileUrl: track?.brailleFileUrl ?? "",

  //           // 🆕 si utile côté release / backend
  //           type: track?.type ?? "",
  //           userId: track?.userId ?? undefined,
  //         })),
  //         artistId: "",
  //         artist: undefined,
  //       };

  //       // 6. Récupérer les fichiers uploadés
  //       const files = (req.files as Express.Multer.File[] | undefined) ?? [];

  //       // 7. Appeler le service pour packager la release
  //       const releaseFolder = AssetPackager.packageRelease(releaseData, files);

  //       // 8. Réponse
  //       res.status(200).json({
  //         message: "Release package successfully created",
  //         releaseFolder,
  //       });
  //     } catch (error) {
  //       res.status(500).json({
  //         error: "Error creating release package",
  //         message: (error as Error).message,
  //       });
  //     }
  //   };

  //   static PrepareAndValidateRelease: RequestHandler<{ releaseId: string }> =
  //     async (req, res, next) => {
  //       const messageId = `release-${uuidv4()}`;
  //       try {
  //         const releaseId = req.params.releaseId;

  //         // Vérifier que la release existe
  //         const releaseExists = await db.query.release.findFirst({
  //           where: eq(schema.release.id, releaseId),
  //         });

  //         if (!releaseExists) {
  //           res.status(400).json({
  //             message: `No release with id ${releaseId} found`,
  //           });
  //           return;
  //         }
  //         const releaseFolder = path.join(
  //           __dirname,
  //           "../../uploads/",
  //           releaseExists.upcCode ?? ""
  //         );
  //         const metadataPath = path.join(releaseFolder, "metadata.json");

  //         if (!fs.existsSync(metadataPath)) {
  //           res.status(404).json({ error: "metadata.json not found" });
  //           return;
  //         }
  //         const metadataRaw = fs.readFileSync(metadataPath, "utf-8");
  //         const releaseData: ReleaseData = JSON.parse(metadataRaw);

  //         // Valider et préparer les données de la release

  //         ReleaseService.validateReleaseData(releaseData);
  //         const ddexXml = DDEXMapper.mapToDDEX(releaseData, messageId);
  //         const ddexXmlPath = path.join(
  //           __dirname,
  //           "../../uploads/",
  //           releaseExists.upcCode ?? "",
  //           "ddex.xml"
  //         );

  //         // Sauvegarde le fichier XML
  //         fs.writeFileSync(ddexXmlPath, ddexXml, "utf-8");
  //         res
  //           .status(200)
  //           .json({ message: "Release data prepared successfully", ddexXml });
  //       } catch (error) {
  //         res.status(500).json({
  //           error: "Error prepare and validate release",
  //           message: error,
  //         });
  //       }
  //     };

  //   static SendReleaseFromFTP: RequestHandler<{ releaseId: string }> = async (
  //     req,
  //     res,
  //     next
  //   ) => {
  //     const { releaseFolder, ftpDetails } = req.body;

  //     try {
  //       await DeliveryService.sendViaFTP(releaseFolder, ftpDetails);
  //       res.status(200).json({ message: "Release sent via FTP successfully" });
  //     } catch (error) {
  //       res.status(500).json({ error: "Error sending release via FTP" });
  //     }
  //   };

  //   static SendReleaseFromAPI: RequestHandler = async (req, res, next) => {
  //     const { releaseData, apiEndpoint } = req.body;

  //     try {
  //       const response = await DeliveryService.sendViaAPI(
  //         releaseData,
  //         apiEndpoint
  //       );
  //       res.status(200).json({ message: "Release sent via API", response });
  //     } catch (error) {
  //       res.status(500).json({ error: "Error sending release via API" });
  //     }
  //   };

  //   static ACKNotification: RequestHandler = async (req, res, next) => {
  //     const { ackXml } = req.body;

  //     try {
  //       NotificationService.processACK(ackXml);
  //       res.status(200).json({ message: "ACK processed successfully" });
  //     } catch (error) {
  //       res.status(400).json({ error: "Error processing ACK" });
  //     }
  //   };

  //   static SalesReport: RequestHandler = async (req, res, next) => {
  //     const salesReport: SalesReport = req.body;

  //     try {
  //       ReportingService.analyzeSalesReport(salesReport);
  //       ReportingService.integrateSalesReport(salesReport);
  //       res.status(200).json({ message: "Sales report processed successfully" });
  //     } catch (error) {
  //       res.status(500).json({ error: "Error processing sales report" });
  //     }
  //   };
  // }
}
