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
exports.SingleTagController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class SingleTagController {
}
exports.SingleTagController = SingleTagController;
_a = SingleTagController;
SingleTagController.createSingleTag = async (req, res, next) => {
    const single = await db_1.db.query.singles.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.singles.id, req.params.singleId)),
    });
    if (!single) {
        res.status(400).send({
            message: `Single not found with id : ${req.params.singleId}`,
        });
        return;
    }
    const tag = await db_1.db.query.tags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.tags.id, req.params.tagId)),
    });
    if (!tag) {
        res.status(404).send({
            message: `Tag not found with id : ${req.params.tagId}`,
        });
        return;
    }
    const singleTags = await db_1.db.query.singleTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.singleTags.tagId, req.params.tagId), (0, drizzle_orm_1.eq)(schema.singleTags.singleId, req.params.singleId)),
    });
    if (singleTags) {
        res.status(404).send({
            message: "SingleTag Already exist !",
        });
        return;
    }
    const singleTag = await db_1.db
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
        data: createdSingleTag,
    });
};
SingleTagController.FindSingleTagBySingleIdAndTagId = async (req, res, next) => {
    const singleTag = await db_1.db.query.singleTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.singleTags.singleId, req.params.singleId), (0, drizzle_orm_1.eq)(schema.singleTags.tagId, req.params.tagId)),
    });
    if (!singleTag) {
        res.status(400).send({
            message: "Error occured when getting single Tag by singleId and tagId",
        });
    }
    res.status(200).send(singleTag);
};
SingleTagController.FindSingleTagBySingleId = async (req, res, next) => {
    const singleTag = await db_1.db.query.singleTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.singleTags.singleId, req.params.singleId)),
    });
    if (!singleTag) {
        res.status(400).send({
            message: "Error occured when getting single Tag by singleId",
        });
    }
    res.status(200).send(singleTag);
};
SingleTagController.FindSingleTagByTagId = async (req, res, next) => {
    const singleTag = await db_1.db.query.singleTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.singleTags.tagId, req.params.tagId)),
    });
    if (!singleTag) {
        res.status(400).send({
            message: "Error occured when getting single Tag by tagId",
        });
    }
    res.status(200).send(singleTag);
};
SingleTagController.FindSingleTagById = async (req, res, next) => {
    const singleTag = await db_1.db.query.singleTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.singleTags.id, req.params.id)),
    });
    if (!singleTag) {
        res.status(400).send({
            message: "Error occured when getting single Tag by Id",
        });
    }
    res.status(200).send(singleTag);
};
