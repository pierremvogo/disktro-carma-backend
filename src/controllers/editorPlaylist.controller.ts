import { and, desc, eq, inArray, sql, asc } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";

export class EditorPlaylistController {
  // Reuse: enrich tracks (coverUrl/collectionType/Id/Title)
  static async getTracksWithCover(trackIds: string[]) {
    if (!trackIds.length) return [];

    return db
      .select({
        id: schema.tracks.id,
        isrcCode: schema.tracks.isrcCode,
        title: schema.tracks.title,
        slug: schema.tracks.slug,
        type: schema.tracks.type,
        userId: schema.tracks.userId,
        duration: schema.tracks.duration,
        moodId: schema.tracks.moodId,
        audioUrl: schema.tracks.audioUrl,
        lyrics: schema.tracks.lyrics,
        signLanguageVideoUrl: schema.tracks.signLanguageVideoUrl,
        brailleFileUrl: schema.tracks.brailleFileUrl,
        createdAt: schema.tracks.createdAt,
        updatedAt: schema.tracks.updatedAt,

        coverUrl: sql<string | null>`
          COALESCE(${schema.singles.coverUrl}, ${schema.eps.coverUrl}, ${schema.albums.coverUrl})
        `.as("coverUrl"),

        collectionTitle: sql<string | null>`
          COALESCE(${schema.singles.title}, ${schema.eps.title}, ${schema.albums.title})
        `.as("collectionTitle"),

        collectionId: sql<string | null>`
          COALESCE(${schema.trackSingles.singleId}, ${schema.trackEps.epId}, ${schema.trackAlbums.albumId})
        `.as("collectionId"),

        collectionType: sql<string>`
          CASE
            WHEN ${schema.trackSingles.singleId} IS NOT NULL THEN 'single'
            WHEN ${schema.trackEps.epId} IS NOT NULL THEN 'ep'
            WHEN ${schema.trackAlbums.albumId} IS NOT NULL THEN 'album'
            ELSE 'unknown'
          END
        `.as("collectionType"),
      })
      .from(schema.tracks)
      .leftJoin(
        schema.trackAlbums,
        eq(schema.trackAlbums.trackId, schema.tracks.id)
      )
      .leftJoin(schema.albums, eq(schema.albums.id, schema.trackAlbums.albumId))
      .leftJoin(schema.trackEps, eq(schema.trackEps.trackId, schema.tracks.id))
      .leftJoin(schema.eps, eq(schema.eps.id, schema.trackEps.epId))
      .leftJoin(
        schema.trackSingles,
        eq(schema.trackSingles.trackId, schema.tracks.id)
      )
      .leftJoin(
        schema.singles,
        eq(schema.singles.id, schema.trackSingles.singleId)
      )
      .where(inArray(schema.tracks.id, trackIds));
  }

  /**
   * FAN: GET /editorPlaylist/getAll?locale=en&limit=20
   */
  static GetAllPublished: RequestHandler = async (req, res) => {
    try {
      const limit = Number(req.query.limit ?? 20);
      const locale = String(req.query.locale ?? "en");

      const playlists = await db.query.editorPlaylists.findMany({
        where: and(
          eq(schema.editorPlaylists.isPublished, true),
          eq(schema.editorPlaylists.locale, locale)
        ),
        orderBy: [
          desc(schema.editorPlaylists.priority),
          desc(schema.editorPlaylists.createdAt),
        ],
        limit,
        with: {
          tracks: true, // editorPlaylistTracks rows
        },
      });

      // For each playlist, fetch tracks details + keep order by position
      const data = await Promise.all(
        playlists.map(async (p: any) => {
          const pivot = (p.tracks ?? []).sort(
            (a: any, b: any) => a.position - b.position
          );
          const trackIds = pivot.map((x: any) => x.trackId);

          const tracks =
            await EditorPlaylistController.getTracksWithCover(trackIds);

          // preserve ordering by pivot
          const mapById = new Map(tracks.map((t: any) => [t.id, t]));
          const ordered = trackIds
            .map((id: string) => mapById.get(id))
            .filter(Boolean);

          return {
            id: p.id,
            name: p.name,
            description: p.description ?? "",
            coverUrl: p.coverUrl ?? null,
            songCount: ordered.length,
            tracks: ordered, // full tracks
          };
        })
      );

      res.status(200).send({ message: "Editor playlists fetched", data });
    } catch (err) {
      console.error("GetAllPublished error:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };

  /**
   * FAN: GET /editorPlaylist/getById/:id
   */
  static GetById: RequestHandler<{ id: string }> = async (req, res) => {
    try {
      const p = await db.query.editorPlaylists.findFirst({
        where: eq(schema.editorPlaylists.id, req.params.id),
        with: { tracks: true },
      });

      if (!p) {
        res.status(404).send({ message: "Editor playlist not found" });
        return;
      }

      const pivot = (p.tracks ?? []).sort(
        (a: any, b: any) => a.position - b.position
      );
      const trackIds = pivot.map((x: any) => x.trackId);

      const tracks =
        await EditorPlaylistController.getTracksWithCover(trackIds);
      const mapById = new Map(tracks.map((t: any) => [t.id, t]));
      const ordered = trackIds
        .map((id: string) => mapById.get(id))
        .filter(Boolean);

      res.status(200).send({
        message: "Editor playlist fetched",
        data: {
          id: p.id,
          name: p.name,
          description: p.description ?? "",
          coverUrl: p.coverUrl ?? null,
          isPublished: p.isPublished,
          priority: p.priority,
          locale: p.locale,
          songCount: ordered.length,
          tracks: ordered,
        },
      });
    } catch (err) {
      console.error("GetById error:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };

  /**
   * ADMIN: POST /editorPlaylist/create
   * body: { name, description?, coverUrl?, locale?, priority? }
   */
  static Create: RequestHandler = async (req, res) => {
    try {
      const createdByUserId = (req as any).user?.id as string | undefined;

      const { name, description, coverUrl, locale, priority } = req.body;
      if (!name || String(name).trim() === "") {
        res.status(400).send({ message: "name is required" });
        return;
      }

      const inserted = await db
        .insert(schema.editorPlaylists)
        .values({
          name: String(name),
          description: description ?? null,
          coverUrl: coverUrl ?? null,
          locale: locale ?? "en",
          priority: Number(priority ?? 0),
          isPublished: false,
          createdByUserId: createdByUserId ?? null,
        })
        .$returningId();

      const created = inserted[0];
      if (!created) {
        res.status(400).send({ message: "Error creating editor playlist" });
        return;
      }

      res
        .status(201)
        .send({ message: "Editor playlist created", data: created });
    } catch (err) {
      console.error("Create editor playlist error:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };

  /**
   * ADMIN: POST /editorPlaylist/:id/addTrack/:trackId
   * body: { position? }
   */
  static AddTrack: RequestHandler<{ id: string; trackId: string }> = async (
    req,
    res
  ) => {
    try {
      const { id, trackId } = req.params;
      const position = Number(req.body?.position ?? 0);

      // prevent duplicates via unique index; catch conflict if needed
      const inserted = await db
        .insert(schema.editorPlaylistTracks)
        .values({
          editorPlaylistId: id,
          trackId,
          position,
        })
        .$returningId();

      res
        .status(201)
        .send({ message: "Track added to editor playlist", data: inserted[0] });
    } catch (err) {
      console.error("AddTrack error:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };

  /**
   * ADMIN: POST /editorPlaylist/:id/publish
   */
  static Publish: RequestHandler<{ id: string }> = async (req, res) => {
    try {
      await db
        .update(schema.editorPlaylists)
        .set({ isPublished: true })
        .where(eq(schema.editorPlaylists.id, req.params.id));

      res.status(200).send({ message: "Editor playlist published" });
    } catch (err) {
      console.error("Publish error:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };
}
