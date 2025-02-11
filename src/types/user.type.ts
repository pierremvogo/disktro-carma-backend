import type { Artist, Collection, Tag } from '.'

interface UserProperties {
    id: string
    email: string
    name: string
    type: 'user' | 'artist'
    password?: string
    artists?: Artist[]
    collections?: Collection[]
    tags?: Tag[]
}

export type User = UserProperties | undefined | null
