import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      method: "POST", // Specify the request method
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
      body: JSON.stringify(postData), // Convert the data to JSON string
    };

    await fetch(dbUrl, configuration)
      .then((result) => {
        if (result.ok) {
          setRegister(true);
          navigate("/login", {
            state: {
              userEmail: postData.email,
              userPassword: postData.password,
            },
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col gap-2 w-[500px] mx-auto">
      <h1 className="text-4xl">Register</h1>
      <Form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-col gap-4">
          {/* email */}
          <Form.Group
            className="flex flex-col gap-2"
            controlId="formBasicEmail"
          >
            <Form.Label>Email address</Form.Label>
            <Form.Control
              className="border border-dark/40 p-3 rounded"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </Form.Group>

          {/* password */}
          <Form.Group
            className="flex flex-col gap-2"
            controlId="formBasicPassword"
          >
            <Form.Label>Password</Form.Label>
            <Form.Control
              className="border border-dark/40 p-3 rounded"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </Form.Group>
        </div>
        <div>
          {/* submit button */}
          <Button
            variant="primary"
            type="submit"
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </Button>

          {/* display success message */}
          {register && (
            <p className="text-success">You Are Registered Successfully</p>
          )}
        </div>
      </Form>
    </div>
  );
}
