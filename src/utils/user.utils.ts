import { eq } from 'drizzle-orm'
import { db } from '../db/db'
import * as schema from '../db/schema'
import type { User } from '../models'

export async function createUser(newUser: User): Promise<User> {
    if (!newUser) {
        throw new Error()
    }
    const res = await db
        .insert(schema.users)
        .values({
            id: 1,
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            type: newUser.type,
            artistId: 0
        })
        .$returningId()
    const createdUser = res[0]
    if (!createdUser) {
        return null
    }
    return createdUser as User
}

export async function getUserFromDbById(id: number): Promise<User> {
    try {
        if (id === null) {
            throw new Error('No user ID given.')
        }
        const user = await db.query.users.findFirst({
            where: eq(schema.users.id, id),
        })
        if (!user) return null
        return user as User
    } catch (err) {
        console.error(err)
        return null
    }
}

export async function getUserFromDbByEmail(email: string): Promise<User> {
    try {
        if (email === '') {
            throw new Error('No user email given.')
        }
        const user = await db.query.users.findFirst({
            where: eq(schema.users.email, email),
            columns: {
                id: true,
                name: true,
                email: true,
                type: true,
            },
        })
        if (!user) return null
        return user as User
    } catch (err) {
        console.error(err)
        return null
    }
}
