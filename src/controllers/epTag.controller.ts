import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { EpTag } from "../models";

export class EpTagController {
  static createEpTag: RequestHandler<{
    epId: string;
    tagId: string;
  }> = async (req, res, next) => {
    const ep = await db.query.eps.findFirst({
      where: and(eq(schema.eps.id, req.params.epId)),
    });
    if (!ep) {
      res.status(400).send({
        message: `Ep not found with id : ${req.params.epId}`,
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
    const epTags = await db.query.epTags.findFirst({
      where: and(
        eq(schema.epTags.tagId, req.params.tagId),
        eq(schema.epTags.epId, req.params.epId)
      ),
    });
    if (epTags) {
      res.status(404).send({
        message: "EpTag Already exist !",
      });
      return;
    }
    const epTag = await db
      .insert(schema.epTags)
      .values({
        tagId: req.params.tagId,
        epId: req.params.epId,
      })
      .$returningId();

    const createdEpTag = epTag[0];

    if (!createdEpTag) {
      res.status(400).send({
        message: "Some Error occured when creating epTag",
      });
    }
    res.status(200).send({
      message: "Tag successfully associated with ep",
      data: createdEpTag as EpTag,
    });
  };

  static FindEpTagByEpIdAndTagId: RequestHandler<{
    epId: string;
    tagId: string;
  }> = async (req, res, next) => {
    const epTag = await db.query.epTags.findFirst({
      where: and(
        eq(schema.epTags.epId, req.params.epId),
        eq(schema.epTags.tagId, req.params.tagId)
      ),
    });
    if (!epTag) {
      res.status(400).send({
        message: "Error occured when getting ep Tag by epId and tagId",
      });
    }
    res.status(200).send(epTag as EpTag);
  };

  static FindEpTagByEpId: RequestHandler<{
    epId: string;
  }> = async (req, res, next) => {
    const epTag = await db.query.epTags.findFirst({
      where: and(eq(schema.epTags.epId, req.params.epId)),
    });
    if (!epTag) {
      res.status(400).send({
        message: "Error occured when getting ep Tag by epId",
      });
    }
    res.status(200).send(epTag as EpTag);
  };

  static FindEpTagByTagId: RequestHandler<{ tagId: string }> = async (
    req,
    res,
    next
  ) => {
    const epTag = await db.query.epTags.findFirst({
      where: and(eq(schema.epTags.tagId, req.params.tagId)),
    });
    if (!epTag) {
      res.status(400).send({
        message: "Error occured when getting ep Tag by tagId",
      });
    }
    res.status(200).send(epTag as EpTag);
  };

  static FindEpTagById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    const epTag = await db.query.epTags.findFirst({
      where: and(eq(schema.epTags.id, req.params.id)),
    });
    if (!epTag) {
      res.status(400).send({
        message: "Error occured when getting ep Tag by Id",
      });
    }
    res.status(200).send(epTag as EpTag);
  };
}
