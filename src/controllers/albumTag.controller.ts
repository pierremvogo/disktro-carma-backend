import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { AlbumTag } from "../models";

export class AlbumTagController {
  static createAlbumTag: RequestHandler<{
    albumId: string;
    tagId: string;
  }> = async (req, res, next) => {
    const album = await db.query.albums.findFirst({
      where: and(eq(schema.albums.id, req.params.albumId)),
    });
    if (!album) {
      res.status(400).send({
        message: `Album not found with id : ${req.params.albumId}`,
      });
      return;
    }
    const tag = await db.query.tags.findFirst({
      where: and(eq(schema.tags.id, req.params.tagId)),
    });
    if (!tag) {
      res.status(404).send({
        message: `Tag not found with id : ${req.params.tagId}`,
      });
      return;
    }
    const albumTags = await db.query.albumTags.findFirst({
      where: and(
        eq(schema.albumTags.tagId, req.params.tagId),
        eq(schema.albumTags.albumId, req.params.albumId)
      ),
    });
    if (albumTags) {
      res.status(404).send({
        message: "AlbumTag Already exist !",
      });
      return;
    }
    const albumTag = await db
      .insert(schema.albumTags)
      .values({
        tagId: req.params.tagId,
        albumId: req.params.albumId,
      })
      .$returningId();

    const createdAlbumTag = albumTag[0];

    if (!createdAlbumTag) {
      res.status(400).send({
        message: "Some Error occured when creating albumTag",
      });
    }
    res.status(200).send(createdAlbumTag as AlbumTag);
  };

  static FindAlbumTagByAlbumIdAndTagId: RequestHandler<{
    albumId: string;
    tagId: string;
  }> = async (req, res, next) => {
    const albumTag = await db.query.albumTags.findFirst({
      where: and(
        eq(schema.albumTags.albumId, req.params.albumId),
        eq(schema.albumTags.tagId, req.params.tagId)
      ),
    });
    if (!albumTag) {
      res.status(400).send({
        message: "Error occured when getting album Tag by albumId and tagId",
      });
    }
    res.status(200).send(albumTag as AlbumTag);
  };

  static FindAlbumTagByAlbumId: RequestHandler<{
    albumId: string;
  }> = async (req, res, next) => {
    const albumTag = await db.query.albumTags.findFirst({
      where: and(eq(schema.albumTags.albumId, req.params.albumId)),
    });
    if (!albumTag) {
      res.status(400).send({
        message: "Error occured when getting album Tag by albumId",
      });
    }
    res.status(200).send(albumTag as AlbumTag);
  };

  static FindAlbumTagByTagId: RequestHandler<{ tagId: string }> = async (
    req,
    res,
    next
  ) => {
    const albumTag = await db.query.albumTags.findFirst({
      where: and(eq(schema.albumTags.tagId, req.params.tagId)),
    });
    if (!albumTag) {
      res.status(400).send({
        message: "Error occured when getting album Tag by tagId",
      });
    }
    res.status(200).send(albumTag as AlbumTag);
  };

  static FindAlbumTagById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    const albumTag = await db.query.albumTags.findFirst({
      where: and(eq(schema.albumTags.id, req.params.id)),
    });
    if (!albumTag) {
      res.status(400).send({
        message: "Error occured when getting album Tag by Id",
      });
    }
    res.status(200).send(albumTag as AlbumTag);
  };
}
