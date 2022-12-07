/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IContext } from "../context"
import { Post } from "@prisma/client"

interface IPost {
    title?: string
    content?: string
}

interface IPostCreateArgs {
    post: IPost
}

interface IPostUpdateArgs extends IPostCreateArgs {
    postId: string
}

interface IUserError {
    message: string
}

interface IPostPayload {
    userErrors: IUserError[]
    post: Post | null
}

export const Mutation = {
    postCreate: async (
        _: undefined,
        { post: { title = "", content = "" } }: IPostCreateArgs,
        { prisma }: IContext
    ): Promise<IPostPayload> => {
        const userErrors: IUserError[] = []

        !title &&
            userErrors.push({
                message: "You must be provide a title",
            })

        !content &&
            userErrors.push({
                message: "You must be provide a content",
            })

        if (userErrors.length) {
            return {
                userErrors,
                post: null,
            }
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: 1,
            },
        })

        return {
            userErrors: [],
            post,
        }
    },
    postUpdate: async (
        _: undefined,
        { postId, post: { title = "", content = "" } }: IPostUpdateArgs,
        { prisma }: IContext
    ): Promise<IPostPayload> => {
        const userErrors: IUserError[] = []

        if (!title && !content) {
            userErrors.push({
                message: "You must be provide at least one field to update",
            })
        }

        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId),
            },
        })

        if (!existingPost) {
            userErrors.push({
                message: "Post does not exist",
            })
        }

        if (userErrors.length) {
            return {
                userErrors,
                post: null,
            }
        }

        const payload: IPost = {
            title,
            content,
        }

        if (!title) delete payload.title
        if (!content) delete payload.content

        const post = await prisma.post.update({
            where: {
                id: Number(postId),
            },
            data: {
                ...payload,
            },
        })

        return {
            userErrors: [],
            post,
        }
    },
    postDelete: async (
        _: undefined,
        { postId }: { postId: string },
        { prisma }: IContext
    ): Promise<IPostPayload> => {
        const userErrors: IUserError[] = []

        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId),
            },
        })

        if (!existingPost) {
            userErrors.push({
                message: "Post does not exist",
            })
        }

        if (userErrors.length) {
            return {
                userErrors,
                post: null,
            }
        }

        const post = await prisma.post.delete({
            where: {
                id: Number(postId),
            },
        })

        return {
            userErrors: [],
            post,
        }
    },
}
