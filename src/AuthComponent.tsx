import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function AuthComponent() {
  const [message, setMessage] = useState("");
  const token = cookies.get("TOKEN");

  useEffect(() => {
    const url = 'https://project-alpha-auth-db-app-b623d85e31d2.herokuapp.com/auth-endpoint';

    // set configurations for the API call here
    const configuration = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // make the API call
    fetch(url, configuration)
      .then(response => response.json())
      .then((result) => {
        // assign the message in our result to the message we initialized above
        setMessage(result.message);
      })
      .catch((error) => {console.log(error)});
  }, [token]);

  const logout = () => {
    // destroy the cookie
    cookies.remove("TOKEN", { path: "/" });
    // redirect user to the landing page
    window.location.href = "/";
  }

  return (
    <div className="text-center">
      <h1>Auth Component</h1>
      <h3 className="text-danger">{message}</h3>

      {/* logout */}
      <Button type="submit" variant="danger" onClick={() => logout()}>
        Logout
      </Button>
    </div>
  );
}
