import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import HeaderSection from "./HeaderSection";
import Grid from "./Grid";
import { getFetchConfig } from "../../utils/fetchConfig";
import UserNavigation from "../../components/UserNavigation";
import SadFace from "../../assets/images/sad-face.svg";
import CreateProductModal from "../../components/CreateProduct/modal";
import useCreateProduct from "../../hooks/useCreateProduct";
import { AnimatePresence } from "framer-motion";
import loadingImage from "../../assets/images/loading.gif";

const UserShopPage = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const { userState } = useUser();
  const [profile, setProfile] = useState<{
    profileName: string;
    email: string;
    productCount: number;
  }>({
    profileName: "",
    email: "",
    productCount: 0,
  });
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);
  const { isShowModal, handleToggleCreateProductModal } = useCreateProduct();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}/user/${userId}`;

    const fetchProfile = async () => {
      try {
        const response = await fetch(url, getFetchConfig);
        const result = await response.json();
        setProfile(result);
        setIsLoadingAvatar(false);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId, setProfile]);

  return (
    <>
      {loading ? (
        <img
          className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0"
          src={loadingImage}
          alt=""
        />
      ) : (
        <>
          {profile?.productCount > 0 ? (
            <>
              <HeaderSection
                isProfile={profile}
                profileLoadingAvatar={isLoadingAvatar}
              />
              <Grid isUser={profile} />
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
      )}
      <UserNavigation />
    </>
  );
};

export default UserShopPage;
