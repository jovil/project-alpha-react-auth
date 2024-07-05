import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import { Form } from "react-bootstrap";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const CreatePostModal = () => {
  const [post, setPost] = useState({
    email: "",
    title: "",
    description: "",
  });
  const [showModal, setShowModal] = useState(false);
  const { userState, setUserState } = useUser();
  const token = cookies.get("TOKEN");
  const url = `${process.env.REACT_APP_API_URL}/create`;

  useEffect(() => {
    setPost((prev) => {
      return {
        ...prev,
        email: userState.email,
      };
    });
  }, [userState.email]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setPost((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const createPost = async (e: any) => {
    e.preventDefault();

    console.log("e", e.target);

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
    } catch (error) {
      console.log("error", error);
    }

    setShowModal(false);
    window.location.reload();
  };

  const closeModal = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    setShowModal(false);
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setShowModal(true);
    // setPost({ ...userState, myFile: base64 });
  };

  function convertToBase64(file: File) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  return token ? (
    <>
      {showModal && (
        <div
          className="bg-dark/80 backdrop-blur p-4 fixed inset-0 z-10 flex justify-center items-center"
          onClick={closeModal}
        >
          <section className="container p-4 mx-auto flex flex-col gap-4 bg-white rounded-md">
            <header>
              <h2>Create post</h2>
            </header>
            <div className="flex flex-col gap-4 items-center w-full">
              {userState.myFile && (
                <img
                  className="w-full h-[50vh] object-cover border rounded"
                  src={userState.myFile || ""}
                  alt=""
                />
              )}
              <Form className="w-full" onSubmit={(e) => createPost(e)}>
                <Form.Group className="flex flex-col gap-4">
                  <Form.Control
                    className="border border-dark/40 p-3 rounded"
                    placeholder="Title"
                    name="title"
                    value={post.title}
                    onChange={handleChange}
                    autoFocus
                  />
                  <Form.Control
                    className="border border-dark/40 p-3 rounded"
                    placeholder="Description"
                    name="description"
                    value={post.description}
                    onChange={handleChange}
                  />
                  <button type="submit" className="hidden">
                    Save
                  </button>
                </Form.Group>
              </Form>
            </div>
            <footer className="flex gap-5">
              <button className="btn-primary" onClick={createPost}>
                Publish
              </button>
              <button className="btn-outline-danger" onClick={closeModal}>
                Close
              </button>
            </footer>
          </section>
        </div>
      )}
      <div className="bg-white/10 backdrop-blur-sm shadow-md-reverse fixed bottom-0 right-0 left-0 border-t border-dark/30 flex justify-between items-center px-5 py-3">
        <img
          className="rounded-full w-10 h-10 object-cover border border-dark/30"
          src={userState.myFile}
          alt=""
        />
        <Form className="flex flex-col">
          <Form.Label className="m-0" htmlFor="file-upload">
            <div className="btn-primary text-sm flex gap-2 justify-center items-center">
              Create post
            </div>
          </Form.Label>
          <Form.Group className="hidden">
            <Form.Control
              id="file-upload"
              type="file"
              name="image"
              accept=".jpeg, .png, .jpg"
              onChange={(e) => handleFileUpload(e)}
            />
          </Form.Group>
        </Form>
      </div>
    </>
  ) : (
    ""
  );
};

export default CreatePostModal;
