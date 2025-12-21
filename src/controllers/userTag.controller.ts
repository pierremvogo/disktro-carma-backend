import { and, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import type { UserTag } from "../models";

export class UserTagController {
  /**
   * Create user_tag relation
   * Route example: POST /userTag/create/:tagId/:userId
   */
  static create: RequestHandler<{ userId: string; tagId: string }> = async (
    req,
    res
  ) => {
    try {
      const { userId, tagId } = req.params;

      // 1) Check user exists
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
      });

      if (!user) {
        res.status(400).send({ message: `User not found with id : ${userId}` });
        return;
      }

      // ✅ Optionnel : si tu veux limiter aux artistes uniquement
      // if (user.type !== "artist") {
      //   res.status(400).send({ message: "User is not an artist." });
      //   return;
      // }

      // 2) Check tag exists
      const tag = await db.query.tags.findFirst({
        where: eq(schema.tags.id, tagId),
      });

      if (!tag) {
        res.status(400).send({ message: `Tag not found with id : ${tagId}` });
        return;
      }

      // 3) Check relation already exists
      const existing = await db.query.userTags.findFirst({
        where: and(
          eq(schema.userTags.userId, userId),
          eq(schema.userTags.tagId, tagId)
        ),
      });

      if (existing) {
        res.status(409).send({ message: "UserTag already exists" });
        return;
      }

      // 4) Insert relation
      const inserted = await db
        .insert(schema.userTags)
        .values({ userId, tagId })
        .$returningId();

      const created = inserted[0];

      if (!created) {
        res
          .status(400)
          .send({ message: "Error occured when creating userTag" });
        return;
      }

      res.status(200).send(created as UserTag);
    } catch (err) {
      console.error("Error in UserTagController.create:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };

  /**
   * Find by userId + tagId
   * Route example: GET /userTag/getByUserAndTag/:userId/:tagId
   */
  static FindUserTagByUserIdAndTagId: RequestHandler<{
    userId: string;
    tagId: string;
  }> = async (req, res) => {
    try {
      const { userId, tagId } = req.params;

      const userTag = await db.query.userTags.findFirst({
        where: and(
          eq(schema.userTags.userId, userId),
          eq(schema.userTags.tagId, tagId)
        ),
      });

      if (!userTag) {
        res.status(404).send({ message: "Not found userTag" });
        return;
      }

      res.status(200).send({ data: userTag, message: "" });
    } catch (err) {
      console.error("Error in FindUserTagByUserIdAndTagId:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };

  /**
   * Find all tags for a user
   * Route example: GET /userTag/getByUser/:userId
   */
  static FindUserTagsByUserId: RequestHandler<{ userId: string }> = async (
    req,
    res
  ) => {
    try {
      const { userId } = req.params;

      const userTags = await db.query.userTags.findMany({
        where: eq(schema.userTags.userId, userId),
      });

      if (!userTags || userTags.length === 0) {
        res.status(404).send({ message: "Not found userTags" });
        return;
      }

      res.status(200).send({ data: userTags, message: "" });
    } catch (err) {
      console.error("Error in FindUserTagsByUserId:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };

  /**
   * Find all users for a tag
   * Route example: GET /userTag/getByTag/:tagId
   */
  static FindUserTagsByTagId: RequestHandler<{ tagId: string }> = async (
    req,
    res
  ) => {
    try {
      const { tagId } = req.params;

      const userTags = await db.query.userTags.findMany({
        where: eq(schema.userTags.tagId, tagId),
      });

      if (!userTags || userTags.length === 0) {
        res.status(404).send({ message: "Not found userTags" });
        return;
      }

      res.status(200).send({ data: userTags, message: "" });
    } catch (err) {
      console.error("Error in FindUserTagsByTagId:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };

  /**
   * Find by id
   * Route example: GET /userTag/getById/:id
   */
  static FindUserTagById: RequestHandler<{ id: string }> = async (req, res) => {
    try {
      const { id } = req.params;

      const userTag = await db.query.userTags.findFirst({
        where: eq(schema.userTags.id, id),
      });

      if (!userTag) {
        res.status(404).send({ message: "Not found userTag" });
        return;
      }

      res.status(200).send({ data: userTag, message: "" });
    } catch (err) {
      console.error("Error in FindUserTagById:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };

  /**
   * Delete relation
   * Route example: DELETE /userTag/delete/:userId/:tagId
   */
  static DeleteUserTagByUserIdAndTagId: RequestHandler<{
    userId: string;
    tagId: string;
  }> = async (req, res) => {
    try {
      const { userId, tagId } = req.params;

      const existing = await db.query.userTags.findFirst({
        where: and(
          eq(schema.userTags.userId, userId),
          eq(schema.userTags.tagId, tagId)
        ),
      });

      if (!existing) {
        res.status(404).send({ message: "UserTag not found" });
        return;
      }

      await db
        .delete(schema.userTags)
        .where(
          and(
            eq(schema.userTags.userId, userId),
            eq(schema.userTags.tagId, tagId)
          )
        );

      res.status(200).send({ message: "UserTag deleted successfully" });
    } catch (err) {
      console.error("Error in DeleteUserTagByUserIdAndTagId:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };
}
