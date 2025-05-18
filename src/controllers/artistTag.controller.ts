import { and, eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import type { ArtistTag } from '../models'

export class ArtistTagController {

    static create : RequestHandler<{artistId: number, tagId: number}> = async (req, res, next) => {
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

        const tag = await db.query.tags.findFirst({
            where: and(
                eq(schema.tags.id, req.params.tagId)
            ),
        })
        if (!tag) {
           res.status(400).send({
                message: `Tag not found with id : ${req.params.tagId}`
            });
            return;
        }
        const artistTags = await db.query.artistTags.findFirst({
                    where: and(
                        eq(schema.artistTags.artistId, req.params.artistId),
                        eq(schema.artistTags.tagId, req.params.tagId)
                    ),
                })
                if (artistTags) {
                   res.status(404).send({
                        message: "ArtistTag Already exist"
                    });
                    return;
                }
            const artistTag = await db
                .insert(schema.artistTags)
                .values({
                    artistId: req.params.artistId,
                    tagId: req.params.tagId,
                })
                .$returningId()
        
            const createdTag = artistTag[0]
        
            if (!createdTag) {
                res.status(400).send({
                    message: "Error occured when creating artistTag"
                });
                return;
            }
            res.status(200).send(createdTag as ArtistTag);
    }  


    static  FindArtistTagByArtistIdAndTagId: RequestHandler<{artistId: number, tagId: number}> = async (req, res, next) => {
        const artistTag = await db.query.artistTags.findFirst({
                where: and(
                    eq(schema.artistTags.artistId, req.params.artistId),
                    eq(schema.artistTags.tagId, req.params.tagId)
                ),
            })
        
            if (!artistTag) {
               res.status(404).send({
                    message: "Not found artistTag"
                });
                return;
            }
            res.status(200).send(artistTag as ArtistTag)
        }

        static  FindArtistTagByArtistId: RequestHandler<{artistId: number}> = async (req, res, next) => {
            const artistTag = await db.query.artistTags.findFirst({
                    where: and(
                        eq(schema.artistTags.artistId, req.params.artistId)
                    ),
                })
            
                if (!artistTag) {
                   res.status(404).send({
                        message: "Not found artistTag"
                    });
                    return;
                }
                res.status(200).send(artistTag as ArtistTag)
            }
        
        static  FindArtistTagBytagId: RequestHandler<{tagId: number}> = async (req, res, next) => {
            const artistTag = await db.query.artistTags.findFirst({
                        where: and(
                            eq(schema.artistTags.tagId, req.params.tagId)
                        ),
                    })
                
                    if (!artistTag) {
                       res.status(404).send({
                            message: "Not found artistTag"
                        });
                        return;
                    }
                    res.status(200).send(artistTag as ArtistTag)
                }
                
        static  FindArtistTagById: RequestHandler<{id: number}> = async (req, res, next) => {
            const artistTag = await db.query.artistTags.findFirst({
                    where: and(
                        eq(schema.artistTags.id, req.params.id)
                    ),
                })
            
                if (!artistTag) {
                   res.status(404).send({
                        message: "Not found artistTag"
                    });
                    return;
                }
                res.status(200).send(artistTag as ArtistTag)
            }
}


