"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTagController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class UserTagController {
}
exports.UserTagController = UserTagController;
_a = UserTagController;
/**
 * Create user_tag relation
 * Route example: POST /userTag/create/:tagId/:userId
 */
UserTagController.create = async (req, res) => {
    try {
        const { userId, tagId } = req.params;
        // 1) Check user exists
        const user = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, userId),
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
        const tag = await db_1.db.query.tags.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.tags.id, tagId),
        });
        if (!tag) {
            res.status(400).send({ message: `Tag not found with id : ${tagId}` });
            return;
        }
        // 3) Check relation already exists
        const existing = await db_1.db.query.userTags.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.userTags.userId, userId), (0, drizzle_orm_1.eq)(schema.userTags.tagId, tagId)),
        });
        if (existing) {
            res.status(409).send({ message: "UserTag already exists" });
            return;
        }
        // 4) Insert relation
        const inserted = await db_1.db
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
        res.status(200).send(created);
    }
    catch (err) {
        console.error("Error in UserTagController.create:", err);
        res.status(500).send({ message: "Internal server error" });
    }
};
/**
 * Find by userId + tagId
 * Route example: GET /userTag/getByUserAndTag/:userId/:tagId
 */
UserTagController.FindUserTagByUserIdAndTagId = async (req, res) => {
    try {
        const { userId, tagId } = req.params;
        const userTag = await db_1.db.query.userTags.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.userTags.userId, userId), (0, drizzle_orm_1.eq)(schema.userTags.tagId, tagId)),
        });
        if (!userTag) {
            res.status(404).send({ message: "Not found userTag" });
            return;
        }
        res.status(200).send({ data: userTag, message: "" });
    }
    catch (err) {
        console.error("Error in FindUserTagByUserIdAndTagId:", err);
        res.status(500).send({ message: "Internal server error" });
    }
};
/**
 * Find all tags for a user
 * Route example: GET /userTag/getByUser/:userId
 */
UserTagController.FindUserTagsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const userTags = await db_1.db.query.userTags.findMany({
            where: (0, drizzle_orm_1.eq)(schema.userTags.userId, userId),
        });
        if (!userTags || userTags.length === 0) {
            res.status(404).send({ message: "Not found userTags" });
            return;
        }
        res.status(200).send({ data: userTags, message: "" });
    }
    catch (err) {
        console.error("Error in FindUserTagsByUserId:", err);
        res.status(500).send({ message: "Internal server error" });
    }
};
/**
 * Find all users for a tag
 * Route example: GET /userTag/getByTag/:tagId
 */
UserTagController.FindUserTagsByTagId = async (req, res) => {
    try {
        const { tagId } = req.params;
        const userTags = await db_1.db.query.userTags.findMany({
            where: (0, drizzle_orm_1.eq)(schema.userTags.tagId, tagId),
        });
        if (!userTags || userTags.length === 0) {
            res.status(404).send({ message: "Not found userTags" });
            return;
        }
        res.status(200).send({ data: userTags, message: "" });
    }
    catch (err) {
        console.error("Error in FindUserTagsByTagId:", err);
        res.status(500).send({ message: "Internal server error" });
    }
};
/**
 * Find by id
 * Route example: GET /userTag/getById/:id
 */
UserTagController.FindUserTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const userTag = await db_1.db.query.userTags.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.userTags.id, id),
        });
        if (!userTag) {
            res.status(404).send({ message: "Not found userTag" });
            return;
        }
        res.status(200).send({ data: userTag, message: "" });
    }
    catch (err) {
        console.error("Error in FindUserTagById:", err);
        res.status(500).send({ message: "Internal server error" });
    }
};
/**
 * Delete relation
 * Route example: DELETE /userTag/delete/:userId/:tagId
 */
UserTagController.DeleteUserTagByUserIdAndTagId = async (req, res) => {
    try {
        const { userId, tagId } = req.params;
        const existing = await db_1.db.query.userTags.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.userTags.userId, userId), (0, drizzle_orm_1.eq)(schema.userTags.tagId, tagId)),
        });
        if (!existing) {
            res.status(404).send({ message: "UserTag not found" });
            return;
        }
        await db_1.db
            .delete(schema.userTags)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.userTags.userId, userId), (0, drizzle_orm_1.eq)(schema.userTags.tagId, tagId)));
        res.status(200).send({ message: "UserTag deleted successfully" });
    }
    catch (err) {
        console.error("Error in DeleteUserTagByUserIdAndTagId:", err);
        res.status(500).send({ message: "Internal server error" });
    }
};
