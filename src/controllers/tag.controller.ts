import { eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import type { Artist, Collection, Tag, Track } from '../models'

export class TagController {

    static CreateTag: RequestHandler = async (req, res, next) => {
        const slug = req.body.name.replaceAll(' ', '-')
            const result = await db
                .insert(schema.tags)
                .values({
                    id: req.body.id,
                    name: req.body.name,
                    slug: slug,
                })
                .$returningId()
        
            const createdTag = result[0]
        
            if (!createdTag) {
                res.status(400).send({
                    message: "Error while creating Tag!"
                  });
            }
            res.status(200).send({
                message: "Successfuly created Tag",
                data: createdTag as Tag
              });
    }
    

    static FindTagById: RequestHandler = async (req, res, next) => {
        try {
                if (req.body.id == null) {
                    res.status(400).send({
                        message: "No tag ID given.!"
                      });
                }
                const result = await db.query.tags.findFirst({
                    where: eq(schema.tags.id, req.body.id),
                    with: {
                        collectionTags: {
                            with: {
                                collection: true,
                            },
                        },
                        artistTags: {
                            with: {
                                artist: true,
                            },
                        },
                        trackTags: {
                            with: {
                                track: true,
                            },
                        },
                    },
                })
                if (!result){
                    res.status(400).send({
                        message:`no tag with id ${req.body.id} found`
                      });
                }
                const tag: Tag = { ...result } as Tag
                if (tag == null) {
                    res.status(400).send({
                        message:`no tag with id ${req.body.id} found`
                      });
                }
                else{
                    tag.collections = result?.collectionTags.map(
                        (at) => at.collection as unknown as Collection
                    )
                    tag.artists = result?.artistTags.map((at) => at.artist as Artist)
                    tag.tracks = result?.trackTags.map((st) => st.track as Track)
            
                    delete tag.artistTags
                    delete tag.collectionTags
                    delete tag.trackTags
            
                    res.status(200).send({
                        message:`Successfuly get tag`,
                        data: tag
                      });
                }
                
            } catch (err) {
                console.error(err)
                res.status(500).send({
                    message:`Internal server error`
                  });
            }
    }

    static FindTagBySlug: RequestHandler = async (req, res, next) => {
        try {
                if (req.body.slug == ''){
                    res.status(400).send({
                        message:`No tag slug given.`
                      });
                }
                console.log(req.body.slug)

                const tagBySlug = await db.query.tags.findFirst({
                    where: eq(schema.tags.slug, req.body.slug),
                })
        
                if (!tagBySlug){
                    res.status(400).send({
                        message:`Error during retrieve Tag by slug`
                      });
                }
                res.status(200).send({
                    message:`Successfuly find tag by slug.`,
                    data: tagBySlug as Tag
                  });
            } catch (err) {
                console.error(err)
                res.status(500).send({
                    message:`Internal server Error.`
                  });
            }
    }

    static FindTagCollections: RequestHandler  = async ( req, res, next) => {
        let limit : number = 4
        const collectionTags = await db.query.collectionTags.findMany({
            where: eq(schema.collectionTags.tagId, req.body.tagId),
            limit,
            with: {
                collection: true,
            },
        })
        const tagCollections: Collection[] = collectionTags.map(
            (ct: { collection: any }) => ct.collection as Collection
        )
        if(!collectionTags){
            res.status(400).send({
                message:`No collection Tag Found`
              });
        }
        res.status(200).send({
            message:`Successfuly find tag collection.`,
            data: tagCollections
          });
    }


    static  FindTagArtists: RequestHandler = async (req, res, next) =>  {
        let limit: number = 4
        const artistTags = await db.query.artistTags.findMany({
            where: eq(schema.artistTags.tagId, req.body.tagId),
            limit,
            with: {
                artist: true,
            },
        })
        if(!artistTags){
            res.status(400).send({
                message:`No collection Tag Found`
              });
        }
        const tagArtists: Artist[] = artistTags.map((at: { artist: any }) => at.artist as Artist)

        res.status(200).send({
            message:`Successfuly find tag By artist`,
            data: tagArtists
          });
    }
}
