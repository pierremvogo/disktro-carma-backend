import { and, eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import type { Release } from '../models'

export class ReleaseController {

    static createRelease: RequestHandler = async (req, res, next) => {
            const release = await db
                .insert(schema.release)
                .values({
                    artistId: req.body.artistId,
                    title: req.body.title,
                    releaseDate: req.body.releaseDate,
                    description: req.body.description,
                    coverArt: req.body.covertArt,
                    label: req.body.label,
                    releaseType: req.body.releaseType,
                    format: req.body.format,
                    upcCode: req.body.upcCode
                })
                .$returningId()
        
            const createdRelease = release[0]
        
            if (!createdRelease) {
                res.status(400).send({
                    message: "Error ocuured when creating Release"
                });
            }
            res.status(200).send(createdRelease as Release);
    }  


    static  FindReleaseById: RequestHandler = async (req, res, next) => {
        const release = await db.query.release.findFirst({
                where: and(
                    eq(schema.release.id, req.body.releaseId),
                ),
            })
            if (!release) {
               res.status(400).send({
                    message: "Error ocuured when getting Release"
                });
            }
            res.status(200).send(release as Release)
        }

        
}
