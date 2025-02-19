import { and, eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import { TrackTag } from '../models'

export class TrackTagController {

    static createTrackTag: RequestHandler = async (req, res, next) => {
            const trackTag = await db
                .insert(schema.trackTags)
                .values({
                    tagId: req.body.tagId,
                    trackId: req.body.trackId,
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


    static  FindTrackTag: RequestHandler = async (req, res, next) => {
        const trackTag = await db.query.trackTags.findFirst({
                where: and(
                    eq(schema.trackTags.tagId, req.body.tagId),
                    eq(schema.trackTags.trackId, req.body.trackId)
                ),
            })
            if (!trackTag) {
               res.status(400).send({
                    message: "Error occured when getting Track Tag"
                });
            }
            res.status(200).send(trackTag as TrackTag)
        }
}
