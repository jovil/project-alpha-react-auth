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

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}/user/${userId}`;

    const fetchProfile = async () => {
      try {
        const response = await fetch(url, getFetchConfig);
        const result = await response.json();
        setProfile(result);
        setIsLoadingAvatar(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId, setProfile]);

  return (
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
                  <div className="bg-blue-900 w-full flex flex-col border border-dashed border-dark/60 rounded pointer-events-auto">
                    <div
                      className="p-16 m-0 cursor-pointer"
                      onClick={handleToggleCreateProductModal}
                    >
                      <div className="flex flex-col justify-center items-center gap-4">
                        <img className="h-16 w-16" src={SadFace} alt="" />
                        <p>You don't have any products.</p>
                        <div className="btn-primary">Create a product</div>
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
      <UserNavigation />
    </>
  );
};

export default UserShopPage;
