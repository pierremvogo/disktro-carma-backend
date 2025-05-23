import { eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { SlugMiddleware } from "../middleware/slug.middleware";
import type { Artist, Album, Tag, Track } from "../models";

export class TagController {
  static Create: RequestHandler = async (req, res, next) => {
    const slug = req.body.name.replaceAll(" ", "-");
    const slugs = await SlugMiddleware.checkduplicatedFromTag(slug);
    if (slugs) {
      res.status(403).send({
        message: `Slug Tag already exist`,
      });
      return;
    }
    const result = await db
      .insert(schema.tags)
      .values({
        name: req.body.name,
        slug: slug,
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
      const tag: Tag = { ...result } as Tag;
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

  static FindTagAlbums: RequestHandler = async (req, res, next) => {
    let limit: number = 4;
    const albumTags = await db.query.albumTags.findMany({
      where: eq(schema.albumTags.tagId, req.body.tagId),
      limit,
      with: {
        album: true,
      },
    });
    const tagAlbums: Album[] = albumTags.map(
      (ct: { album: any }) => ct.album as Album
    );
    if (!albumTags) {
      res.status(400).send({
        message: `No album Tag Found`,
      });
    }
    res.status(200).send({
      message: `Successfuly find tag album.`,
      data: tagAlbums,
    });
  };

  static FindTagArtists: RequestHandler = async (req, res, next) => {
    let limit: number = 4;
    const artistTags = await db.query.artistTags.findMany({
      where: eq(schema.artistTags.tagId, req.body.tagId),
      limit,
      with: {
        artist: true,
      },
    });
    if (!artistTags) {
      res.status(400).send({
        message: `No album Tag Found`,
      });
    }
    const tagArtists: Artist[] = artistTags.map(
      (at: { artist: any }) => at.artist as Artist
    );

    res.status(200).send({
      message: `Successfuly find tag By artist`,
      data: tagArtists,
    });
  };
}
