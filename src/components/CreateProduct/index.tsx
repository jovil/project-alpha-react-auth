import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import Cookies from "universal-cookie";
import CreateProductModal from "./modal";
import { AnimatePresence } from "framer-motion";
const cookies = new Cookies();

const CreateProduct = ({
  classes = "",
  btnClasses = "",
}: {
  classes?: string;
  btnClasses?: string;
}) => {
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
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isShowModal && (
          <CreateProductModal onToggleModal={handleToggleModal} />
        )}
      </AnimatePresence>
      <div className={classes}>
        <div className="max-w-[948px] flex flex-col justify-center items-center gap-3.5 mx-auto">
          <div className="flex flex-col pointer-events-auto">
            <button
              className={`${btnClasses} cursor-pointer`}
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
