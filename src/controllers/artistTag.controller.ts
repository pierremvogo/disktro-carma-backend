import type { ArtistTag } from '../models'

import { createArtistTagDbRecord, getArtistTagFromDb } from '../utils'

export class ArtistTagController {
    static async createArtistTag(
        artistId: number,
        tagId: number
    ): Promise<ArtistTag | null> {
        return await createArtistTagDbRecord(artistId, tagId)
    }

    static async getArtistTag(artistId: number, tagId: number) {
        return await getArtistTagFromDb(artistId, tagId)
    }
}
