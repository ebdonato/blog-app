import { IContext } from "../context"
import { Post } from "@prisma/client"

interface IPostCreateArgs {
    title: string
    content: string
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
        { title, content }: IPostCreateArgs,
        { prisma }: IContext
    ): Promise<IPostPayload> => {
        const userErrors: IUserError[] = []

        if (title === "") {
            userErrors.push({
                message: "You must be provide a title",
            })
        }

        if (content === "") {
            userErrors.push({
                message: "You must be provide a content",
            })
        }

        if (userErrors.length > 0) {
            console.log("🚀 ~ file: Mutation.ts:39 ~ userErrors", {
                userErrors,
                post: null,
            })

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
        console.log("🚀 ~ file: Mutation.ts:57 ~ post", post)

        return {
            userErrors: [],
            post,
        }
    },
}
