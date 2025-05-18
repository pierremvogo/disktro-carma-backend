import { and, eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import { TrackTag } from '../models'

export class TrackTagController {

    static createTrackTag: RequestHandler<{tagId: number, trackId: number}> = async (req, res, next) => {
     const tag = await db.query.tags.findFirst({
                            where: and(
                                eq(schema.tags.id, req.params.tagId),
                            ),
                            })
                            if (!tag) {
                                res.status(400).send({
                                     message: `Tag not found with id : ${req.params.tagId}`
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
            const trackTags = await db.query.trackTags.findFirst({
                                            where: and(
                                                eq(schema.trackTags.tagId, req.params.tagId),
                                                eq(schema.trackTags.trackId, req.params.trackId)
                                            ),
                                        })
                                        if (trackTags) {
                                           res.status(404).send({
                                                message: "TrackTag Already exist !"
                                            });
                                            return;
                                        }
            const trackTag = await db
                .insert(schema.trackTags)
                .values({
                    tagId: req.params.tagId,
                    trackId: req.params.trackId,
                })
                .$returningId()
        
            const createdTrackTag = trackTag[0]
        
            if (!createdTrackTag) {
                res.status(400).send({
                    message: "Some Error occured when creating Track Tag"
                });
            }
            res.status(200).send(createdTrackTag as TrackTag);
    }  


    static  FindTrackTagByTrackIdAndTagId: RequestHandler<{trackId: number, tagId: number}> = async (req, res, next) => {
        const trackTag = await db.query.trackTags.findFirst({
                where: and(
                    eq(schema.trackTags.tagId, req.params.tagId),
                    eq(schema.trackTags.trackId, req.params.trackId)
                ),
            })
            if (!trackTag) {
               res.status(400).send({
                    message: "Error occured when getting Track Tag"
                });
            }
            res.status(200).send(trackTag as TrackTag)
        }

    static  FindTrackTagByTrackId: RequestHandler<{trackId: number}> = async (req, res, next) => {
        const trackTag = await db.query.trackTags.findFirst({
                where: and(
                    eq(schema.trackTags.trackId, req.params.trackId)
                ),
            })
            if (!trackTag) {
               res.status(400).send({
                    message: "Error occured when getting Track Tag by trackId"
                });
            }
            res.status(200).send(trackTag as TrackTag)
        }

    static  FindTrackTagByTagId: RequestHandler<{tagId: number}> = async (req, res, next) => {
        const trackTag = await db.query.trackTags.findFirst({
                where: and(
                    eq(schema.trackTags.tagId, req.params.tagId),
                ),
            })
            if (!trackTag) {
               res.status(400).send({
                    message: "Error occured when getting Track Tag by tagId"
                });
            }
            res.status(200).send(trackTag as TrackTag)
        }

    static  FindTrackTagById: RequestHandler<{id: number}> = async (req, res, next) => {
        const trackTag = await db.query.trackTags.findFirst({
                where: and(
                    eq(schema.trackTags.id, req.params.id)
                ),
            })
            if (!trackTag) {
               res.status(400).send({
                    message: "Error occured when getting Track Tag by id"
                });
            }
            res.status(200).send(trackTag as TrackTag)
        }
}
