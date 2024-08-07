import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

const useCreateProduct = () => {
  const { userState } = useUser();
  const [isShowModal, setIsShowModal] = useState(false);
  // eslint-disable-next-line
  const [product, setProduct] = useState<{
    _id: string;
  }>({
    _id: "",
  });

  useEffect(() => {
    setProduct((prev: any) => {
      return {
        ...prev,
        _id: userState?._id,
      };
    });
  }, [userState?._id]);

  useEffect(() => {
    document.body.style.overflow = isShowModal ? "hidden" : "";
  }, [isShowModal]);

  const handleToggleCreateProductModal = (e: any) => {
    if (e.target !== e.currentTarget) return;
    setIsShowModal((prevState) => !prevState);
  };
  return {
    isShowModal,
    product,
    handleToggleCreateProductModal,
  };
};

export default useCreateProduct;
