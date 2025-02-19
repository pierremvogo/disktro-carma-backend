import { and, eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import type { ArtistTag } from '../models'

export class ArtistTagController {

    static createArtistTag: RequestHandler = async (req, res, next) => {
            const artistTag = await db
                .insert(schema.artistTags)
                .values({
                    id: req.body.id,
                    artistId: req.body.artistId,
                    tagId: req.body.tagId,
                })
                .$returningId()
        
            const createdTag = artistTag[0]
        
            if (!createdTag) {
                res.status(400).send({
                    message: "Error ocuured when creating artistTag"
                });
            }
            res.status(200).send(createdTag as ArtistTag);
    }  


    static  getArtistTag: RequestHandler = async (req, res, next) => {
        const artistTag = await db.query.artistTags.findFirst({
                where: and(
                    eq(schema.artistTags.artistId, req.body.artistId),
                    eq(schema.artistTags.tagId, req.body.tagId)
                ),
            })
        
            if (!artistTag) {
               res.status(400).send({
                    message: "Error ocuured when getting artistTag"
                });
            }
            res.status(200).send(artistTag as ArtistTag)
        }
}
