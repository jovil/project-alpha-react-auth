import { useContext, useEffect, useCallback } from "react";
import { GlobalStateContext } from './context'
import { useUser } from './UserContext'
import { Button, Form } from "react-bootstrap";
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { userEmail } = location.state || {};
  const token = cookies.get("TOKEN");
  // set configurations for the API call here
  const authConfiguration = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch(authUrl, authConfiguration);
      const result = await response.json();
      const user = result.find((data: ApiResponse) => data.email === userState.email);
      if (user) setUserState({ email: user.email, myFile: user.myFile });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  useEffect(() => {
    console.log("Initial userState:", userState);
    fetchUserData();
  }, [fetchUserData]);

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    setState({ ...state, isLoggedIn: false });
    setUserState({ email: undefined, myFile: undefined });
    window.location.href = "/";
  }

  const uploadProfileImage = async (data: any) => {
    data.email = userEmail;

    try {
      await fetch(uploadsUrl, {
        method: 'POST', // Specify the request method
        headers: {
          'Content-Type': 'application/json' // Specify the content type as JSON
        },
        body: JSON.stringify(data) // Convert the data to JSON string
      })
      .then(response => response.json())
      .then((result) => {console.log(result)})
      .catch((error) => {console.log(error)})
    } catch (error) {console.log('error', error);}
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    uploadProfileImage(userState);
  }

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setUserState({ ...userState, myFile: base64 })
  }

  function convertToBase64(file: File) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      }

      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  return (
    <div className="text-center">
      <h1>Auth Component</h1>

      {/* logout */}
      <Button type="submit" variant="danger" onClick={() => logout()}>
        Logout
      </Button>

      {userState.myFile && (
        <img className="w-14 h-14" src={userState.myFile || ''} alt="" />
      )}

      <Form
        onSubmit={(e)=>handleSubmit(e)}
      >
        {/* file upload */}
        <Form.Group controlId="formImageUpload">
          <Form.Label>File upload</Form.Label>
          <Form.Control
            type="file"
            name="image"
            accept=".jpeg, .png, .jpg"
            onChange={(e) => handleFileUpload(e)} />
        </Form.Group>
        {!userState.myFile && (
          <Button type="submit">Submit</Button>
        )}
      </Form>
    </div>
  );
}
