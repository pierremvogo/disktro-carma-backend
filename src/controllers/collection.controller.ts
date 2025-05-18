import { and, eq } from 'drizzle-orm'
import { RequestHandler } from 'express'
import { db } from '../db/db'
import * as schema from '../db/schema'
import { SlugMiddleware } from '../middleware/slug'
import type { Artist, Collection, Tag, Track } from '../models'
export class CollectionController {

    static create: RequestHandler = async (req, res, next) => {
        const slug = await SlugMiddleware.checkduplicatedFromCollection(req.body.slug)
                if(slug){
                      res.status(403).send({
                          message: `Slug collection already exist`
                        });
                      return;
                }
                const collection = await db
                    .insert(schema.collections)
                    .values({
                        title: req.body.title,
                        slug: req.body.slug,
                        duration: req.body.slug,
                        coverUrl: req.body.coverUrl
                    })
                    .$returningId()
            
                const createdCollection = collection[0]
            
                if (!createdCollection) {
                    res.status(400).send({
                        message: "Error ocuured when creating collection"
                    });
                }
                res.status(200).send(createdCollection as Collection);
    }  
    
    static FindCollectionByArtistAndSlug: RequestHandler = async (req, res, next) => {
        const query = db
            .select({
                id: schema.collections.id,
                title: schema.collections.title,
                slug: schema.collections.slug,
                duration: schema.collections.duration,
                coverUrl: schema.collections.coverUrl,
                tracks: schema.tracks,
            })
            .from(schema.collections)
            .innerJoin(
                schema.collectionArtists,
                eq(schema.collections.id, schema.collectionArtists.collectionId)
            )
            .innerJoin(
                schema.artists,
                eq(schema.artists.id, schema.collectionArtists.artistId)
            )
            .where(
                and(
                    eq(schema.collections.slug, req.body.collectionSlug),
                    eq(schema.artists.slug, req.body.artistSlug)
                )
            )
            .limit(1)
        const coll = await query.execute()
        res.status(200).send({
            message: `Get collection by artist and slug :  ${coll[0] as Collection}.`
          });
    }

    

    static FindCollectionById: RequestHandler<{id: number}> = async (req, res, next) =>  {
        try {
                const collection = await db.query.collections.findFirst({
                    where: eq(schema.collections.id, req.params.id),
                    with: {
                        trackCollections: {
                            with: {
                                track: true,
                            },
                        },
                        collectionArtists: {
                            with: {
                                artist: true,
                            },
                        },
                        collectionTags: {
                            with: {
                                tag: true,
                            },
                        },
                    },
                })
                if (!collection) {
                    res.status(400).send({
                        message: `No collection found with id ${req.body.id}.`
                      });
                      return;
                }
                const a: Collection = { ...collection }  as Collection
                if(a){
                    a.artists = collection?.collectionArtists.map(
                        (a: any) => a.artist as Artist
                    )
                    a.tags = collection?.collectionTags.map(
                        (a: any) => a.tag as Tag)
            
                    a.tracks = collection?.trackCollections.map(
                        (t: any) => t.track as Track
                    )
                    delete a.collectionArtists
                    delete a.collectionTags
                    delete a.trackCollections
                    res.status(200).send({
                        message: `Collection :  ${a}.`
                      });
                }
            } catch (err) {
                res.status(500).send({
                    message: `Internal server error.`
                  });
            }
    }


    static FindCollectionsByArtistId: RequestHandler = async (req, res, next) => {
        let results = []
        try {
                const result = await db.query.collectionArtists.findMany({
                        where: eq(schema.collectionArtists.artistId, req.body.artistId),
                        with: {
                            collection: true,
                        },
                    })
                if (!result) {
                    res.status(500).send({
                        message: `'no artist found with given id'`
                      });
                }
                results = result.map((ca: any) => ca.collection)
                res.status(200).send(results);
            } catch (err) {
                res.status(500).send({
                    message: `Internal server error.`
                  });
            }
    }
}
