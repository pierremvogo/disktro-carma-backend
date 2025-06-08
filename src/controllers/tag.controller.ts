import { eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import type { Artist, Album, Tag, Track } from "../models";
import slugify from "slugify";

export class TagController {
  static Create: RequestHandler = async (req, res, next) => {
    const tagSlug = slugify(req.body.name, { lower: true, strict: true });

    const existingTag = await db.query.tags.findFirst({
      where: eq(schema.tags.slug, tagSlug),
    });
    if (existingTag) {
      res.status(409).json({ message: "An tag with this name already exists" });
      return;
    }
    const result = await db
      .insert(schema.tags)
      .values({
        name: req.body.name,
        slug: tagSlug,
      })
      .$returningId();

    const createdTag = result[0];

    if (!createdTag) {
      res.status(400).send({
        message: "Error while creating Tag!",
      });
      return;
    }
    res.status(200).send({
      message: "Successfuly created Tag",
      data: createdTag as Tag,
    });
  };

  static FindAllTags: RequestHandler = async (req, res, next) => {
    const allTags = await db.query.tags.findMany({
      columns: {
        id: true,
        name: true,
        slug: true,
      },
    });

    if (!allTags) {
      res.status(400).send({
        message: "Some error occurred: No Tags found",
      });
      return;
    }
    res.status(200).send({
      data: allTags as Tag[],
      message: "Successfully get all tags",
    });
  };

  static FindTagById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      if (req.params.id == null) {
        res.status(400).send({
          message: "No tag ID given.!",
        });
        return;
      }
      const result = await db.query.tags.findFirst({
        where: eq(schema.tags.id, req.params.id),
        with: {
          albumTags: {
            with: {
              album: true,
            },
          },
          artistTags: {
            with: {
              artist: true,
            },
          },
          trackTags: {
            with: {
              track: true,
            },
          },
        },
      });
      if (!result) {
        res.status(400).send({
          message: `no tag with id ${req.params.id} found`,
        });
        return;
      }
      const tag: Tag = { ...result };
      if (tag == null) {
        res.status(400).send({
          message: `no tag with id ${req.params.id} found`,
        });
        return;
      } else {
        tag.albums = result?.albumTags.map(
          (at) => at.album as unknown as Album
        );
        tag.artists = result?.artistTags.map((at) => at.artist as Artist);
        tag.tracks = result?.trackTags.map((st) => st.track as Track);

        delete tag.artistTags;
        delete tag.albumTags;
        delete tag.trackTags;

        res.status(200).send({
          message: `Successfuly get tag`,
          data: tag,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error`,
      });
    }
  };

  static FindTagBySlug: RequestHandler<{ slug: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      if (req.params.slug == "") {
        res.status(400).send({
          message: `No tag slug given.`,
        });
        return;
      }
      console.log(req.params.slug);

      const tagBySlug = await db.query.tags.findFirst({
        where: eq(schema.tags.slug, req.params.slug),
      });

      if (!tagBySlug) {
        res.status(404).send({
          message: `Tag by slug not found`,
        });
        return;
      }
      res.status(200).send({
        message: `Successfuly find tag by slug.`,
        data: tagBySlug as Tag,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server Error.`,
      });
    }
  };

  static FindTagAlbums: RequestHandler<{ tagId: string }> = async (
    req,
    res,
    next
  ) => {
    let limit: number = 4;
    const albumTags = await db.query.albumTags.findMany({
      where: eq(schema.albumTags.tagId, req.params.tagId),
      limit,
      with: {
        album: true,
      },
    });
    const tagAlbums: Album[] = albumTags.map(
      (ct: { album: any }) => ct.album as Album
    );
    if (albumTags.length === 0) {
      res.status(400).send({
        message: `No album Tag Found`,
      });
      return;
    }
    res.status(200).send({
      message: `Successfuly find  album by tag.`,
      data: tagAlbums,
    });
  };

  static FindTagArtists: RequestHandler<{ tagId: string }> = async (
    req,
    res,
    next
  ) => {
    let limit: number = 4;
    const artistTags = await db.query.artistTags.findMany({
      where: eq(schema.artistTags.tagId, req.params.tagId),
      limit,
      with: {
        artist: true,
      },
    });
    if (artistTags.length === 0) {
      res.status(400).send({
        message: `No artist Tag Found`,
      });
      return;
    }
    const tagArtists: Artist[] = artistTags.map(
      (at: { artist: any }) => at.artist as Artist
    );

    res.status(200).send({
      message: `Successfuly find artists By tag`,
      data: tagArtists,
    });
  };
  static UpdateTag: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
      const id = req.params.id;
      const { name } = req.body;

      if (!name || name.trim() === "") {
        res.status(400).send({ message: "Tag name is required for update." });
        return;
      }
      // Génère un nouveau slug à partir du nouveau nom
      const slug = slugify(name, { lower: true, strict: true });
      // Vérifier que le tag existe
      const existingTag = await db.query.tags.findFirst({
        where: eq(schema.tags.id, id),
      });
      if (!existingTag) {
        res.status(404).send({ message: "Tag not found." });
        return;
      }

      // Mettre à jour le tag
      await db
        .update(schema.tags)
        .set({ name, slug })
        .where(eq(schema.tags.id, id));

      // Récupérer le tag mis à jour
      const updatedTag = await db.query.tags.findFirst({
        where: eq(schema.tags.id, id),
      });

      res.status(200).send({
        message: "Tag updated successfully.",
        data: updatedTag as Tag,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal server error." });
    }
  };

  static DeleteTag: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
      const id = req.params.id;

      // Vérifier que le tag existe
      const existingTag = await db.query.tags.findFirst({
        where: eq(schema.tags.id, id),
      });
      if (!existingTag) {
        res.status(404).send({ message: "Tag not found." });
        return;
      }

      // Supprimer le tag
      await db.delete(schema.tags).where(eq(schema.tags.id, id));

      res.status(200).send({
        message: "Tag deleted successfully.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal server error." });
    }
  };
}
