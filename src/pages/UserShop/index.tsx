import { useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import HeaderSection from "./HeaderSection";
import Grid from "./Grid";
import SadFace from "../../assets/images/sad-face.svg";
import CreateProductModal from "../../components/CreateProduct/modal";
import useCreateProduct from "../../hooks/useCreateProduct";
import { AnimatePresence } from "framer-motion";

const UserShopPage = ({
  isUser,
}: {
  isUser: Record<string, any> | undefined;
}) => {
  const location = useLocation();
  const { userId } = location.state || {};
  const { userState } = useUser();
  const { isShowModal, handleToggleCreateProductModal } = useCreateProduct();

  return (
    <>
      {isUser?.productCount > 0 ? (
        <>
          <HeaderSection isProfile={isUser} />
          <Grid isUser={isUser} />
        </>
      ) : (
        <>
          {userState._id === userId && (
            <>
              <section className="flex justify-center items-center flex-grow">
                <div className="container">
                  <div className="bg-dark/5 w-full flex flex-col border border-dashed border-dark/60 rounded pointer-events-auto">
                    <div
                      className="p-16 m-0 cursor-pointer"
                      onClick={handleToggleCreateProductModal}
                    >
                      <div className="flex flex-col justify-center items-center gap-4">
                        <img className="h-16 w-16" src={SadFace} alt="" />
                        <div className="flex flex-col items-center gap-6">
                          <p>You don't have any products.</p>
                          <div className="btn-chunky-primary">
                            Create a product
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <AnimatePresence
                initial={false}
                mode="wait"
                onExitComplete={() => null}
              >
                {isShowModal && (
                  <CreateProductModal
                    onToggleModal={handleToggleCreateProductModal}
                  />
                )}
              </AnimatePresence>
            </>
          )}
        </>
      )}
    </>
  );
};

export default UserShopPage;
