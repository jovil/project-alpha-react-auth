import { useContext, useState } from "react";
import { GlobalStateContext } from "../../context/Context";
import { useUser } from "../../context/UserContext";
import { Form } from "react-bootstrap";
import Cookies from "universal-cookie";
import defaultAvatar from "../../assets/images/toon_6.png";
import loading from "../../assets/images/loading.gif";

const HeaderSection = () => {
  const cookies = new Cookies();
  const { state, setState } = useContext(GlobalStateContext);
  const { userState, setUserState } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUploaded, setAvatarUploaded] = useState(false);
  const [avatarSavedMessage, setAvatarSavedMessage] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const uploadsUrl = `${apiUrl}/uploads`;

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    setState({ ...state, isLoggedIn: false });
    setUserState({
      _id: undefined,
      user: undefined,
      email: undefined,
      userName: undefined,
      avatar: undefined,
      avatar64: undefined,
      hasPosted: undefined,
      hasProducts: undefined,
      bankAccountDetails: {
        accountHoldersName: undefined,
        accountNumber: undefined,
        bankName: undefined,
      },
    });
    window.location.href = "/";
  };

  const uploadProfileImage = async (data: any) => {
    const file = userState.avatar;
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append(
      "user",
      JSON.stringify({
        _id: userState._id,
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
      <div className="max-w-[948px] mx-auto grid grid-cols-12">
        <div className="col-span-2"></div>
        <div className="flex justify-center col-span-8">
          <div className="flex flex-col justify-center items-center gap-4">
            <p className="text-xs text-dark">Account</p>
            <div className="text-xs font-medium flex flex-col gap-3 items-center">
              <img
                className="w-16 h-16 border border-dark/60 object-cover rounded shadow-md"
                src={userState.avatar ? userState.avatar : defaultAvatar}
                alt=""
              />
              <p>{userState.userName}</p>
            </div>
            <Form
              onSubmit={(e) => handleSubmit(e)}
              className="flex flex-col gap-3"
            >
              {!avatarUploaded && (
                <Form.Label htmlFor="file-upload">
                  <div className="text-xs btn-outline-dark flex gap-2 justify-center items-center cursor-pointer">
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
        <div className="col-span-2">
          <div className="flex justify-end items-center">
            <button
              className="btn-outline-danger text-xs font-semibold"
              type="submit"
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeaderSection;
