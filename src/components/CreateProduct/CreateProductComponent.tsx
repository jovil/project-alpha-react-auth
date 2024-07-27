import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import Cookies from "universal-cookie";
import CreateProductModal from "./CreateProductModalComponent";
const cookies = new Cookies();

const CreateProduct = ({ alignButton }: { alignButton?: string }) => {
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
        <div
          className={`${
            alignButton === "right" ? "items-end" : "items-center"
          } max-w-[948px] flex flex-col justify-center gap-3.5 mx-auto`}
        >
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
