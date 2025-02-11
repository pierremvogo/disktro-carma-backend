import { db } from '../db'
// import * as schema from '$lib/db/schema'
import { sql } from 'drizzle-orm'
import type { Artist } from '../../types'
// import { error } from '@sveltejs/kit'

export async function getRandomArtists(count: number): Promise<Artist[]> {
    const randArtists = await db.query.artists.findMany({
        columns: {
            name: true,
            id: true,
            slug: true,
            createdAt: true,
            url: true,
            location: true,
            biography: true,
            profileImageUrl: true,
        },
        orderBy: sql`RANDOM()`,
        limit: count,
    })

    return randArtists as Artist[]
}

// export async function createArtistDbRecord(
//     adminId: string,
//     id: string,
//     name: string,
//     url: string = ''
// ): Promise<Artist> {
//     const artist = await db
//         .insert(schema.artists)
//         .values({
//             adminId,
//             id,
//             name,
//             url,
//         })
//         .returning()

//     const createdArtist = artist[0]

//     if (!createdArtist) {
//         return null
//     }

//     return createdArtist as Artist
// }

// export async function getArtistFromDbBySlug(
//     artistSlug: string
// ): Promise<Artist> {
//     try {
//         console.log('test')
//         const result = await db.query.artists.findFirst({
//             where: eq(schema.artists.slug, artistSlug),
//         })

//         if (!result) {
//             console.log('no result')
//             return error(404, {
//                 message: `No artist found with slug ${artistSlug}.`,
//             })
//         }

//         console.log('result: ', result)

//         const artist = { ...result } as Artist
//         return artist
//     } catch (err) {
//         return null
//     }
// }

// // first pass at the conditional includes thing
// // not sure i'm happy with it; it's neither terribly scalable nor terribly dry
// // though there is sort of a ceiling to the amount of data related to an artist we might fetch at a time
// export async function getArtistFromDbById(
//     queryId: string,
//     include: string[] = []
// ): Promise<Artist> {
//     return null
//     // try {
//     //     const inc = {
//     //         artistTags: {},
//     //         trackArtists: {},
//     //         collectionArtists: {},
//     //     }

//     //     if (include.includes('tags')) {
//     //         inc.artistTags = {
//     //             with: {
//     //                 tag: true,
//     //             },
//     //         }
//     //     } else {
//     //         inc.artistTags = false
//     //     }

//     //     if (include.includes('tracks')) {
//     //         inc.trackArtists = {
//     //             with: {
//     //                 track: true,
//     //             },
//     //         }
//     //     } else {
//     //         inc.trackArtists = false
//     //     }

//     //     if (include.includes('collections')) {
//     //         inc.collectionArtists = {
//     //             with: {
//     //                 collection: true,
//     //             },
//     //         }
//     //     }

//     //     const result = await db.query.artists.findFirst({
//     //         where: eq(schema.artists.id, queryId),
//     //         columns: {
//     //             name: true,
//     //             id: true,
//     //             createdAt: true,
//     //             adminId: true,
//     //             url: true,
//     //             location: true,
//     //             biography: true,
//     //             profileImageUrl: true,
//     //         },
//     //         with: inc,
//     //     })

//     //     if (!result) {
//     //         throw new Error(`No artist found with id ${queryId}`)
//     //     }

//     //     const artist: Artist = { ...result } as Artist

//     //     if (include.includes('tracks')) {
//     //         artist.tracks = artist.trackArtists?.map((sa) => sa.track as Track)
//     //     } else {
//     //         delete artist.tracks
//     //     }

//     //     delete artist.trackArtists

//     //     if (include.includes('tags')) {
//     //         artist.tags = artist.artistTags?.map((at) => at.tag as Tag)
//     //     } else {
//     //         delete artist.tags
//     //     }

//     //     delete artist.artistTags

//     //     if (include.includes('collections')) {
//     //         artist.collections = artist.collectionArtists?.map(
//     //             (aa) => aa.collection as Collection
//     //         )
//     //     } else {
//     //         delete artist.collections
//     //     }

//     //     delete artist.collectionArtists

//     //     return artist
//     // } catch (err) {
//     //     console.error(err)
//     //     throw new Error(`${err}`)
//     // }
// }

// export async function getArtistsFromDbByUserId(
//     userId: string
// ): Promise<Artist[]> {
//     const artistsAdminedByUser = await db.query.artists.findMany({
//         where: eq(schema.artists.adminId, userId),
//     })

//     if (!artistsAdminedByUser) {
//         return []
//     }

//     return artistsAdminedByUser as Artist[]
// }

// export async function getArtistsFromDbByUserEmail(
//     userEmail: string
// ): Promise<Artist[]> {
//     const user = await db.query.users.findFirst({
//         where: eq(schema.users.email, userEmail),
//     })

//     if (!user || !user.id)
//         throw new Error(`User not found with email ${userEmail}`)

//     const { id } = user

//     const artistsAdminedByUser = await getArtistsFromDbByUserId(id)

//     if (!artistsAdminedByUser) {
//         return []
//     }

//     return artistsAdminedByUser as Artist[]
// }

// export async function getArtistsFromDbByTagId(
//     tagId: string
// ): Promise<Artist[] | string> {
//     const artistTags = await db.query.artistTags.findMany({
//         where: eq(schema.artistTags.tagId, tagId),
//         with: {
//             artist: true,
//         },
//     })

//     if (!artistTags) {
//         return `No artists found with selected tag.`
//     }

//     const artists: Artist[] = artistTags.map((at) => at.artist as Artist)

//     return artists
// }
