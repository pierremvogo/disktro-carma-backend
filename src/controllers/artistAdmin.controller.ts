import { and, eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import { ArtistAdmin } from '../models'

export class ArtistAdminController {

    static createArtistAdmin: RequestHandler = async (req, res, next) => {
            const artistAdmin = await db
                .insert(schema.artistAdmins)
                .values({
                    artistId: req.body.artistId,
                    userId: req.body.tagId,
                })
                .$returningId()
        
            const createdArtistAdmin = artistAdmin[0]
        
            if (!createdArtistAdmin) {
                res.status(400).send({
                    message: "Error ocuured when creating artistAdmin"
                });
            }
            res.status(200).send(createdArtistAdmin);
    }  


    static  getArtistAdmin: RequestHandler = async (req, res, next) => {
        const artistAdmin = await db.query.artistAdmins.findFirst({
                where: and(
                    eq(schema.artistAdmins.artistId, req.body.artistId),
                    eq(schema.artistAdmins.userId, req.body.userId)
                ),
            })
        
            if (!artistAdmin) {
               res.status(400).send({
                    message: "Error ocuured when getting artistAdmin"
                });
            }
            res.status(200).send(artistAdmin as ArtistAdmin)
        }
}
