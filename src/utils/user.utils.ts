import { db } from '$lib/db'
import { users } from '$lib/db/schema'
import type { User } from '$lib/types'
import { eq } from 'drizzle-orm'
import { generateId } from '$lib/utils'

export async function createUser(newUser: User): Promise<User> {
    if (!newUser) {
        throw new Error()
    }

    const res = await db
        .insert(users)
        .values({
            id: await generateId(),
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            type: newUser.type,
        })
        .returning()

    const createdUser = res[0]

    if (!createdUser) {
        return null
    }

    return createdUser as User
}

export async function getUserFromDbById(id: string): Promise<User> {
    try {
        if (id === '') {
            throw new Error('No user ID given.')
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, id),
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
            where: eq(users.email, email),
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
