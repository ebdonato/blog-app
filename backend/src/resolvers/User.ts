/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IContext } from "../context"

interface IUserParent {
    id: number
}

export const User = {
    posts: (
        { id }: IUserParent,
        _: undefined,
        { prisma, userInfo }: IContext
    ) => {
        const isOwnProfile = id === userInfo.userId

        if (isOwnProfile) {
            return prisma.post.findMany({
                where: {
                    authorId: id,
                },
                orderBy: [
                    {
                        createdAt: "desc",
                    },
                ],
            })
        } else {
            return prisma.post.findMany({
                where: {
                    authorId: id,
                    published: true,
                },
                orderBy: [
                    {
                        createdAt: "desc",
                    },
                ],
            })
        }
    },
}
