import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation } from 'react-router-dom';
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function AuthComponent() {
  interface PostImageState {
    email: String,
    myFile: any;
  }

  const [postImage, setPostImage] = useState<PostImageState>({
    email: '',
    myFile: ''
  })
  const location = useLocation();
  const token = cookies.get("TOKEN");
  const authUrl = 'http://localhost:3000/auth-endpoint';
  const uploadsUrl = 'http://localhost:3000/uploads';
  const { userEmail } = location.state || {};

  // set configurations for the API call here
  const authConfiguration = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    // make the API call
    fetch(authUrl, authConfiguration)
      .then(response => response.json())
      .then((result) => {
        const request: any[] = result;
        const avatar = request.filter(data => data.email.includes(userEmail))
        setPostImage(avatar[0]);
      })
      .catch((error) => {console.log(error)});
  }, [token]);



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

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    window.location.href = "/";
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
        <img className="w-14 h-14" src={postImage.myFile || ''} />
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
