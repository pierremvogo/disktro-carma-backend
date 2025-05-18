import { and, eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import { CollectionTag } from '../models'

export class CollectionTagController {

    static createCollectionTag: RequestHandler<{collectionId: number, tagId: number}> = async (req, res, next) => {
         const collection = await db.query.collections.findFirst({
                where: and(
                    eq(schema.collections.id, req.params.collectionId),
                ),
                })
                if (!collection) {
                    res.status(400).send({
                         message: `Collection not found with id : ${req.params.collectionId}`
                    });
                    return;
                }
                const tag = await db.query.tags.findFirst({
                    where: and(
                        eq(schema.tags.id, req.params.tagId)
                    ),
                })
                if (!tag) {
                    res.status(404).send({
                        message: `Tag not found with id : ${req.params.tagId}`
                    });
                    return;
                }
                const collectionTags = await db.query.collectionTags.findFirst({
                    where: and(
                        eq(schema.collectionTags.tagId, req.params.tagId),
                        eq(schema.collectionTags.collectionId, req.params.collectionId)
                    ),
                    })
                    if (collectionTags) {
                            res.status(404).send({
                            message: "CollectionTag Already exist !"
                    });
                    return;
                }
            const collectionTag = await db
                .insert(schema.collectionTags)
                .values({
                    tagId: req.params.tagId,
                    collectionId: req.params.collectionId,
                })
                .$returningId()
        
            const createdCollectionTag = collectionTag[0]
        
            if (!createdCollectionTag) {
                res.status(400).send({
                    message: "Some Error occured when creating collectionTag"
                });
            }
            res.status(200).send(createdCollectionTag as CollectionTag);
    }  


    static  FindCollectionTagByCollectionIdAndTagId: RequestHandler<{collectionId:  number, tagId: number}> = async (req, res, next) => {
        const collectionTag = await db.query.collectionTags.findFirst({
                where: and(
                    eq(schema.collectionTags.collectionId, req.params.collectionId),
                    eq(schema.collectionTags.tagId, req.params.tagId)
                ),
            })
            if (!collectionTag) {
               res.status(400).send({
                    message: "Error occured when getting collection Tag by collectionId and tagId"
                });
            }
            res.status(200).send(collectionTag as CollectionTag)
        }

    static  FindCollectionTagByCollectionId: RequestHandler<{collectionId: number}> = async (req, res, next) => {
        const collectionTag = await db.query.collectionTags.findFirst({
                where: and(
                    eq(schema.collectionTags.collectionId, req.params.collectionId),
                ),
            })
            if (!collectionTag) {
               res.status(400).send({
                    message: "Error occured when getting collection Tag by collectionId"
                });
            }
            res.status(200).send(collectionTag as CollectionTag)
        }

    static  FindCollectionTagByTagId: RequestHandler<{tagId: number}> = async (req, res, next) => {
        const collectionTag = await db.query.collectionTags.findFirst({
                where: and(
                    eq(schema.collectionTags.tagId, req.params.tagId),
                ),
            })
            if (!collectionTag) {
               res.status(400).send({
                    message: "Error occured when getting collection Tag by tagId"
                });
            }
            res.status(200).send(collectionTag as CollectionTag)
        }

    static  FindCollectionTagById: RequestHandler<{id: number}> = async (req, res, next) => {
        const collectionTag = await db.query.collectionTags.findFirst({
                where: and(
                    eq(schema.collectionTags.id, req.params.id),
                ),
            })
            if (!collectionTag) {
               res.status(400).send({
                    message: "Error occured when getting collection Tag by Id"
                });
            }
            res.status(200).send(collectionTag as CollectionTag)
        }
}
