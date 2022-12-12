/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// import { IContext } from "../context"
import { userLoader } from "../loaders/userLoader"

interface IPostParent {
    authorId: number
}

export const Post = {
    user: async ({ authorId }: IPostParent) => {
        return await userLoader.load(authorId)
    },
    // user: ({ authorId }: IPostParent, _: undefined, { prisma }: IContext) => {
    //     return prisma.user.findUnique({
    //         where: {
    //             id: authorId,
    //         },
    //     })
    // },
}
