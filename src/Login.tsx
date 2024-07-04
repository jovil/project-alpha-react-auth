import { useState, useContext, useEffect } from "react";
import { GlobalStateContext } from "./context";
import { useUser } from "./UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const Login = () => {
  const { state, setState } = useContext(GlobalStateContext);
  const { userState, setUserState } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);
  const [emailNotFound, setEmailNotFound] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail, userPassword } = location.state || {
    userEmail: "",
    userPassword: "",
  };
  const apiUrl = process.env.REACT_APP_API_URL;
  const dbUrl = `${apiUrl}/login`;

  useEffect(() => {
    setEmail(userEmail);
    setPassword(userPassword);
  }, [apiUrl, dbUrl, userEmail, userPassword]);

  const handleLoginState = () => {
    setState({ ...state, isLoggedIn: true });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
      .then((response) => response.json())
      .then((result) => {
        if (!result.email) return setEmailNotFound(true);
        // set the cookie
        cookies.set("TOKEN", result.token, {
          path: "/",
        });
        console.log("TOKEN", result.token);
        handleLoginState();
        setEmailNotFound(false);
        setLogin(true);
        setUserState({ ...userState, email: result.email });
        // redirect user to the auth page
        // navigate('/auth');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <h2 className="text-4xl">Login</h2>
      <Form onSubmit={(e) => handleSubmit(e)}>
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
          variant="success"
          type="submit"
          onClick={(e) => handleSubmit(e)}
        >
          Login
        </Button>

        {/* display success message */}
        {login && (
          <p className="text-success">You are logged in successfully.</p>
        )}

        {/* display email not found message */}
        {emailNotFound && <p className="text-danger">Email doesn't exist.</p>}
      </Form>
    </>
  );
};

export default Login;
