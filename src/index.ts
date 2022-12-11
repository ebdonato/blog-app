/* eslint-disable import/first */
import * as dotenv from "dotenv"
dotenv.config()

import { ApolloServer } from "apollo-server"
import { typeDefs } from "./schema"
import { Query, Mutation } from "./resolvers"
import { PrismaClient } from "@prisma/client"
import { getUserFromToken } from "./utils/getUserFromToken"

const prisma = new PrismaClient()

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
    },
    context: ({ req }) => {
        const userInfo = getUserFromToken(req.headers.authorization)

        return {
            prisma,
            userInfo,
        }
    },
})

server
    .listen()
    .then(({ url }) => {
        console.log("🚀 ~ Server is running on: ", url)
    })
    .catch(console.error)
