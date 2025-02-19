import { and, eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import { TrackCollection } from '../models'

export class TrackCollectionController {

    static createTrackCollection: RequestHandler = async (req, res, next) => {
            const trackCollection = await db
                .insert(schema.trackCollections)
                .values({
                    collectionId: req.body.collectionId,
                    trackId: req.body.trackId,
                })
                .$returningId()
        
            const createdTrackCollection = trackCollection[0]
        
            if (!createdTrackCollection) {
                res.status(400).send({
                    message: "Some Error occured when creating Track Artist"
                });
            }
            res.status(200).send(createdTrackCollection as TrackCollection);
    }  


    static  FindTrackCollection: RequestHandler = async (req, res, next) => {
        const trackCollection = await db.query.trackCollections.findFirst({
                where: and(
                    eq(schema.trackCollections.collectionId, req.body.collectionId),
                    eq(schema.trackCollections.trackId, req.body.trackId)
                ),
            })
            if (!trackCollection) {
               res.status(400).send({
                    message: "Error occured when getting Track Collection"
                });
            }
            res.status(200).send(trackCollection as TrackCollection)
        }
}
