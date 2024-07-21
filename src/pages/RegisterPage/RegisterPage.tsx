import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalStateContext } from "../../context/Context";
import { useUser } from "../../context/UserContext";
import { Form, Button } from "react-bootstrap";
import Cookies from "universal-cookie";
import { apiUrl } from "../../utils/fetchConfig";

export default function Register() {
  const cookies = new Cookies();
  const { state, setState } = useContext(GlobalStateContext);
  const { setUserState } = useUser();
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const navigate = useNavigate();

  const handleLoginState = () => {
    setState({ ...state, isLoggedIn: true });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const url = `${apiUrl}/register`;

    const postData = {
      email: email,
      userName: userName,
      password: password,
    };

    const configuration = {
      method: "POST", // Specify the request method
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
      body: JSON.stringify(postData), // Convert the data to JSON string
    };

    try {
      const response = await fetch(url, configuration);
      const result = await response.json();

      if (result.error) return setErrorMessage(true);

      await setUserState((prev: any) => {
        return {
          ...prev,
          email: result.email,
          _id: result._id,
          userName: result.userName,
          hasPosted: false,
          hasProducts: false,
        };
      });

      cookies.set("TOKEN", result.token, {
        path: "/",
      });
      setRegister(true);
      handleLoginState();

      navigate("/auth");
    } catch (error) {
      console.log("error", error);
    }
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
              autoFocus
              required
            />
          </Form.Group>

          {/* userName */}
          <Form.Group
            className="flex flex-col gap-2"
            controlId="formBasicUsername"
          >
            <Form.Label>Username</Form.Label>
            <Form.Control
              className="border border-dark/40 p-3 rounded"
              type="text"
              name="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter username"
              required
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
              required
            />
          </Form.Group>
        </div>
        <div>
          {/* submit button */}
          <Button
            variant="primary"
            type="submit"
            onSubmit={(e) => handleSubmit(e)}
          >
            Submit
          </Button>
        </div>
        <div>
          {errorMessage && <p className="text-error">Email already exist</p>}

          {/* display success message */}
          {register && (
            <p className="text-success">You are registered successfully</p>
          )}
        </div>
      </Form>
    </div>
  );
}
