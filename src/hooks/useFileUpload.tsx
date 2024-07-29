import { useState } from "react";

const useFileUpload = () => {
  const [showModal, setShowModal] = useState(false);
  const [postImage, setPostImage] = useState<any>();
  const [imageBase64, setImageBase64] = useState<string>("");

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);

    setImageBase64(base64 as string);
    setPostImage(file);
    setShowModal(true);
    e.target.value = "";
  };

  const convertToBase64 = (file: File) => {
    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleToggleModal = (value: boolean) => {
    setShowModal(value);
  };

  return {
    showModal,
    postImage,
    imageBase64,
    handleFileUpload,
    handleToggleModal,
  };
};

export default useFileUpload;
