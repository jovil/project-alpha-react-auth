import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import loading from "../../assets/images/loading.gif";
import defaultAvatar from "../../assets/images/toon_6.png";
import HiringModal from "../../components/HiringModal";
import { AnimatePresence } from "framer-motion";

const HeaderSection = ({
  isUser,
  isLoadingAvatar,
}: {
  isUser: any;
  isLoadingAvatar: boolean;
}) => {
  const { userId } = useParams();
  const [showHiringModal, setShowHiringModal] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = showHiringModal ? "hidden" : "auto";
  }, [showHiringModal]);

  const handleToggleModal = () => {
    setShowHiringModal((prevState) => !prevState);
  };

  return (
    <>
      <header className="max-w-[908px] grid grid-cols-12 justify-center mx-auto relative">
        <div className="col-span-1"></div>
        <div className="col-span-10 text-xs  flex flex-col gap-4 items-center">
          <div className="flex flex-col gap-3 items-center">
            <p className="text-dark">Profile</p>
            <div className="w-16 h-16 border border-dark/60 rounded shadow-md relative overflow-hidden">
              {isLoadingAvatar && (
                <img
                  className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0"
                  src={loading}
                  alt=""
                />
              )}
              <img
                className="object-cover aspect-square"
                src={
                  isLoadingAvatar
                    ? defaultAvatar
                    : isUser.avatar
                    ? isUser.avatar
                    : defaultAvatar
                }
                alt=""
              />
            </div>
            <p className="font-medium">{isUser.userName}</p>
          </div>
          <div className="font-medium flex items-center gap-4">
            {isUser?.hasHiringDetails && (
              <button className="btn-outline-dark" onClick={handleToggleModal}>
                Hire @{isUser.userName}
              </button>
            )}
            {isUser.hasProducts && (
              <NavLink className="btn-outline-dark" to={`/shop/${userId}`}>
                @{isUser.userName}'s shop
              </NavLink>
            )}
          </div>
        </div>
        <div className="col-span-1"></div>
      </header>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showHiringModal && (
          <HiringModal isUser={isUser} onToggleModal={handleToggleModal} />
        )}
      </AnimatePresence>
    </>
  );
};

export default HeaderSection;
