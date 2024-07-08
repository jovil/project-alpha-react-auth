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
  const authUrl = `${apiUrl}/auth-endpoint`;
  const uploadsUrl = `${apiUrl}/uploads`;

  const fetchUserData = useCallback(async () => {
    const token = cookies.get("TOKEN");
    // set configurations for the API call here
    const authConfiguration = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(authUrl, authConfiguration);
      const result = await response.json();

      if (result.email === userState.email) {
        setUserState((prev: any) => {
          return {
            ...prev,
            email: result.email,
            avatar: result.avatar,
          };
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [authUrl, setUserState, userState.email]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    setState({ ...state, isLoggedIn: false });
    setUserState({ ...userState, email: undefined, avatar: undefined });
    window.location.href = "/";
  };

  const uploadProfileImage = async (data: any) => {
    setUserState({
      ...userState,
      _id: userState._id,
      email: userState.email,
      avatar: userState.avatar,
    });

    try {
      const response = await fetch(uploadsUrl, {
        method: "POST", // Specify the request method
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify(userState), // Convert the data to JSON string
      });
      const result = await response.json();
      console.log("result", result);
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
    setUserState({ ...userState, avatar: base64 });
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
                src={userState.avatar || defaultAvatar}
                alt=""
              />
              <p>{userState.email}</p>
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
