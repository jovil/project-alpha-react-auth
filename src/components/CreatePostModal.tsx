import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import { Form } from "react-bootstrap";
import Cookies from "universal-cookie";
import defaultAvatar from "../assets/images/avatar.jpeg";
import loading from "../assets/images/loading.gif";
const cookies = new Cookies();

const CreatePostModal = () => {
  const [post, setPost] = useState<{
    email: string;
    image: any;
    caption: string;
    _id: string;
  }>({
    email: "",
    image: "",
    caption: "",
    _id: "",
  });
  const [imageBase64, setImageBase64] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const { userState } = useUser();
  const token = cookies.get("TOKEN");
  const url = `${process.env.REACT_APP_API_URL}/create`;

  useEffect(() => {
    setPost((prev: any) => {
      return {
        ...prev,
        email: userState.email,
      };
    });
  }, [userState]);

  useEffect(() => {}, [post]);

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

    setIsLoading(true);
    console.log("e", e.target);

    setPost((prev) => {
      return {
        ...prev,
        email: userState.email,
      };
    });

    console.log("create post", post);

    const file = post.image;
    const postData = {
      email: post.email,
      caption: post.caption,
    };
    const formData = new FormData();
    formData.append("image", file);
    formData.append("post", JSON.stringify(postData));

    console.log("image", file);
    console.log("postData", postData);
    console.log("formData", formData);

    const configuration = {
      method: "POST", // Specify the request method
      body: formData, // Convert the data to JSON string
    };

    try {
      const response = await fetch(url, configuration);
      const result = await response.json();
      console.log("result", result);
      setShowModal(false);
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      console.log("error", error);
    }
  };

  const closeModal = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    setShowModal(false);
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    console.log("file", file);
    setImageBase64(base64 as string);
    setPost({ ...post, image: file });
    setShowModal(true);
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
          <section className="w-[500px] p-4 mx-auto flex flex-col gap-4 bg-white rounded-md">
            <header>
              <h2>Create post</h2>
            </header>
            <div className="flex flex-col gap-4 items-center w-full">
              {post.image && (
                <img
                  className="w-full h-[50vh] object-cover border border-dark/40 rounded"
                  src={imageBase64}
                  alt=""
                />
              )}
              <Form className="w-full" onSubmit={(e) => createPost(e)}>
                <Form.Group className="flex flex-col gap-4">
                  <Form.Control
                    className="border border-dark/40 p-3 rounded"
                    placeholder="Caption"
                    name="caption"
                    value={post.caption}
                    onChange={handleChange}
                    autoFocus
                  />
                  <button type="submit" className="hidden">
                    Save
                  </button>
                </Form.Group>
              </Form>
            </div>
            <footer className="flex justify-end gap-3">
              <button
                className="min-w-[91px] btn-primary text-sm flex justify-center items-center"
                onClick={createPost}
              >
                {isLoading ? (
                  <img className="w-4 h-4 object-cover" src={loading} alt="" />
                ) : (
                  "Publish"
                )}
              </button>
              <button
                className="btn-outline-danger text-sm"
                onClick={closeModal}
              >
                Close
              </button>
            </footer>
          </section>
        </div>
      )}
      <div className="bg-white/10 backdrop-blur shadow-md-reverse fixed bottom-0 right-0 left-0 border-t border-dark/10 flex justify-between items-center px-5 py-3">
        <img
          className="rounded-full w-10 h-10 object-cover border border-dark/30"
          src={userState.avatar || defaultAvatar}
          alt=""
        />
        <Form className="flex flex-col">
          <Form.Label className="m-0" htmlFor="file-upload">
            <div className="btn-primary text-sm flex gap-2 justify-center items-center cursor-pointer">
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
