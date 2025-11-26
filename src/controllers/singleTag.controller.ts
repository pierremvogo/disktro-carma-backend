import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { SingleTag } from "../models";

export class SingleTagController {
  static createSingleTag: RequestHandler<{
    singleId: string;
    tagId: string;
  }> = async (req, res, next) => {
    const single = await db.query.singles.findFirst({
      where: and(eq(schema.singles.id, req.params.singleId)),
    });
    if (!single) {
      res.status(400).send({
        message: `Single not found with id : ${req.params.singleId}`,
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
    const singleTags = await db.query.singleTags.findFirst({
      where: and(
        eq(schema.singleTags.tagId, req.params.tagId),
        eq(schema.singleTags.singleId, req.params.singleId)
      ),
    });
    if (singleTags) {
      res.status(404).send({
        message: "SingleTag Already exist !",
      });
      return;
    }
    const singleTag = await db
      .insert(schema.singleTags)
      .values({
        tagId: req.params.tagId,
        singleId: req.params.singleId,
      })
      .$returningId();

    const createdSingleTag = singleTag[0];

    if (!createdSingleTag) {
      res.status(400).send({
        message: "Some Error occured when creating singleTag",
      });
    }
    res.status(200).send({
      message: "Tag successfully associated with single",
      data: createdSingleTag as SingleTag,
    });
  };

  static FindSingleTagBySingleIdAndTagId: RequestHandler<{
    singleId: string;
    tagId: string;
  }> = async (req, res, next) => {
    const singleTag = await db.query.singleTags.findFirst({
      where: and(
        eq(schema.singleTags.singleId, req.params.singleId),
        eq(schema.singleTags.tagId, req.params.tagId)
      ),
    });
    if (!singleTag) {
      res.status(400).send({
        message: "Error occured when getting single Tag by singleId and tagId",
      });
    }
    res.status(200).send(singleTag as SingleTag);
  };

  static FindSingleTagBySingleId: RequestHandler<{
    singleId: string;
  }> = async (req, res, next) => {
    const singleTag = await db.query.singleTags.findFirst({
      where: and(eq(schema.singleTags.singleId, req.params.singleId)),
    });
    if (!singleTag) {
      res.status(400).send({
        message: "Error occured when getting single Tag by singleId",
      });
    }
    res.status(200).send(singleTag as SingleTag);
  };

  static FindSingleTagByTagId: RequestHandler<{ tagId: string }> = async (
    req,
    res,
    next
  ) => {
    const singleTag = await db.query.singleTags.findFirst({
      where: and(eq(schema.singleTags.tagId, req.params.tagId)),
    });
    if (!singleTag) {
      res.status(400).send({
        message: "Error occured when getting single Tag by tagId",
      });
    }
    res.status(200).send(singleTag as SingleTag);
  };

  static FindSingleTagById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    const singleTag = await db.query.singleTags.findFirst({
      where: and(eq(schema.singleTags.id, req.params.id)),
    });
    if (!singleTag) {
      res.status(400).send({
        message: "Error occured when getting single Tag by Id",
      });
    }
    res.status(200).send(singleTag as SingleTag);
  };
}
