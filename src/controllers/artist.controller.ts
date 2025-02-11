import { eq, sql } from 'drizzle-orm'
import type { Artist, User } from '../types'
// import {

// } from '$lib/db/utils'
// import { createArtistDbRecord } from '../utils/artist.utils'
import { db } from '../db/db'
import * as schema from '../db/schema'

export class ArtistController {
    // static async CreateArtist(
    //     adminId: string,
    //     id: string,
    //     name: string,
    //     url: string = ''
    // ): Promise<Artist> {
    //     const admin = getUserFromDbById(adminId)

    //     if (!admin) {
    //         return null
    //     }

    //     return await createArtistDbRecord(adminId, id, name, url)
    // }

    static async FindArtistById(id: string): Promise<Artist> {
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
                url: schema.artists.url,
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

        return result as Artist[]
    }

    static async FindArtistsWithTagById(tagId: string): Promise<Artist[]> {
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
                url: true,
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
