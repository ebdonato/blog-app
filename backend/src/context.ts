import { PrismaClient } from "@prisma/client"
import { IUserInfo } from "./utils/getUserFromToken"

export interface IContext {
    prisma: PrismaClient
    userInfo: IUserInfo | null
}
