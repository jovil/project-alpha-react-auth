import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Cookies from "universal-cookie";
import defaultAvatar from "../assets/images/toon_6.png";
import CreateProductModal from "./CreateProductModalComponent";
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
      <div className="fixed bottom-0 right-0 left-0 z-10 px-4 py-3.5 pointer-events-none">
        <div className="max-w-[908px] flex flex-col justify-center items-center gap-3.5 mx-auto">
          <img
            className="rounded-full w-10 h-10 object-cover border border-dark/30 shadow-md"
            src={userState.avatar64 ? userState.avatar64 : defaultAvatar}
            alt=""
          />
          <div className="flex flex-col pointer-events-auto">
            <button
              className="btn-primary rounded-full text-sm flex gap-2 justify-center items-center cursor-pointer"
              onClick={handleToggleModal}
            >
              Create product
            </button>
          </div>
        </div>
      </div>
    </>
  ) : (
    ""
  );
};

export default CreateProduct;
