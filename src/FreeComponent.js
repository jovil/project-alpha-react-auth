import React, { useEffect, useState } from "react";

export default function FreeComponent() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const url = 'https://project-alpha-auth-db-app-b623d85e31d2.herokuapp.com/free-endpoint';

    const configuration = {
      method: 'GET',
    };

    fetch(url, configuration)
    .then(response => response.json())
    .then((result) => {
      setMessage(result.message);
    })
    .catch((error) => {
      error = new Error();
    });
  }, [])

  return (
    <div>
      <h1 className="text-center">Free Component</h1>
      <h3 className="text-center text-danger">{message}</h3>
    </div>
  );
}
