import { useState } from "react";
import { Form } from "react-bootstrap";
import CreatePostModal from "../../components/CreatePostModal";

const CreatePost = () => {
  const [imageBase64, setImageBase64] = useState<string>("");
  const [postImage, setPostImage] = useState();
  const [showModal, setShowModal] = useState(false);

  const handleToggleModal = (value: boolean) => {
    setShowModal(value);
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);

    setImageBase64(base64 as string);
    setPostImage(file);
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
      <CreatePostModal
        isShowModal={showModal}
        isPostImage={postImage}
        isImageBase64={imageBase64}
        onToggleModal={handleToggleModal}
      />
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
