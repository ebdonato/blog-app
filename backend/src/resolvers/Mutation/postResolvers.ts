/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Post } from "@prisma/client"
import { IContext } from "../../context"

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

export const postResolvers = {
    postCreate: async (
        _: undefined,
        { post: { title = "", content = "" } }: IPostCreateArgs,
        { prisma, userInfo }: IContext
    ): Promise<IPostPayload> => {
        if (!userInfo) {
            return {
                userErrors: [
                    { message: "Forbidden access (not authenticated)" },
                ],
                post: null,
            }
        }

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
                authorId: userInfo.userId,
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
        { prisma, userInfo }: IContext
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

        if (existingPost?.authorId !== userInfo.userId) {
            userErrors.push({
                message: "Post does not belong to user",
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
        { prisma, userInfo }: IContext
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

        if (existingPost?.authorId !== userInfo.userId) {
            userErrors.push({
                message: "Post does not belong to user",
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
    postToggle: async (
        _: undefined,
        { postId }: { postId: string },
        { prisma, userInfo }: IContext
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

        if (existingPost?.authorId !== userInfo.userId) {
            userErrors.push({
                message: "Post does not belong to user",
            })
        }

        if (userErrors.length) {
            return {
                userErrors,
                post: null,
            }
        }

        const post = await prisma.post.update({
            where: {
                id: Number(postId),
            },
            data: {
                published: !existingPost?.published,
            },
        })

        return {
            userErrors: [],
            post,
        }
    },
}
