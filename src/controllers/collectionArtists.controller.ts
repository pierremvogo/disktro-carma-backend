import { and, eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import { CollectionArtist } from '../models'

export class CollectionArtistController {

    static createCollectionArtist: RequestHandler = async (req, res, next) => {
            const collectionArtist = await db
                .insert(schema.collectionArtists)
                .values({
                    artistId: req.body.artistId,
                    collectionId: req.body.collectionId,
                })
                .$returningId()
        
            const createdCollectionArtist = collectionArtist[0]
        
            if (!createdCollectionArtist) {
                res.status(400).send({
                    message: "Error occured when creating collectionArtist"
                });
            }
            res.status(200).send(createdCollectionArtist as CollectionArtist);
    }  


    static  FindCollectionArtist: RequestHandler = async (req, res, next) => {
        const collectionArtist = await db.query.collectionArtists.findFirst({
                where: and(
                    eq(schema.collectionArtists.artistId, req.body.artistId),
                    eq(schema.collectionArtists.collectionId, req.body.collectionId)
                ),
            })
            if (!collectionArtist) {
               res.status(400).send({
                    message: "Error occured when getting collection Artist"
                });
            }
            res.status(200).send(collectionArtist as CollectionArtist)
        }
}
