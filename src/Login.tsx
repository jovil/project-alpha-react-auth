import { useState, useContext, useEffect } from "react";
import { GlobalStateContext } from "./context";
import { useUser } from "./UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
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

        handleLoginState();
        setEmailNotFound(false);
        setLogin(true);
        setUserState({ ...userState, email: result.email });
        // redirect user to the auth page
        navigate("/auth");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-4xl">Login</h2>
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
          <button
            className="btn-primary"
            type="submit"
            onClick={(e) => handleSubmit(e)}
          >
            Login
          </button>

          {/* display success message */}
          {login && (
            <p className="text-success">You are logged in successfully.</p>
          )}

          {/* display email not found message */}
          {emailNotFound && <p className="text-danger">Email doesn't exist.</p>}
        </div>
      </Form>
    </div>
  );
};

export default Login;
