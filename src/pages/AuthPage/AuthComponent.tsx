import { useState, useEffect } from "react";
import { useUser } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import HeaderSection from "./HeaderSection";

const AuthComponent = () => {
  const { userState } = useUser();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    email: "",
    title: "",
    description: "",
  });
  const url = `${process.env.REACT_APP_API_URL}/create`;

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setPost((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    setPost({ ...post, email: userState.email });
  }, [post, userState.email]);

  const handleClick = async (e: any) => {
    e.preventDefault();

    const configuration = {
      method: "POST", // Specify the request method
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
      body: JSON.stringify(post), // Convert the data to JSON string
    };

    try {
      await fetch(url, configuration);
      navigate("/");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <HeaderSection />
      <div>
        <h1 className="title">Create Post</h1>
        <Form>
          <Form.Group>
            <Form.Control
              name="title"
              placeholder="Title"
              onChange={handleChange}
              value={post.title}
            />
            <Form.Control
              name="description"
              placeholder="Description"
              onChange={handleChange}
              value={post.description}
            />
          </Form.Group>
          <Button onClick={handleClick}>Save</Button>
        </Form>
      </div>
    </>
  );
};

export default AuthComponent;
