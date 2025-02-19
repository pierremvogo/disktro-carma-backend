import { eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import type { Artist } from '../models'

export class ArtistController {

     static CreateArtist: RequestHandler = async (req, res, next) =>  {
        if (!req.body) {
            res.status(400).send({
              message: "Content can not be empty!"
            });
          }
         try {
                if (req.body.adminId === null) {
                     res.status(400).send({
                        message: "No user Admin ID given."
                      });
                 }
                 const user = await db.query.users.findFirst({
                     where: eq(schema.users.id, req.body.adminId),
                 })
                 if (!user){
                    res.status(400).send({
                        message: "Admin Artist id is required!"
                      });
                 }
                 else {
                    const artist = await db.insert(schema.artists)
                        .values({
                            name: req.body.name,
                            media_url: req.body.media_url,
                            location: req.body.location,
                            profileImageUrl: req.body.profileImageUrl,
                            biography: req.body.biography,
                            slug: req.body.slug,
                            spotify_artist_link: req.body.spotify_artist_link,
                            deezer_artist_link: req.body.deezer_artist_link,
                            tidal_artist_link: req.body.tidal_artist_link
                        })
                        .$returningId()
                
                    const createdArtist = artist[0]
                    if (!createdArtist) {
                        res.status(400).send({
                            message:
                            "Some error occurred while creating the Artist."
                        });
                    }
                    res.status(200).send(createdArtist);

             }
            } catch (err) {
                res.status(500).send({
                    message:
                    `Internal server Error ... ${err}`
                });
             }
     }

     
     
    static  FindArtistById: RequestHandler = async (req, res, next) => {
        const result = await db.query.artists.findFirst({
            where: eq(schema.artists.id, req.body.id),
        })
        if (!result) {
            res.status(400).send({
                message:
                "Some error occurred: No artistBy Id found"
            });
        }
        res.status(200).send({
            data: result as Artist,
            message:
            "Successfully get artists By Slug"
        });
    }


    static FindArtistBySlug: RequestHandler = async (req, res, next) => {
        const result = await db.query.artists.findFirst({
            where: eq(schema.artists.slug, req.body.slug),
        })
        if (!result){
            res.status(400).send({
                message:
                "Some error occurred: No artist By Slug found"
            });
        }
        res.status(200).send({
            data: result as Artist,
            message:
            "Successfully get artists By Slug"
        });

    }


    static FindArtistsAdminedByUser: RequestHandler = async (req, res, next) => {
        const result = await db.query.artistAdmins.findMany({
            where: eq(schema.artistAdmins.userId, req.body.userId),
            with: {
                artist: true,
            },
        })
        if (!result){
            res.status(400).send({
                message:
                "Some error occurred: No artistAdmin By User found"
            });
        }
        res.status(200).send({
            data: result.map((aa: { artist: any }) => aa.artist) as Artist[],
            message:
            "Successfully get artistsAdmin By User Id"
        });
    }


    static  FindArtistsByUserEmail: RequestHandler = async (req, res, next) => {
        const result = await db
            .select({
                id: schema.artists.id,
                name: schema.artists.name,
                slug: schema.artists.slug,
                media_url: schema.artists.media_url,
                location: schema.artists.location,
                biography: schema.artists.biography,
                profileImageUrl: schema.artists.profileImageUrl,
                createdAt: schema.artists.createdAt,
            })
            .from(schema.artists)
            .innerJoin(
                schema.artistAdmins,
                eq(schema.artists.id, schema.artistAdmins.artistId)
            )
            .innerJoin(
                schema.users,
                eq(schema.users.id, schema.artistAdmins.userId)
            )
            .where(eq(schema.users.email, req.body.userEmail))

        if (!result){
            res.status(400).send({
                message:
                "Some error occurred: No artist By UserEmail found"
            });
        }
        res.status(200).send({
            data: result as Artist[],
            message:
            "Successfully get artists By UserEmail "
        });
    }

    static FindArtistsWithTag: RequestHandler = async (req, res, next) => {
        const artistTags = await db.query.artistTags.findMany({
            where: eq(schema.tags.id, req.body.tagId),
            with: {
                artist: true,
            },
        })
        if (!artistTags){
            res.status(400).send({
                message:
                "Some error occurred: No artist tag found"
            });
        }
        let result = []
        result  = artistTags.map((at: any) => at!.artist) as Artist[]
        res.status(200).send({
            data: result,
            message:
            "Successfully get artists with Tag "
        });
    }

    static GetRandomArtists: RequestHandler = async (req, res, next) => {
        const randArtists = await db.query.artists.findMany({
            columns: {
                name: true,
                id: true,
                slug: true,
                createdAt: true,
                media_url: true,
                location: true,
                biography: true,
                profileImageUrl: true,
            },
            //orderBy: [asc(schema.artists.id)]`,
            limit: req.body.count,
        })

        if (!randArtists){
            res.status(400).send({
                message:
                "Some error occurred: No artist found"
            });
        }
        res.status(200).send({
            data: randArtists as Artist[],
            message:
            "Successfully get all artists"
        });
    }
}
