import { useContext, useEffect, useCallback } from "react";
import { GlobalStateContext } from "./context";
import { useUser } from "./UserContext";
import { Button, Form, Row, Col, Stack } from "react-bootstrap";
import iconUpload from "./icon-upload.svg";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function AuthComponent() {
  interface ApiResponse {
    email: string;
    myFile: string;
  }
  const apiUrl = process.env.REACT_APP_API_URL;
  const authUrl = `${apiUrl}/auth-endpoint`;
  const uploadsUrl = `${apiUrl}/uploads`;
  const { state, setState } = useContext(GlobalStateContext);
  const { userState, setUserState } = useUser();

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
      const user = result.find(
        (data: ApiResponse) => data.email === userState.email
      );
      if (user) setUserState({ email: user.email, myFile: user.myFile });
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
    setUserState({ email: undefined, myFile: undefined });
    window.location.href = "/";
  };

  const uploadProfileImage = async (data: any) => {
    setUserState({ ...userState, email: userState.email });

    try {
      await fetch(uploadsUrl, {
        method: "POST", // Specify the request method
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify(userState), // Convert the data to JSON string
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
        });
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

  return (
    <div className="text-center">
      <Row>
        <Col></Col>
        <Col className="flex justify-center" xs={6}>
          <Stack className="justify-center items-center gap-4">
            {userState.myFile && (
              <img
                className="w-14 h-14 border rounded"
                src={userState.myFile || ""}
                alt=""
              />
            )}
            <Form onSubmit={(e) => handleSubmit(e)} className="flex flex-col">
              <Form.Label htmlFor="file-upload">
                <div className="text-sm bg-[#0d6efd] hover:bg-[#0b5ed7] transition-colors ease-in-out duration-150 px-3 py-1.5 rounded-md cursor-pointer text-white flex gap-2 justify-center items-center">
                  Upload
                  <img className="h-4 w-4 m-0" src={iconUpload} alt="" />
                </div>
              </Form.Label>
              <Form.Group className="d-none">
                <Form.Control
                  id="file-upload"
                  type="file"
                  name="image"
                  accept=".jpeg, .png, .jpg"
                  onChange={(e) => handleFileUpload(e)}
                />
              </Form.Group>
              {!userState.myFile && <Button type="submit">Submit</Button>}
            </Form>
          </Stack>
        </Col>
        <Col>
          <Stack
            className="flex justify-end items-center h-full"
            direction="horizontal"
            gap={3}
          >
            <Button
              className="text-xs"
              type="submit"
              variant="outline-danger"
              onClick={() => logout()}
            >
              Logout
            </Button>
          </Stack>
        </Col>
      </Row>
    </div>
  );
}
