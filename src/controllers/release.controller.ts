import { and, eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import type { Release } from '../models'

export class ReleaseController {

    static createRelease: RequestHandler = async (req, res, next) => {
        const artists = await db.query.artists.findFirst({
            where: and(
                eq(schema.artists.id, req.body.artistId),
            ),
        })
        if (!artists) {
            res.status(404).send({
                message: "Artist Id does not exist"
            });
            return;
        }

            const release = await db
                .insert(schema.release)
                .values({
                    artistId: req.body.artistId,
                    title: req.body.title,
                    releaseDate: req.body.releaseDate,
                    description: req.body.description,
                    coverArt: req.body.coverArt,
                    label: req.body.label,
                    releaseType: req.body.releaseType,
                    format: req.body.format,
                    upcCode: req.body.upcCode
                })
                .$returningId()
        
            const createdRelease = release[0]
        
            if (!createdRelease) {
                res.status(400).send({
                    message: "Error occured when creating Release"
                });
            }
            res.status(200).send(createdRelease as Release);
    }  


    static  FindReleaseById: RequestHandler<{releaseId: number}> = async (req, res, next) => {
        const release = await db.query.release.findFirst({
                where: and(
                    eq(schema.release.id, req.params.releaseId),
                ),
            })
            if (!release) {
               res.status(404).send({
                    message: `Release not found with Id : ${req.params.releaseId}`
                });
                return;
            }
            res.status(200).send(release)
        }

        
}
