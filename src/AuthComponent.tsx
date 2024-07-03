import React, { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from './context'
import { Button, Form } from "react-bootstrap";
import { useLocation } from 'react-router-dom';
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function AuthComponent() {
  interface PostImageState {
    email: String,
    myFile: any;
  }


  const apiUrl = process.env.REACT_APP_API_URL;
  const authUrl = `${apiUrl}/auth-endpoint`;
  const uploadsUrl = `${apiUrl}/uploads`;
  const { state, setState } = useContext(GlobalStateContext);
  const [postImage, setPostImage] = useState<PostImageState>({
    email: '',
    myFile: ''
  })
  const location = useLocation();
  const { userEmail } = location.state || {};

  useEffect(() => {
    const token = cookies.get("TOKEN");
    // set configurations for the API call here
    const authConfiguration = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    // make the API call
    fetch(authUrl, authConfiguration)
      .then(response => response.json())
      .then((result) => {
        const request: any[] = result;
        const avatar = request.filter(data => data.email.includes(userEmail))
        setPostImage(avatar[0]);
      })
      .catch((error) => {console.log(error)});
  }, [apiUrl, authUrl, userEmail]);

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    setState({ ...state, isLoggedIn: false });
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
    uploadProfileImage(postImage);
  }

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setPostImage({ ...postImage, myFile: base64 })
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

      {postImage && (
        <img className="w-14 h-14" src={postImage.myFile || ''} alt="" />
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
        {!postImage && (
          <Button type="submit">Submit</Button>
        )}
      </Form>
    </div>
  );
}
