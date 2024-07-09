import { useState, useEffect } from "react";
import { useUser } from "../Context/UserContext";
import { Form } from "react-bootstrap";
import loading from "../../assets/images/loading.gif";

const CreatePost = () => {
  const { userState, setUserState } = useUser();
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

  const createPost = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    setPost((prev) => {
      return {
        ...prev,
        _id: userState._id,
        email: userState.email,
      };
    });

    console.log("create post", post);

    const file = post.image;
    const formData = new FormData();
    formData.append("image", file);
    formData.append(
      "post",
      JSON.stringify({
        _id: userState._id,
        email: userState.email,
        caption: post.caption,
      })
    );

    const configuration = {
      method: "POST", // Specify the request method
      body: formData, // Convert the data to JSON string
    };

    try {
      await fetch(url, configuration);
      await updateHasProducts();
      setShowModal(false);
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateHasProducts = async () => {
    const url = `${process.env.REACT_APP_API_URL}/update-hasProducts/${userState._id}`;

    const hasProducts = {
      hasProducts: true,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify(hasProducts), // Convert the data to JSON string
      });
      const result = response.json();
      setUserState((prev: any) => {
        return {
          ...prev,
          hasProducts: true,
        };
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setPost((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const closeModal = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    setShowModal(false);
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);

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

  return (
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
      <Form className="flex flex-col">
        <Form.Label className="m-0" htmlFor="post-file-upload">
          <div className="w-36 h-36 btn-outline-dark text-center rounded-full text-sm flex gap-2 justify-center items-center cursor-pointer select-none">
            Create post
          </div>
        </Form.Label>
        <Form.Group className="hidden">
          <Form.Control
            id="post-file-upload"
            type="file"
            name="image"
            accept=".jpeg, .png, .jpg"
            onChange={(e) => handleFileUpload(e)}
          />
        </Form.Group>
      </Form>
    </>
  );
};

export default CreatePost;
