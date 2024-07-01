import { React, useState } from 'react';
import { Form, Button } from "react-bootstrap";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();

      const dbUrl = 'https://project-alpha-auth-db-app-b623d85e31d2.herokuapp.com/login';

      const postData = {
        "email": email,
        "password": password,
      };

      const configuration = {
        method: 'POST', // Specify the request method
        headers: {
          'Content-Type': 'application/json' // Specify the content type as JSON
        },
        body: JSON.stringify(postData) // Convert the data to JSON string
      };

      await fetch(dbUrl, configuration)
      .then(response => response.json())
      .then((result) => {
          setLogin(true);

          // set the cookie
          cookies.set("TOKEN", result.token, {
            path: "/",
          });
          // redirect user to the auth page
          window.location.href = "/auth";
      })
      .catch((error) => {
        console.log(error)
      })
    }

    return (
        <>
          <h2>Login</h2>
          <Form
            onSubmit={(e)=>handleSubmit(e)}
          >
            {/* email */}
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email" />
            </Form.Group>

            {/* password */}
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" />
            </Form.Group>

            {/* submit button */}
            <Button
              variant="primary"
              type="submit"
              onClick={(e)=>handleSubmit(e)}
              >
              Login
            </Button>

            {/* display success message */}
            {login ? (
              <p className="text-success">You Are Logged in Successfully</p>
            ) : (
              <p className="text-danger">You Are Not Logged in</p>
            )}
          </Form>
        </>
    )
}
