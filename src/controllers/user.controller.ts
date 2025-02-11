import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { LoginUserResponse, User } from '../../types'
import { generateId } from '../../utils'
import { env } from "../../utils/config"
import {
    createUser,
    getUserFromDbByEmail,
    getUserFromDbById,
} from '../utils'

export class UserController {
    static async CreateUser(newUser: User): Promise<User | null> {
        if (!newUser) {
            throw new Error()
        }

        try {
            const hashedPassword = await bcrypt.hash(newUser.password!, 10)

            const newUserData = {
                id: await generateId(),
                name: newUser.name,
                email: newUser.email,
                password: hashedPassword,
                type: newUser.type,
            }

            const createdUser = await createUser(newUserData)

            if (!createdUser) {
                throw new Error(
                    'There was an error creating the user with the given email address.'
                )
            }

            return createdUser
        } catch (err) {
            return null
        }
    }

    static async FindUserByEmail(email: string): Promise<User> {
        return await getUserFromDbByEmail(email)
    }

    static async FindUserById(id: string): Promise<User | null> {
        return await getUserFromDbById(id)
    }

    static async LoginUser(
        email: string,
        password: string
    ): Promise<LoginUserResponse> {
        const response: LoginUserResponse = {
            user: null,
            token: '',
            error: false,
            message: '',
        }

        try {
            const user = await getUserFromDbByEmail(email)

            const passwordsMatch = await bcrypt.compare(
                password,
                user?.password ?? ''
            )

            if (!user || !passwordsMatch) {
                throw 'The provided email and password do not correspond to an account in our records.'
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                },
                env.JWT_PRIVATE_KEY,
                {
                    expiresIn: '1d',
                }
            )

            response.user = user
            response.token = token
            response.error = false
            response.message = 'User successfully authenticated.'
        } catch (err) {
            response.error = true
            response.message = err as string
            console.error('user authentication failed: ', err)
        }

        return response
    }
}
