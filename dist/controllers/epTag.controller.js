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
exports.EpTagController = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
class EpTagController {
}
exports.EpTagController = EpTagController;
_a = EpTagController;
EpTagController.createEpTag = async (req, res, next) => {
    const ep = await db_1.db.query.eps.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.eps.id, req.params.epId)),
    });
    if (!ep) {
        res.status(400).send({
            message: `Ep not found with id : ${req.params.epId}`,
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
    const epTags = await db_1.db.query.epTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.epTags.tagId, req.params.tagId), (0, drizzle_orm_1.eq)(schema.epTags.epId, req.params.epId)),
    });
    if (epTags) {
        res.status(404).send({
            message: "EpTag Already exist !",
        });
        return;
    }
    const epTag = await db_1.db
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
        data: createdEpTag,
    });
};
EpTagController.FindEpTagByEpIdAndTagId = async (req, res, next) => {
    const epTag = await db_1.db.query.epTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.epTags.epId, req.params.epId), (0, drizzle_orm_1.eq)(schema.epTags.tagId, req.params.tagId)),
    });
    if (!epTag) {
        res.status(400).send({
            message: "Error occured when getting ep Tag by epId and tagId",
        });
    }
    res.status(200).send(epTag);
};
EpTagController.FindEpTagByEpId = async (req, res, next) => {
    const epTag = await db_1.db.query.epTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.epTags.epId, req.params.epId)),
    });
    if (!epTag) {
        res.status(400).send({
            message: "Error occured when getting ep Tag by epId",
        });
    }
    res.status(200).send(epTag);
};
EpTagController.FindEpTagByTagId = async (req, res, next) => {
    const epTag = await db_1.db.query.epTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.epTags.tagId, req.params.tagId)),
    });
    if (!epTag) {
        res.status(400).send({
            message: "Error occured when getting ep Tag by tagId",
        });
    }
    res.status(200).send(epTag);
};
EpTagController.FindEpTagById = async (req, res, next) => {
    const epTag = await db_1.db.query.epTags.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.epTags.id, req.params.id)),
    });
    if (!epTag) {
        res.status(400).send({
            message: "Error occured when getting ep Tag by Id",
        });
    }
    res.status(200).send(epTag);
};
