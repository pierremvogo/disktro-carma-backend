import { and, eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import { TrackArtist } from '../models'

export class TrackArtistController {

    static createTrackArtist: RequestHandler = async (req, res, next) => {
            const trackArtist = await db
                .insert(schema.trackArtists)
                .values({
                    artistId: req.body.artistId,
                    trackId: req.body.trackId,
                })
                .$returningId()
        
            const createdTrackArtist = trackArtist[0]
        
            if (!createdTrackArtist) {
                res.status(400).send({
                    message: "Some Error occured when creating Track Artist"
                });
            }
            res.status(200).send(createdTrackArtist as TrackArtist);
    }  


    static  FindTrackArtist: RequestHandler = async (req, res, next) => {
        const trackArtist = await db.query.trackArtists.findFirst({
                where: and(
                    eq(schema.trackArtists.artistId, req.body.artistId),
                    eq(schema.trackArtists.trackId, req.body.trackId)
                ),
            })
            if (!trackArtist) {
               res.status(400).send({
                    message: "Error occured when getting Track Artist"
                });
            }
            res.status(200).send(trackArtist as TrackArtist)
        }
}
