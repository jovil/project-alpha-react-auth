import { React, useState } from 'react';
import { Form, Button } from "react-bootstrap";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();

      const dbUrl = 'https://project-alpha-auth-db-app-b623d85e31d2.herokuapp.com/register';

      const postData = {
        email: email,
        password: password,
      };

      const configuration = {
        method: 'POST', // Specify the request method
        headers: {
          'Content-Type': 'application/json' // Specify the content type as JSON
        },
        body: JSON.stringify(postData) // Convert the data to JSON string
      };

      fetch(dbUrl, configuration)
      .then((result) => {
        if (result.ok) setRegister(true);
      })
      .catch((error) => {console.log(error)})
    }

    return (
        <>
          <h2>Register</h2>
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
                placeholder="Enter email"
                />
            </Form.Group>

            {/* password */}
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </Form.Group>

            {/* submit button */}
            <Button
              variant="primary"
              type="submit"
              onClick={(e)=>handleSubmit(e)}
            >
              Submit
            </Button>

            {/* display success message */}
            {register ? (
                <p className="text-success">You Are Registered Successfully</p>
              ) : (
                <p className="text-danger">You Are Not Registered</p>
              )}
          </Form>
        </>
    )
}
