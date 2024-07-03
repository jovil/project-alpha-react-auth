import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from "react-bootstrap";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
      e.preventDefault();
      const apiUrl = process.env.REACT_APP_API_URL;
      const dbUrl = `${apiUrl}/register`;

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

      await fetch(dbUrl, configuration)
      .then((result) => {
        if (result.ok) {
          setRegister(true);
          navigate('/login', {
            state: {
              userEmail: postData.email,
              userPassword: postData.password
            }
          });
        }
      })
      .catch((error) => {console.log(error)})
    }

    return (
        <>
          <h1 className="text-4xl">Register</h1>
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
            {register && (
                <p className="text-success">You Are Registered Successfully</p>
              )}
          </Form>
        </>
    )
}
