import JWT from "jsonwebtoken"

const JWT_SIGNATURE: string = process.env.JWT_SIGNATURE ?? "JWT_SIGNATURE"

export interface IUserInfo {
    userId: number
}

export const getUserFromToken = (token: string = ""): IUserInfo | null => {
    try {
        const userInfo = JWT.verify(token, JWT_SIGNATURE) as IUserInfo

        return userInfo
    } catch (error) {
        return null
    }
}
