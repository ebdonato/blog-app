import Button from "@restart/ui/esm/Button"
import React, {useEffect, useState} from "react"
import {Form} from "react-bootstrap"

import {gql, useMutation} from "@apollo/client"

const SIGNUP = gql`
    mutation Signup($email: String!, $password: String!, $name: String!, $bio: String!) {
        signup(credentials: {email: $email, password: $password}, name: $name, bio: $bio) {
            token
            userErrors {
                message
            }
        }
    }
`

export default function Signup() {
    const [signup, {data /*loading*/}] = useMutation(SIGNUP)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [bio, setBio] = useState("")
    const [error, setError] = useState(null)

    const handleClick = () => {
        setError(null)
        localStorage.removeItem("token")

        signup({
            variables: {
                email,
                password,
                name,
                bio,
            },
        })
    }

    useEffect(() => {
        if (data) {
            data.signup.userErrors.length && setError(data.signup.userErrors.map((error) => error.message).join(" | "))
            data.signup.token && localStorage.setItem("token", data.signup.token)
        }
    }, [data])

    return (
        <div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" placeholder="" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder=""
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control as="textarea" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
                </Form.Group>
                {error && <p>{error}</p>}
                <Button onClick={handleClick}>Signup</Button>
            </Form>
        </div>
    )
}
