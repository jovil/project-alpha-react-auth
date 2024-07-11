import { useState, useEffect } from "react";
import { useUser } from "../../pages/Context/UserContext";
import Cookies from "universal-cookie";
import CreateProductModal from "../../components/CreateProductModal";
const cookies = new Cookies();

const CreateProduct = () => {
  const { userState } = useUser();
  const [isShowModal, setIsShowModal] = useState(false);
  // eslint-disable-next-line
  const [product, setProduct] = useState<{
    _id: string;
  }>({
    _id: "",
  });
  const token = cookies.get("TOKEN");

  useEffect(() => {
    setProduct((prev: any) => {
      return {
        ...prev,
        _id: userState._id,
      };
    });
  }, [userState._id]);

  useEffect(() => {
    document.body.style.overflow = isShowModal ? "hidden" : "auto";
  }, [isShowModal]);

  const handleToggleModal = (e: any) => {
    if (e.target !== e.currentTarget) return;
    setIsShowModal((prevState) => !prevState);
  };

  return token ? (
    <>
      {isShowModal && <CreateProductModal onToggleModal={handleToggleModal} />}
      <button
        className={`w-36 h-36 btn-outline-dark text-center rounded-full text-sm flex gap-2 justify-center items-center cursor-pointer m-0 select-none
          ${
            !userState.hasPosted
              ? "pointer-events-none border-dark/20 text-dark/20 shadow-none"
              : ""
          }
        `}
        onClick={handleToggleModal}
      >
        Create product
      </button>
    </>
  ) : (
    ""
  );
};

export default CreateProduct;
