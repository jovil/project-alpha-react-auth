import { useState, useEffect } from "react";
import { useUser } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

const CreatePost = () => {
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
    setPost((prev) => {
      return {
        ...prev,
        email: userState.email,
      };
    });
  }, [userState.email]);

  const handleClick = async (e: any) => {
    e.preventDefault();
    setPost((prev) => {
      return {
        ...prev,
        email: userState.email,
      };
    });
    console.log("create post", post);
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
      <div className="flex flex-col gap-2">
        <h1 className="title">Create Post</h1>
        <Form className="flex flex-col gap-5">
          <Form.Group className="flex flex-col gap-4">
            <Form.Control
              className="border border-dark p-3"
              name="title"
              placeholder="Title"
              onChange={handleChange}
              value={post.title}
            />
            <Form.Control
              className="border border-dark p-3"
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

export default CreatePost;
