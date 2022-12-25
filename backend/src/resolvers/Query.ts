/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IContext } from "../context"

export const Query = {
    me: (_: undefined, __: undefined, { prisma, userInfo }: IContext) => {
        if (!userInfo) return null

        return prisma.user.findUnique({
            where: {
                id: userInfo.userId,
            },
        })
    },
    posts: (_: undefined, __: undefined, { prisma }: IContext) => {
        return prisma.post.findMany({
            where: {
                published: true,
            },
            orderBy: [
                {
                    createdAt: "desc",
                },
            ],
        })
    },
    profile: async (
        _: undefined,
        { userId }: { userId: string },
        { prisma, userInfo }: IContext
    ) => {
        const isMyProfile = Number(userId) === userInfo?.userId

        const profile = await prisma.profile.findUnique({
            where: {
                userId: Number(userId),
            },
        })

        if (!profile) return null

        return {
            ...profile,
            isMyProfile,
        }
    },
}
