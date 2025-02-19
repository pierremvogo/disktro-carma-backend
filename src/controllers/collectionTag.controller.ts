import { and, eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import { CollectionTag } from '../models'

export class CollectionTagController {

    static createCollectionTag: RequestHandler = async (req, res, next) => {
            const collectionTag = await db
                .insert(schema.collectionTags)
                .values({
                    tagId: req.body.tagId,
                    collectionId: req.body.collectionId,
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


    static  FindCollectionTag: RequestHandler = async (req, res, next) => {
        const collectionTag = await db.query.collectionTags.findFirst({
                where: and(
                    eq(schema.collectionTags.collectionId, req.body.collectionId),
                    eq(schema.collectionTags.tagId, req.body.tagId)
                ),
            })
            if (!collectionTag) {
               res.status(400).send({
                    message: "Error occured when getting collection Tag"
                });
            }
            res.status(200).send(collectionTag as CollectionTag)
        }
}
