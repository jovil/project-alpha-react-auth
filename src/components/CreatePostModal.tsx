import { useState } from "react";
import { useUser } from "../UserContext";
import { Form } from "react-bootstrap";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const CreatePostModal = () => {
  const [updatedPost, setUpdatedPost] = useState<{
    title: string;
    description: string;
    _id: string;
  }>({
    title: "",
    description: "",
    _id: "",
  });
  const [showModal, setShowModal] = useState(false);
  const { userState, setUserState } = useUser();
  const token = cookies.get("TOKEN");

  const handleClose = () => setShowModal(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setUpdatedPost((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const saveUpdatedPost = () => {
    console.log(updatedPost);

    // axios
    //   .put(
    //     `${process.env.REACT_APP_DB_URL}/update/${updatedPost._id}`,
    //     updatedPost
    //   )
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));

    handleClose();
    window.location.reload();
  };

  function handleSubmit(e: any) {
    e.preventDefault();
    console.log("Submit");
    // uploadProfileImage(userState);
  }

  const closeModal = () => {
    setShowModal(false);
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setShowModal(true);
    setUserState({ ...userState, myFile: base64 });
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
          className="bg-dark/80 backdrop-blur fixed inset-0 z-10"
          onClick={closeModal}
        >
          <section className="container p-4 mx-auto">
            <header>
              <h2>Update post</h2>
            </header>
            <div className="flex flex-col gap-4 items-center w-full">
              {userState.myFile && (
                <img
                  className="w-full h-[50vh] object-cover border rounded"
                  src={userState.myFile || ""}
                  alt=""
                />
              )}
              <Form className="w-full">
                <Form.Group className="flex flex-col gap-3">
                  <Form.Control
                    placeholder="title"
                    name="title"
                    value={updatedPost.title ? updatedPost.title : ""}
                    onChange={handleChange}
                  />
                  <Form.Control
                    placeholder="description"
                    name="description"
                    value={
                      updatedPost.description ? updatedPost.description : ""
                    }
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
            </div>
            <footer>
              <button className="btn-primary" onClick={saveUpdatedPost}>
                Publish
              </button>
              <button className="btn-outline-danger" onClick={handleClose}>
                Close
              </button>
            </footer>
          </section>
        </div>
      )}
      <div className="fixed bottom-0 right-0 left-0 border-t flex justify-between items-center p-3">
        <img
          className="rounded-full w-10 h-10 object-cover"
          src={userState.myFile}
          alt=""
        />
        <Form onSubmit={(e) => handleSubmit(e)} className="flex flex-col">
          <Form.Label className="m-0" htmlFor="file-upload">
            <div className="bg-[#0d6efd] hover:bg-[#0b5ed7] transition-colors ease-in-out duration-150 px-3 py-1.5 rounded-md cursor-pointer text-white flex gap-2 justify-center items-center">
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
          {/* <Button type="submit">Submit</Button> */}
        </Form>
      </div>
    </>
  ) : (
    ""
  );
};

export default CreatePostModal;
