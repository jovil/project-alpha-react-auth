import { useState } from "react";
import { useUser } from "../../context/UserContext";
import CreatePostModal from "../../components/CreatePostModalComponent";
import PostListView from "./PostListView";
import { Form } from "react-bootstrap";
import defaultAvatar from "../../assets/images/toon_6.png";
import Cookies from "universal-cookie";

export default function Home() {
  const cookies = new Cookies();
  const { userState } = useUser();
  const [imageBase64, setImageBase64] = useState<string>("");
  const [postImage, setPostImage] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  const token = cookies.get("TOKEN");

  const handleToggleModal = (value: boolean) => {
    setShowModal(value);
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);

    setImageBase64(base64 as string);
    setPostImage(file);
    setShowModal(true);
    // Clear the input value to allow re-uploading the same file
    e.target.value = "";
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
      <PostListView />
      <CreatePostModal
        isShowModal={showModal}
        isPostImage={postImage}
        isImageBase64={imageBase64}
        onToggleModal={handleToggleModal}
      />
      {token && (
        <div className="fixed bottom-0 right-0 left-0 px-4 py-3.5 pointer-events-none">
          <div className="max-w-[908px] flex flex-col justify-center items-center gap-3.5 mx-auto">
            <img
              className="rounded-full w-10 h-10 object-cover border border-dark/30 shadow-md"
              src={userState.avatar64 ? userState.avatar64 : defaultAvatar}
              alt=""
            />
            <Form className="flex flex-col pointer-events-auto">
              <Form.Label className="m-0" htmlFor="file-upload">
                <div className="btn-primary rounded-full text-sm flex gap-2 justify-center items-center cursor-pointer">
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
        </div>
      )}
    </>
  );
}
