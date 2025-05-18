import { and, eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import { CollectionArtist } from '../models'

export class CollectionArtistController {

    static createCollectionArtist: RequestHandler<{artistId: number, collectionId: number}> = async (req, res, next) => {
            const artist = await db.query.artists.findFirst({
                        where: and(
                            eq(schema.artists.id, req.params.artistId),
                        ),
                    })
                    if (!artist) {
                       res.status(400).send({
                            message: `Artist not found with id : ${req.params.artistId}`
                        });
                        return;
                    }
            
                    const collection = await db.query.collections.findFirst({
                        where: and(
                            eq(schema.collections.id, req.params.collectionId)
                        ),
                    })
                    if (!collection) {
                       res.status(404).send({
                            message: `Collection not found with id : ${req.params.collectionId}`
                        });
                        return;
                    }
            const collectionArtists = await db.query.collectionArtists.findFirst({
                                where: and(
                                    eq(schema.collectionArtists.artistId, req.params.artistId),
                                    eq(schema.collectionArtists.collectionId, req.params.collectionId)
                                ),
                            })
                            if (collectionArtists) {
                               res.status(404).send({
                                    message: "CollectionArtist Already exist !"
                                });
                                return;
                            }
            const collectionArtist = await db
                .insert(schema.collectionArtists)
                .values({
                    artistId: req.params.artistId,
                    collectionId: req.params.collectionId,
                })
                .$returningId()
        
            const createdCollectionArtist = collectionArtist[0]
        
            if (!createdCollectionArtist) {
                res.status(404).send({
                    message: "Error occured when creating collectionArtist"
                });
            }
            res.status(200).send(createdCollectionArtist as CollectionArtist);
    }  


    static  FindCollectionArtistByArtistIdAndCollectionId:
         RequestHandler<{artistId: number, collectionId: number}> = async (req, res, next) => {

           const collectionArtist = await db.query.collectionArtists.findFirst({
                where: and(
                    eq(schema.collectionArtists.artistId, req.params.artistId),
                    eq(schema.collectionArtists.collectionId, req.params.collectionId)
                ),
            })
            if (!collectionArtist) {
               res.status(404).send({
                    message: "Error occured when getting collection Artist by artistId and collectionId"
                });
            }
            res.status(200).send(collectionArtist as CollectionArtist)
        }


    static  FindCollectionArtistByArtistId:
         RequestHandler<{artistId: number}> = async (req, res, next) => {

           const collectionArtist = await db.query.collectionArtists.findFirst({
                where: and(
                    eq(schema.collectionArtists.artistId, req.params.artistId),
                ),
            })
            if (!collectionArtist) {
               res.status(404).send({
                    message: "Error occured when getting collection Artist by artistId"
                });
            }
            res.status(200).send(collectionArtist as CollectionArtist)
        }

    static  FindCollectionArtistBycollectionId:
         RequestHandler<{collectionId: number}> = async (req, res, next) => {

           const collectionArtist = await db.query.collectionArtists.findFirst({
                where: and(
                    eq(schema.collectionArtists.collectionId, req.params.collectionId)
                ),
            })
            if (!collectionArtist) {
               res.status(404).send({
                    message: "Error occured when getting collection Artist by collectionId"
                });
            }
            res.status(200).send(collectionArtist as CollectionArtist)
        }

    static  FindCollectionArtistById:
         RequestHandler<{id: number}> = async (req, res, next) => {

           const collectionArtist = await db.query.collectionArtists.findFirst({
                where: and(
                    eq(schema.collectionArtists.id, req.params.id),
                ),
            })
            if (!collectionArtist) {
               res.status(404).send({
                    message: "Error occured when getting collection Artist by id"
                });
            }
            res.status(200).send(collectionArtist as CollectionArtist)
        }

}
