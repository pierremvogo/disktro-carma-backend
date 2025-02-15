import { eq, sql } from 'drizzle-orm'
import type { Artist, User } from '../models'
// import {

// } from '$lib/db/utils'
// import { createArtistDbRecord } from '../utils/artist.utils'
import { db } from '../db/db'
import * as schema from '../db/schema'
import { getUserFromDbById } from '../utils'
import { createArtistDbRecord } from '../utils/artist.utils'

export class ArtistController {
     static async CreateArtist(
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
         const admin = getUserFromDbById(adminId)
         if (!admin) {
             return null
         }
         return await createArtistDbRecord(
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
            tidal_artist_link)
     }

 
    static async FindArtistById(id: number): Promise<Artist> {
        const result = await db.query.artists.findFirst({
            where: eq(schema.artists.id, id),
        })
        if (!result) return null
        return result as Artist
    }


    static async FindArtistBySlug(slug: string): Promise<Artist> {
        const result = await db.query.artists.findFirst({
            where: eq(schema.artists.slug, slug),
        })
        if (!result) return null
        return result as Artist
    }


    static async FindArtistsAdminedByUser(user: User): Promise<Artist[]> {
        const result = await db.query.artistAdmins.findMany({
            where: eq(schema.artistAdmins.userId, user!.id),
            with: {
                artist: true,
            },
        })
        if (!result) return []
        return result.map((aa: { artist: any }) => aa.artist) as Artist[]
    }


    static async FindArtistsByUserEmail(userEmail: string): Promise<Artist[]> {
        const result = await db
            .select({
                id: schema.artists.id,
                name: schema.artists.name,
                slug: schema.artists.slug,
                url: schema.artists.media_url,
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
            .where(eq(schema.users.email, userEmail))

        if (!result) return []

        return result as unknown as Artist[]
    }

    static async FindArtistsWithTagById(tagId: number): Promise<Artist[]> {
        const artistTags = await db.query.artistTags.findMany({
            where: eq(schema.tags.id, tagId),
            with: {
                artist: true,
            },
        })
        if (!artistTags) return []
        return artistTags.map((at: any) => at!.artist) as Artist[]
    }


    static async FindArtistsWithTag(tag: User): Promise<Artist[]> {
        return await this.FindArtistsWithTagById(tag!.id)
    }

    static async GetRandomArtists(count: number): Promise<Artist[]> {
        const randArtists = await db.query.artists.findMany({
            columns: {
                name: true,
                id: true,
                slug: true,
                createdAt: true,
                adminId: true,
                media_url: true,
                location: true,
                biography: true,
                profileImageUrl: true,
            },
            orderBy: sql`RANDOM()`,
            limit: count,
        })

        if (!randArtists) return []

        return randArtists as Artist[]
    }
}
