import { useContext, useEffect, useCallback } from "react";
import { GlobalStateContext } from "../Context/context";
import { useUser } from "../Context/UserContext";
import { Form } from "react-bootstrap";
import iconUpload from "../../assets/images/icon-upload.svg";
import Cookies from "universal-cookie";
import defaultAvatar from "../../assets/images/toon_6.png";
const cookies = new Cookies();

const HeaderSection = () => {
  const { state, setState } = useContext(GlobalStateContext);
  const { userState, setUserState } = useUser();
  const apiUrl = process.env.REACT_APP_API_URL;
  const uploadsUrl = `${apiUrl}/uploads`;

  const fetchUser = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/user/${userState._id}`;

    const configuration = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(url, configuration);
      const result = await response.json();
      setUserState((prev: any) => {
        return {
          ...prev,
          avatar64: result.avatar,
        };
      });
    } catch (error) {
      console.log("error", error);
    }
  }, [setUserState, userState._id]);

  useEffect(() => {
    if (!userState.avatar64) {
      fetchUser();
    }
  }, [fetchUser, userState.avatar64]);

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
    } catch (error) {
      console.log("error", error);
    }
  };

  function handleSubmit(e: any) {
    e.preventDefault();
    uploadProfileImage(userState);
  }

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setUserState({ ...userState, avatar: file, avatar64: base64 });
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
      <div className="grid grid-cols-12">
        <div className="col-span-2"></div>
        <div className="flex justify-center col-span-8">
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="text-xs font-medium flex flex-col gap-3 items-center">
              <img
                className="w-14 h-14 border border-dark/60 object-cover rounded shadow-md"
                src={userState.avatar64 ? userState.avatar64 : defaultAvatar}
                alt=""
              />
              <p>{userState.userName}</p>
            </div>
            <Form
              onSubmit={(e) => handleSubmit(e)}
              className="flex flex-col gap-3"
            >
              <Form.Label htmlFor="file-upload">
                <div className="text-sm btn-primary flex gap-2 justify-center items-center cursor-pointer">
                  <p>Upload</p>
                  <img className="h-4 w-4 m-0" src={iconUpload} alt="" />
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
              <button className="btn-primary text-sm" type="submit">
                Submit
              </button>
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
