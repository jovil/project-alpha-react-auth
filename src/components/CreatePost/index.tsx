import { useState } from "react";
import CreatePostModal from "./modal";
import Cookies from "universal-cookie";
import { Form } from "react-bootstrap";

const CreatePost = ({
  classes = "",
  btnClasses = "",
}: {
  classes?: string;
  btnClasses?: string;
}) => {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [postImage, setPostImage] = useState<any>();
  const [showModal, setShowModal] = useState(false);

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

  const handleToggleModal = (value: boolean) => {
    setShowModal(value);
  };

  return (
    <>
      {token && (
        <>
          <CreatePostModal
            isShowModal={showModal}
            isPostImage={postImage}
            isImageBase64={imageBase64}
            onToggleModal={handleToggleModal}
          />
          <div className={classes}>
            <div className="max-w-[948px] flex flex-col justify-center items-center gap-3.5 mx-auto">
              <Form
                className="flex flex-col pointer-events-auto"
                title="Create post"
              >
                <Form.Label className="m-0" htmlFor="file-upload">
                  <div className={`${btnClasses} cursor-pointer`}>
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
        </>
      )}
    </>
  );
};

export default CreatePost;
