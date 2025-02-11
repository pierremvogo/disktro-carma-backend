import { db } from '$lib/db'
import * as schema from '$lib/db/schema'
import type { Tag, ArtistTag, Collection, Artist, Track } from '$lib/types'
import { eq, and, sql } from 'drizzle-orm'
import { generateId } from '$lib/utils'

export async function createTagDbRecord(name: string): Promise<Tag | null> {
    const slug = name.replaceAll(' ', '-')

    const res = await db
        .insert(schema.tags)
        .values({
            id: await generateId(),
            name,
            slug,
        })
        .returning()

    const createdTag = res[0]

    if (!createdTag) {
        return null
    }

    return createdTag as Tag
}

export async function getTagFromDbById(id: string): Promise<Tag | null> {
    try {
        if (id == '') {
            throw new Error('No tag ID given.')
        }

        const res = await db.query.tags.findFirst({
            where: eq(schema.tags.id, id),
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

        if (!res) throw new Error(`no tag with id ${id} found`)

        const tag: Tag = { ...res } as Tag

        if (tag == null) {
            throw new Error(`no tag with id ${id} found`)
        }

        tag.collections = res.collectionTags.map(
            (at) => at.collection as Collection
        )
        tag.artists = res.artistTags.map((at) => at.artist as Artist)
        tag.tracks = res.trackTags.map((st) => st.track as Track)

        delete tag.artistTags
        delete tag.collectionTags
        delete tag.trackTags

        return tag
    } catch (err) {
        console.error(err)
        return null
    }
}

export async function getTagFromDbBySlug(slug: string): Promise<Tag | null> {
    try {
        if (slug == '') throw new Error('No tag slug given.')

        console.log(slug)

        const tag = await db.query.tags.findFirst({
            where: eq(schema.tags.slug, slug),
        })

        if (!tag) return null

        return tag as Tag
    } catch (err) {
        console.error(err)
        return null
    }
}

export async function createArtistTagDbRecord(
    artistId: string,
    tagId: string
): Promise<ArtistTag | null> {
    const res = await db
        .insert(schema.artistTags)
        .values({
            id: await generateId(),
            artistId,
            tagId,
        })
        .returning()

    const createdTag = res[0]

    if (!createdTag) {
        return null
    }

    return createdTag as ArtistTag
}

export async function getArtistTagFromDb(artistId: string, tagId: string) {
    const artistTag = await db.query.artistTags.findFirst({
        where: and(
            eq(schema.artistTags.artistId, artistId),
            eq(schema.artistTags.tagId, tagId)
        ),
    })

    if (!artistTag) {
        return null
    }

    return artistTag as ArtistTag
}

export async function getRandomTags(count: number): Promise<Tag[]> {
    const result = await db.query.tags.findMany({
        columns: {
            id: true,
            name: true,
            slug: true,
        },
        orderBy: sql`RANDOM()`,
        limit: count,
    })

    return result as Tag[]
}

export async function getArtistTags(artistId: string) {
    const query = db
        .select({
            tag: schema.tags,
        })
        .from(schema.artistTags)
        .where(eq(schema.artistTags.artistId, artistId))
        .leftJoin(schema.tags, eq(schema.tags.id, schema.artistTags.tagId))

    const result = await query.execute()

    const foundTags: Tag[] = result.map((r) => r.tag as Tag)

    return foundTags
}
