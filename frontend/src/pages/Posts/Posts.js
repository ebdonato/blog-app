import React from "react"
import Post from "../../components/Post/Post"
import {gql, useQuery} from "@apollo/client"

const GET_POST = gql`
    query Posts {
        posts {
            id
            title
            content
            createdAt
            user {
                name
            }
        }
    }
`

export default function Posts() {
    const {data, error, loading} = useQuery(GET_POST)

    if (error) return <div>Error Page</div>

    if (loading) return <div>Loading...</div>

    const {posts} = data

    return (
        <div>
            {posts.map(({id, title, content, createdAt: date, user: {name: user}}) => (
                <Post {...{title, content, date, user, id}} key={id} />
            ))}
        </div>
    )
}
