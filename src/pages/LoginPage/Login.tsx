import { useState, useContext } from "react";
import { GlobalStateContext } from "../../context/Context";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
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
  const apiUrl = process.env.REACT_APP_API_URL;
  const dbUrl = `${apiUrl}/login`;

  const handleLoginState = () => {
    setState({ ...state, isLoggedIn: true });
  };

  const handleLogin = async (e: any) => {
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
        setUserState({
          ...userState,
          email: result.email,
          userName: result.userName,
          _id: result._id,
          talentProfile: {
            role: result.role,
            talents: result.talents,
          },
          state: result.state,
          city: result.city,
          avatar: result.avatar,
          shopDescription: result.shopDescription,
          productCount: result.productCount,
          postCount: result.postCount,
          hiringDetails: result.hiringDetails,
        });

        // redirect user to the auth page
        navigate("/discover");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-6 w-[400px] mx-auto">
      <h2 className="text-2xl">Login</h2>
      <form
        className="font-bold max-w-[400px] flex flex-col items-center gap-4"
        onSubmit={(e) => handleLogin(e)}
      >
        <div className="flex flex-col gap-4 w-full">
          {/* email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm uppercase tracking-wide">
              Email address
            </label>
            <input
              className="border-2 border-[#444] p-3 rounded"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              autoFocus
            />
          </div>

          {/* password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm uppercase tracking-wide">Password</label>
            <input
              className="border-2 border-[#444] p-3 rounded"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
        </div>

        <div className="w-full">
          {/* submit button */}
          <button
            className="btn-chunky-primary"
            type="submit"
            onSubmit={(e) => handleLogin(e)}
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
      </form>
    </div>
  );
};

export default Login;
