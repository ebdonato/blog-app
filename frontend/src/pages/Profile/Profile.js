import React from "react"
import {useParams} from "react-router"
import AddPostModal from "../../components/AddPostModal/AddPostModal"
import Post from "../../components/Post/Post"
import {gql, useQuery} from "@apollo/client"

const GET_PROFILE = gql`
    query Profile($userId: ID!) {
        profile(userId: $userId) {
            id
            bio
            isMyProfile
            user {
                id
                name
                posts {
                    id
                    title
                    content
                    createdAt
                    published
                }
            }
        }
    }
`

export default function Profile() {
    const {id} = useParams()

    const {data, error, loading} = useQuery(GET_PROFILE, {
        variables: {
            userId: id,
        },
    })

    if (error) return <div>Error Page</div>

    if (loading) return <div>Loading...</div>

    const {
        profile: {
            // id: profileId,
            bio,
            user: {name, posts},
            isMyProfile,
        },
    } = data

    return (
        <div>
            <div
                style={{
                    marginBottom: "2rem",
                    display: "flex ",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <h1>{name}</h1>
                    <p>{bio}</p>
                </div>
                <div>{isMyProfile ? <AddPostModal /> : null}</div>
            </div>
            <div>
                {posts.map(({id, title, content, createdAt: date, published}) => (
                    <Post {...{title, content, date, id, published, isMyProfile}} user={name} key={id} />
                ))}
            </div>
        </div>
    )
}
