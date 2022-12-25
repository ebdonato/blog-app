import React from "react"
import "./Post.css"
import {gql, useMutation} from "@apollo/client"

const TOGGLE_POST = gql`
    mutation PostToggle($postId: ID!) {
        postToggle(postId: $postId) {
            post {
                title
            }
            userErrors {
                message
            }
        }
    }
`

export default function Post({title, content, date, user, published, id, isMyProfile}) {
    const [postToggle /*{ data, loading} */] = useMutation(TOGGLE_POST)

    const formattedDate = new Date(Number(date))

    const onClick = () => {
        postToggle({
            variables: {
                postId: id,
            },
        })
    }

    return (
        <div className="Post" style={published === false ? {backgroundColor: "hotpink"} : {}}>
            {isMyProfile && published === false && (
                <p className="Post__publish" onClick={onClick}>
                    publish
                </p>
            )}
            {isMyProfile && published === true && (
                <p className="Post__publish" onClick={onClick}>
                    unpublish
                </p>
            )}
            <div className="Post__header-container">
                <h2>{title}</h2>
                <h4>
                    Created At {`${formattedDate}`.split(" ").splice(0, 3).join(" ")} by {user}
                </h4>
            </div>
            <p>{content}</p>
        </div>
    )
}
