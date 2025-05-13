import { error } from '@sveltejs/kit'
import { eq, sql } from 'drizzle-orm'
import { db } from '../db/db'
import * as schema from '../db/schema'
import type { Artist } from '../models'

export async function getRandomArtists(count: number): Promise<Artist[]> {
    const randArtists = await db.query.artists.findMany({
        columns: {
            name: true,
            id: true,
            createdAt: true,
            media_url: true,
            location: true,
            biography: true,
            profileImageUrl: true,
        },
        orderBy: sql`RANDOM()`,
        limit: count,
    })
    return randArtists as Artist[]
}

 export async function createArtistDbRecord(
     adminId: number,
     id: number,
     name: string,
     media_url: string = '',
     location: string = '',
     profileImageUrl: string = '',
     biography: string = '',
     slug: string,
     spotify_artist_link: string,
     deezer_artist_link: string,
     tidal_artist_link: string
 ): Promise<Artist> {
     const artist = await db
         .insert(schema.artists)
         .values({
             adminId,
             id,
             name,
             media_url,
             location,
             profileImageUrl,
             biography,
             slug,
             spotify_artist_link,
             deezer_artist_link,
             tidal_artist_link
         })
         .$returningId()

     const createdArtist = artist[0]
     if (!createdArtist) {
         return null
     }
     return createdArtist as Artist
 }

 export async function getArtistFromDbBySlug(
     artistSlug: string
 ): Promise<Artist> {
     try {
         console.log('test')
         const result = await db.query.artists.findFirst({
             where: eq(schema.artists.slug, artistSlug),
         })

         if (!result) {
             console.log('no result')
             return error(404, {
                 message: `No artist found with slug ${artistSlug}.`,
             })
         }

         console.log('result: ', result)

         const artist = { ...result } as Artist
         return artist
     } catch (err) {
         return null
     }
 }


 /*export async function getArtistFromDbById(
     queryId: number,
     include: string[] = []
 ): Promise<Artist> {

      try {
          const inc = {
              artistTags: {},
              trackArtists: {},
              collectionArtists: {},
          }

          if (include.includes('tags')) {
              inc.artistTags = {
                  with: {
                      tag: true,
                  },
              }
          } else {
              inc.artistTags = false
          }

          if (include.includes('tracks')) {
              inc.trackArtists = {
                  with: {
                      track: true,
                  },
              }
          } else {
              inc.trackArtists = false
          }

          if (include.includes('collections')) {
              inc.collectionArtists = {
                  with: {
                      collection: true,
                  },
              }
          }

          const result = await db.query.artists.findFirst({
              where: eq(schema.artists.id, queryId),
              columns: {
                  name: true,
                  id: true,
                  createdAt: true,
                  adminId: true,
                  media_url: true,
                  slug: true,
                  location: true,
                  biography: true,
                  profileImageUrl: true,
              },
              with: inc,
          })

          if (!result) {
              throw new Error(`No artist found with id ${queryId}`)
          }

          const artist: Artist = { ...result } as unknown as Artist

          if (include.includes('tracks')) {
              artist.tracks = artist.trackArtists?.map((sa) => sa.track as Track)
          } else {
              delete artist.tracks
          }

          delete artist.trackArtists

          if (include.includes('tags')) {
              artist.tags = artist.artistTags?.map((at) => at.tag as Tag)
          } else {
              delete artist.tags
          }

          delete artist.artistTags

          if (include.includes('collections')) {
              artist.collections = artist.collectionArtists?.map(
                  (aa) => aa.collection as Collection
              )
          } else {
              delete artist.collections
          }

          delete artist.collectionArtists

          return artist
      } catch (err) {
          console.error(err)
          throw new Error(`${err}`)
      }
 }*/

 export async function getArtistsFromDbByUserId(
     userId: number
 ): Promise<Artist[]> {
     const artistsAdminedByUser = await db.query.artists.findMany({
         where: eq(schema.artists.adminId, userId),
     })
     if (!artistsAdminedByUser) {
         return []
     }
     return artistsAdminedByUser as Artist[]
 }



 export async function getArtistsFromDbByUserEmail(
     userEmail: string
 ): Promise<Artist[]> {
     const user = await db.query.users.findFirst({
         where: eq(schema.users.email, userEmail),
     })
     if (!user || !user.id)
         throw new Error(`User not found with email ${userEmail}`)
     const { id } = user
     const artistsAdminedByUser = await getArtistsFromDbByUserId(id)
     if (!artistsAdminedByUser) {
         return []
     }
     return artistsAdminedByUser as Artist[]
 }



 export async function getArtistsFromDbByTagId(
     tagId: number
 ): Promise<Artist[] | string> {
     const artistTags = await db.query.artistTags.findMany({
         where: eq(schema.artistTags.tagId, tagId),
         with: {
             artist: true,
         },
     })
     if (!artistTags) {
         return `No artists found with selected tag.`
     }
     const artists: Artist[] = artistTags.map((at) => at.artist as Artist)
     return artists
 }
