/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IContext } from "../../context"
import validator from "validator"
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"

const JWT_SIGNATURE: string = process.env.JWT_SIGNATURE ?? "JWT_SIGNATURE"

interface ICredentialsArgs {
    email: string
    password: string
}

interface ISigninArgs {
    credentials: ICredentialsArgs
}

interface ISignupArgs extends ISigninArgs {
    name: string
    bio: string
}

interface IUserError {
    message: string
}

interface IAuthPayload {
    userErrors: IUserError[]
    token: string | null
}

export const authResolvers = {
    signup: async (
        _: undefined,
        { credentials: { email, password }, name, bio }: ISignupArgs,
        { prisma }: IContext
    ): Promise<IAuthPayload> => {
        const userErrors: IUserError[] = []

        const isEmail = validator.isEmail(email)

        !isEmail &&
            userErrors.push({
                message: "Invalid email",
            })

        const isValidPassword = validator.isLength(password, { min: 5 })

        !isValidPassword &&
            userErrors.push({
                message: "Invalid password",
            })

        !name &&
            userErrors.push({
                message: "Invalid name",
            })

        !bio &&
            userErrors.push({
                message: "Invalid bio",
            })

        if (userErrors.length > 0) {
            return {
                userErrors,
                token: null,
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        })

        await prisma.profile.create({
            data: { bio, userId: user.id },
        })

        const token = JWT.sign(
            {
                userId: user.id,
            },
            JWT_SIGNATURE,
            { expiresIn: 3600000 }
        )

        return {
            userErrors: [],
            token,
        }
    },
    signin: async (
        _: undefined,
        { credentials: { email, password } }: ISigninArgs,
        { prisma }: IContext
    ): Promise<IAuthPayload> => {
        const invalidResponse = {
            userErrors: [{ message: "Invalid credentials" }],
            token: null,
        }

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (!user) {
            return invalidResponse
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return invalidResponse
        }

        return {
            userErrors: [],
            token: JWT.sign(
                {
                    userId: user.id,
                },
                JWT_SIGNATURE,
                { expiresIn: 3600000 }
            ),
        }
    },
}
