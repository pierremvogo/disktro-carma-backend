import { and, eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'

export class ArtistAdminController {

    static createArtistAdmin: RequestHandler<{adminId: number, artistId: number}> = async (req, res, next) => {
        const admin = await db.query.users.findFirst({
                 where: eq(schema.users.id, req.params.adminId),
        })
            if (!admin){
                    res.status(404).send({
                    message: "User id Not Found"
        });
        return;
        }
        const artist = await db.query.artists.findFirst({
            where: eq(schema.artists.id, req.params.artistId),
        })
        if (!artist){
               res.status(404).send({
               message: "Artist id not Found"
        });
        return;
        }
        const artistAdmins = await db.query.artistAdmins.findFirst({
            where: and(
                eq(schema.artistAdmins.artistId, req.params.artistId),
                eq(schema.artistAdmins.userId, req.params.adminId)
            ),
        })
        if (artistAdmins) {
           res.status(404).send({
                message: "Admin artist Already exist"
            });
            return;
        }
        const artistAdmin = await db
                .insert(schema.artistAdmins)
                .values({
                    artistId: req.params.artistId,
                    userId: req.params.adminId,
                })
                .$returningId()
        
            const createdArtistAdmin = artistAdmin[0]
        
            if (!createdArtistAdmin) {
                res.status(404).send({
                    message: "artistAdmin Not found"
                });
                return;
            }
            res.status(200).send(createdArtistAdmin);
    }
    


    static  FindArtistAdminByUserIdAndArtistId: RequestHandler<{userId: number, artistId: number}> = async (req, res, next) => {
        const user = await db.query.users.findFirst({
                 where: eq(schema.users.id, req.params.userId),
        })
            if (!user){
                    res.status(404).send({
                    message: "User id is required!"
        });
        return;
        }
        const artist = await db.query.artists.findFirst({
            where: eq(schema.artists.id, req.params.artistId),
        })
        if (!artist){
               res.status(404).send({
               message: "Artist id is required!"
        });
        return;
        }
        const artistAdmin = await db.query.artistAdmins.findFirst({
                where: and(
                    eq(schema.artistAdmins.artistId, req.params.artistId),
                    eq(schema.artistAdmins.userId, req.params.userId)
                ),
            })
            if (!artistAdmin) {
               res.status(400).send({
                    message: "Error ocuured when getting artistAdmin"
                });
                return;
            }
            res.status(200).send(artistAdmin)
        }

        static  FindArtistAdminByUserId: RequestHandler<{userId: number}> = async (req, res, next) => {
            const user = await db.query.users.findFirst({
                     where: eq(schema.users.id, req.params.userId),
            })
                if (!user){
                        res.status(404).send({
                        message: "User id not Found!"
            });
            return;
            }
            
            const artistAdmin = await db.query.artistAdmins.findFirst({
                    where: and(
                        eq(schema.artistAdmins.userId, req.params.userId)
                    ),
                })
                if (!artistAdmin) {
                   res.status(400).send({
                        message: "Error ocuured when getting artistAdmin"
                    });
                    return;
                }
                res.status(200).send(artistAdmin)
            }

        static  FindArtistAdminByArtistId: RequestHandler<{artistId: number}> = async (req, res, next) => {
            const artist = await db.query.artists.findFirst({
                     where: eq(schema.artists.id, req.params.artistId),
            })
                if (!artist){
                    res.status(404).send({
                    message: "User id not Found!"
            });
            return;
            }
            const artistAdmin = await db.query.artistAdmins.findFirst({
                    where: and(
                        eq(schema.artistAdmins.artistId, req.params.artistId)
                    ),
                })
                if (!artistAdmin) {
                   res.status(404).send({
                        message: "Error ocuured when getting artistAdmin"
                    });
                    return;
                }
                res.status(200).send(artistAdmin)
            }

    static  FindArtistAdminById: RequestHandler<{id: number}> = async (req, res, next) => {

            const artistAdmin = await db.query.artistAdmins.findFirst({
                    where: and(
                        eq(schema.artistAdmins.id, req.params.id)
                    ),
                })
                if (!artistAdmin) {
                   res.status(404).send({
                        message: "Error ocuured when getting artistAdmin"
                    });
                    return;
                }
                res.status(200).send(artistAdmin)
            }
}
