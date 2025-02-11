import { db } from '$lib/db'
import { collections as collectionsSchema } from '$lib/db/schema'

import type {
    Collection,
    Artist,
    Tag,
    CollectionArtist,
    CollectionTag,
    Track,
    TrackCollection,
} from '$lib/types'

import * as schema from '$lib/db/schema'

import { eq, count, sql } from 'drizzle-orm'

export async function getCollectionsByArtist(
    artist: Artist
): Promise<Collection[]> {
    try {
        const result: CollectionArtist[] =
            (await db.query.collectionArtists.findMany({
                where: eq(schema.collectionArtists.artistId, artist!.id),
                with: {
                    collection: true,
                },
            })) as CollectionArtist[]

        if (!result) {
            throw new Error('no artist found with given id')
        }

        return result.map((ca) => ca!.collection)
    } catch (err) {
        console.error(err)
        return []
    }
}

export async function getCollectionsByTag(tag: Tag): Promise<Collection[]> {
    try {
        const result: CollectionTag[] = (await db.query.collectionTags.findMany(
            {
                where: eq(schema.collectionTags.tagId, tag!.id),
                with: {
                    collection: true,
                },
            }
        )) as CollectionTag[]

        if (!result) {
            throw new Error('no artist found with given id')
        }

        return result.map((ca) => ca!.collection)
    } catch (err) {
        console.error(err)
        return []
    }
}

export async function getCollectionsByTrack(
    track: Track
): Promise<Collection[]> {
    try {
        const result: TrackCollection[] =
            (await db.query.trackCollections.findMany({
                where: eq(schema.trackCollections.trackId, track!.id),
                with: {
                    collection: true,
                },
            })) as TrackCollection[]

        if (!result) {
            throw new Error('no artist found with given id')
        }

        return result.map((ca) => ca!.collection)
    } catch (err) {
        console.error(err)
        return []
    }
}

export async function getCollectionFromDbById(
    id: string
): Promise<Collection | null> {
    try {
        const res = await db.query.collections.findFirst({
            where: eq(collectionsSchema.id, id),
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

        if (!res) {
            throw new Error(`No collection found with id ${id}.`)
        }

        const a: Collection = { ...res } as Collection

        a.artists = res.collectionArtists.map(
            (a: CollectionArtist) => a.artist as Artist
        )

        a.tags = res.collectionTags.map((a: CollectionTag) => a.tag as Tag)

        a.tracks = res.trackCollections.map(
            (t: TrackCollection) => t.track as Track
        )

        delete a.collectionArtists
        delete a.collectionTags
        delete a.trackCollections

        return a
    } catch (err) {
        console.error(err)
        return null
    }
}

export async function getCollectionsFromDbByArtistId(
    artistId: string
): Promise<Collection[]> {
    try {
        const result: CollectionArtist[] =
            await db.query.collectionArtists.findMany({
                where: eq(schema.collectionArtists.artistId, artistId),
                with: {
                    collection: true,
                },
            })

        if (!result) {
            throw new Error('no artist found with given id')
        }

        return result.map((ca) => ca.collection)
    } catch (err) {
        console.error(err)
        return []
    }
}

export async function getCollectionTableSize(): Promise<number> {
    const res = await db.select({ count: count() }).from(collectionsSchema)
    return res[0].count
}

export async function getRandomCollections(
    count: number
): Promise<Collection[]> {
    const res = await db.query.collections.findMany({
        columns: {
            id: true,
            coverUrl: true,
            duration: true,
            title: true,
            slug: true,
        },
        orderBy: sql`RANDOM()`,
        limit: count,
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
        },
    })

    const randCollections: Collection[] = res.map((collection) => {
        const a: Collection = { ...collection } as Collection

        a.artists = collection.collectionArtists.map(
            (ca) => ca.artist as Artist
        )

        a.tracks = collection.trackCollections.map((tc) => tc.track as Track)

        delete a.collectionArtists

        return a
    })

    return randCollections as Collection[]
}
