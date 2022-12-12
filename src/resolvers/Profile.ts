/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IContext } from "../context"

interface IProfileParent {
    userId: number
}

export const Profile = {
    user: ({ userId }: IProfileParent, _: undefined, { prisma }: IContext) => {
        return prisma.user.findUnique({
            where: {
                id: userId,
            },
        })
    },
}
