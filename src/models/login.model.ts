import { type User } from '.'

export type LoginFormResponse = {
    email: string
    token: string
    error: boolean
    message: string
}

export type LoginUserResponse = {
    user: User
    token: string
    error: boolean
    message: string
}

export type UserSession = {
    id: bigint
    user: User
    expires: string
}
