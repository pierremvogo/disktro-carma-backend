import { and, eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import { TrackCollection } from '../models'

export class TrackCollectionController {

    static createTrackCollection: RequestHandler<{trackId: number, collectionId: number}> = async (req, res, next) => {

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
        const track = await db.query.tracks.findFirst({
                            where: and(
                                eq(schema.tracks.id, req.params.trackId)
                            ),
                        })
                        if (!track) {
                            res.status(404).send({
                                message: `Track not found with id : ${req.params.trackId}`
                            });
                            return;
                        }
        const trackCollections = await db.query.trackCollections.findFirst({
                                    where: and(
                                        eq(schema.trackCollections.trackId, req.params.trackId),
                                        eq(schema.trackCollections.collectionId, req.params.collectionId)
                                    ),
                                })
                                if (trackCollections) {
                                   res.status(404).send({
                                        message: "TrackCollection Already exist !"
                                    });
                                    return;
                                }
            const trackCollection = await db
                .insert(schema.trackCollections)
                .values({
                    collectionId: req.params.collectionId,
                    trackId: req.params.trackId,
                })
                .$returningId()
        
            const createdTrackCollection = trackCollection[0]
        
            if (!createdTrackCollection) {
                res.status(400).send({
                    message: "Some Error occured when creating Track Collection"
                });
            }
            res.status(200).send(createdTrackCollection as TrackCollection);
    }  


    static  FindTrackCollectionByTrackIdAndCollectionId: RequestHandler<{collectionId: number, trackId: number}> = async (req, res, next) => {
        const trackCollection = await db.query.trackCollections.findFirst({
                where: and(
                    eq(schema.trackCollections.collectionId, req.params.collectionId),
                    eq(schema.trackCollections.trackId, req.params.trackId)
                ),
            })
            if (!trackCollection) {
               res.status(400).send({
                    message: "Error occured when getting Track Collection by trackId and collectionId"
                });
            }
            res.status(200).send(trackCollection as TrackCollection)
        }

    static  FindTrackCollectionByTrackId: RequestHandler<{trackId: number}> = async (req, res, next) => {
        const trackCollection = await db.query.trackCollections.findFirst({
                where: and(
                    eq(schema.trackCollections.trackId, req.params.trackId)
                ),
            })
            if (!trackCollection) {
               res.status(400).send({
                    message: "Error occured when getting Track Collection by trackId"
                });
            }
            res.status(200).send(trackCollection as TrackCollection)
        }
    static  FindTrackCollectionByCollectionId: RequestHandler<{collectionId: number}> = async (req, res, next) => {
        const trackCollection = await db.query.trackCollections.findFirst({
                where: and(
                    eq(schema.trackCollections.collectionId, req.params.collectionId)
                ),
            })
            if (!trackCollection) {
               res.status(400).send({
                    message: "Error occured when getting Track Collection by collectionId"
                });
            }
            res.status(200).send(trackCollection as TrackCollection)
        }

    static  FindTrackCollectionById: RequestHandler<{id: number}> = async (req, res, next) => {
        const trackCollection = await db.query.trackCollections.findFirst({
                where: and(
                    eq(schema.trackCollections.id, req.params.id)
                ),
            })
            if (!trackCollection) {
               res.status(400).send({
                    message: "Error occured when getting Track Collection by id"
                });
            }
            res.status(200).send(trackCollection as TrackCollection)
        }
}
