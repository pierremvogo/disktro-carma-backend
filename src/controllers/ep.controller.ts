import { and, eq, inArray } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import type { Artist, Ep, Tag, Track } from "../models";
import slugify from "slugify";

export class EpController {
  static create: RequestHandler = async (req, res, next) => {
    try {
      const {
        title,
        duration,
        userId,
        coverUrl,
        coverFileName,
        // 👉 nouveaux champs
        authors,
        producers,
        lyricists,
        musiciansVocals,
        musiciansPianoKeyboards,
        musiciansWinds,
        musiciansPercussion,
        musiciansStrings,
        mixingEngineer,
        masteringEngineer,
      } = req.body;

      if (!title || !userId || !coverUrl) {
        res.status(400).json({
          message: "title, userId et coverUrl sont requis",
        });
        return;
      }

      const epSlug = slugify(title, { lower: true, strict: true });

      const existingName = await db.query.eps.findFirst({
        where: eq(schema.eps.slug, epSlug),
      });

      if (existingName) {
        res
          .status(409)
          .json({ message: "An ep with this name already exists" });
        return;
      }

      const ep = await db
        .insert(schema.eps)
        .values({
          title,
          slug: epSlug,
          userId,
          duration,
          coverUrl,
          coverFileName,
          // 🆕 crédits
          authors,
          producers,
          lyricists,
          musiciansVocals,
          musiciansPianoKeyboards,
          musiciansWinds,
          musiciansPercussion,
          musiciansStrings,
          mixingEngineer,
          masteringEngineer,
        })
        .$returningId();

      const createdEp = ep[0];

      if (!createdEp) {
        res.status(400).send({
          message: "Error occurred when creating ep",
        });
        return;
      }

      res.status(200).send({
        message: "Ep created successfully",
        data: createdEp as Ep,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  };

  static FindAllEps: RequestHandler = async (req, res, next) => {
    try {
      const allEps = await db.query.eps.findMany({
        columns: {
          id: true,
          title: true,
          slug: true,
          duration: true,
          coverUrl: true,
          coverFileName: true,
          // tu peux choisir ce que tu exposes
          authors: true,
          producers: true,
          mixingEngineer: true,
          masteringEngineer: true,
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
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  };

  static FindEpByArtistAndSlug: RequestHandler = async (req, res, next) => {
    try {
      const coll = await db
        .select({
          id: schema.eps.id,
          title: schema.eps.title,
          slug: schema.eps.slug,
          duration: schema.eps.duration,
          coverUrl: schema.eps.coverUrl,
          coverFileName: schema.eps.coverFileName,
          // 🆕 crédits
          authors: schema.eps.authors,
          producers: schema.eps.producers,
          lyricists: schema.eps.lyricists,
          musiciansVocals: schema.eps.musiciansVocals,
          musiciansPianoKeyboards: schema.eps.musiciansPianoKeyboards,
          musiciansWinds: schema.eps.musiciansWinds,
          musiciansPercussion: schema.eps.musiciansPercussion,
          musiciansStrings: schema.eps.musiciansStrings,
          mixingEngineer: schema.eps.mixingEngineer,
          masteringEngineer: schema.eps.masteringEngineer,

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
        .limit(1)
        .execute();

      if (!coll[0]) {
        res.status(404).send({
          message: "Ep not found for this artist and slug",
        });
        return;
      }

      res.status(200).send({
        message: "Get ep by artist and slug successfully",
        data: coll[0] as Ep,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Internal server error",
      });
    }
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
        delete (a as any).epTags;
        delete (a as any).trackEps;

        res.status(200).send({
          message: `Successfully get Ep`,
          ep: a as Ep,
        });
      }
    } catch (err) {
      console.error(err);
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

      const artist = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
      });

      if (!artist) {
        res
          .status(404)
          .send({ message: "Artist not found with the given ID." });
        return;
      }

      const eps = await db.query.eps.findMany({
        where: eq(schema.eps.userId, userId),
        with: {
          user: true,
          trackEps: {
            with: {
              track: true,
            },
          },
        },
      });

      if (!eps || eps.length === 0) {
        res.status(200).send({
          message: "Successfully retrieved all eps for this artist.",
          eps: [],
        });
        return;
      }

      // ========== STATS STREAMS POUR TOUS LES EPS ==========

      // Récupérer tous les trackIds de tous les EPs
      const allTrackIds = eps.flatMap((ep) =>
        ep.trackEps.map((te) => te.trackId)
      );

      // Si aucun track, on renvoie les eps tels quels, avec stats à zéro
      if (allTrackIds.length === 0) {
        const epsWithStats = eps.map((ep) => ({
          ...ep,
          streamsCount: 0,
          monthlyStreamsCount: 0,
          listenersCount: 0,
          topLocations: [] as {
            location: string;
            streams: number;
            percentage: string;
          }[],
        }));

        res.status(200).send({
          message: "Successfully retrieved all eps for this artist.",
          eps: epsWithStats,
        });
        return;
      }

      // 1️⃣ Récupérer tous les streams pour ces tracks
      const allStreams = await db.query.trackStreams.findMany({
        where: inArray(schema.trackStreams.trackId, allTrackIds),
      });

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // 2️⃣ Pour chaque EP, calculer les stats à partir des streams
      const epsWithStats = eps.map((ep) => {
        const epTrackIds = ep.trackEps.map((te) => te.trackId);

        const streamsForEp = allStreams.filter((s) =>
          epTrackIds.includes(s.trackId)
        );

        const streamsCount = streamsForEp.length;
        const monthlyStreamsCount = streamsForEp.filter(
          (s) => s.createdAt >= thirtyDaysAgo
        ).length;

        const listenersSet = new Set(
          streamsForEp
            .map((s) => s.userId)
            .filter((id): id is string => !!id && id.length > 0)
        );
        const listenersCount = listenersSet.size;

        // Agrégation des streams par pays
        const locationMap = new Map<string, number>();
        for (const s of streamsForEp) {
          const country = s.country || "Unknown";
          const prev = locationMap.get(country) ?? 0;
          locationMap.set(country, prev + 1);
        }

        const totalByLocation = Array.from(locationMap.values()).reduce(
          (sum, v) => sum + v,
          0
        );

        const topLocations = Array.from(locationMap.entries())
          .map(([location, streams]) => ({
            location,
            streams,
            percentage:
              totalByLocation > 0
                ? `${((streams / totalByLocation) * 100).toFixed(1)}%`
                : "0%",
          }))
          .sort((a, b) => b.streams - a.streams);

        return {
          ...ep,
          streamsCount,
          monthlyStreamsCount,
          listenersCount,
          topLocations,
        };
      });

      res.status(200).send({
        message: "Successfully retrieved all eps for this artist.",
        eps: epsWithStats,
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

      // Title + slug uniquement si title fourni
      if (req.body.title !== undefined) {
        updatedFields.title = req.body.title;
        updatedFields.slug = slugify(req.body.title, {
          lower: true,
          strict: true,
        });
      }

      if (req.body.duration !== undefined)
        updatedFields.duration = req.body.duration;
      if (req.body.coverUrl !== undefined)
        updatedFields.coverUrl = req.body.coverUrl;

      // 🆕 crédits
      if (req.body.authors !== undefined)
        updatedFields.authors = req.body.authors;
      if (req.body.producers !== undefined)
        updatedFields.producers = req.body.producers;
      if (req.body.lyricists !== undefined)
        updatedFields.lyricists = req.body.lyricists;

      if (req.body.musiciansVocals !== undefined)
        updatedFields.musiciansVocals = req.body.musiciansVocals;
      if (req.body.musiciansPianoKeyboards !== undefined)
        updatedFields.musiciansPianoKeyboards =
          req.body.musiciansPianoKeyboards;
      if (req.body.musiciansWinds !== undefined)
        updatedFields.musiciansWinds = req.body.musiciansWinds;
      if (req.body.musiciansPercussion !== undefined)
        updatedFields.musiciansPercussion = req.body.musiciansPercussion;
      if (req.body.musiciansStrings !== undefined)
        updatedFields.musiciansStrings = req.body.musiciansStrings;

      if (req.body.mixingEngineer !== undefined)
        updatedFields.mixingEngineer = req.body.mixingEngineer;
      if (req.body.masteringEngineer !== undefined)
        updatedFields.masteringEngineer = req.body.masteringEngineer;

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

      const ep = await db.query.eps.findFirst({
        where: eq(schema.eps.id, id),
      });
      if (!ep) {
        res.status(404).send({ message: "Ep not found" });
        return;
      }

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
