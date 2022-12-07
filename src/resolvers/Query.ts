import { IContext } from "../context"

export const Query = {
    posts: (_: undefined, __: undefined, { prisma }: IContext) => {
        return prisma.post.findMany({
            orderBy: [
                {
                    createdAt: "desc",
                },
            ],
        })
    },
}
