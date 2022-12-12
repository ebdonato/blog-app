/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IContext } from "../context"

interface IPostParent {
    authorId: number
}

export const Post = {
    user: ({ authorId }: IPostParent, _: undefined, { prisma }: IContext) => {
        return prisma.user.findUnique({
            where: {
                id: authorId,
            },
        })
    },
}
