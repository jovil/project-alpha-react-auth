import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { Form } from "react-bootstrap";
import defaultAvatar from "../../assets/images/toon_6.png";
import loading from "../../assets/images/loading.gif";

const HeaderSection = () => {
  const { userState, setUserState } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUploaded, setAvatarUploaded] = useState(false);
  const [avatarSavedMessage, setAvatarSavedMessage] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const uploadsUrl = `${apiUrl}/uploads`;

  const uploadProfileImage = async (data: any) => {
    const file = userState.avatar;
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append(
      "user",
      JSON.stringify({
        _id: userState._id,
        userName: userState.userName,
      })
    );

    const configuration = {
      method: "POST", // Specify the request method
      body: formData, // Convert the data to JSON string
    };

    try {
      await fetch(uploadsUrl, configuration);
      setIsLoading(false);
      setAvatarUploaded(false);
      setAvatarSavedMessage(true);
      setTimeout(() => {
        setAvatarSavedMessage(false);
        window.location.reload();
      }, 800);
    } catch (error) {
      console.log("error", error);
    }
  };

  function handleSubmit(e: any) {
    e.preventDefault();
    setIsLoading(true);
    uploadProfileImage(userState);
  }

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setUserState({ ...userState, avatar: file, avatar64: base64 });
    setAvatarUploaded(true);
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
    <section className="text-center">
      <div className="flex justify-center col-span-6">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="text-sm font-medium flex flex-col gap-4 items-center">
            <img
              className="w-16 h-16 object-cover rounded shadow-md"
              src={
                userState?.avatar64
                  ? userState.avatar64
                  : userState?.avatar
                  ? userState.avatar
                  : defaultAvatar
              }
              alt=""
            />
            <p className="font-bold">{userState?.userName}</p>
          </div>
          <Form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col gap-3"
          >
            {!avatarUploaded && (
              <Form.Label htmlFor="file-upload">
                <div className="text-sm btn-chunky flex gap-2 justify-center items-center cursor-pointer">
                  {!avatarSavedMessage ? "Upload" : "Saved!"}
                </div>
              </Form.Label>
            )}
            <Form.Group className="hidden">
              <Form.Control
                id="file-upload"
                type="file"
                name="image"
                accept=".jpeg, .png, .jpg"
                onChange={(e) => handleFileUpload(e)}
              />
            </Form.Group>
            {avatarUploaded && (
              <button
                className={
                  isLoading
                    ? "btn-outline-dark min-w-[90px] text-xs flex justify-center items-center text-dark/20 border-dark/20 shadow-none pointer-events-none"
                    : "btn-outline-dark min-w-[90px] text-xs flex justify-center items-center"
                }
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <img className="w-5 h-5" src={loading} alt="" />
                ) : (
                  <>Save</>
                )}
              </button>
            )}
          </Form>
        </div>
      </div>
    </section>
  );
};

export default HeaderSection;
