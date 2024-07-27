import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import loading from "../../assets/images/loading.gif";
import defaultAvatar from "../../assets/images/toon_6.png";
import HiringModal from "../../components/HiringModal";
import { AnimatePresence } from "framer-motion";
import { apiUrl } from "../../utils/fetchConfig";
import { postFetchConfig } from "../../utils/fetchConfig";

const HeaderSection = ({
  isUser,
  isLoadingAvatar,
}: {
  isUser: any;
  isLoadingAvatar: boolean;
}) => {
  const { userId } = useParams();
  const { userState, setUserState } = useUser();
  const [showHiringModal, setShowHiringModal] = useState<boolean>(false);
  const [showDescriptionForm, setShowDescriptionForm] = useState(false);
  const [profileDescriptionText, setProfileDescriptionText] = useState(
    (userState && userState.profileDescription) || null
  );

  useEffect(() => {
    setProfileDescriptionText(userState && userState.profileDescription);
  }, [userState]);

  const handleToggleModal = () => {
    setShowHiringModal((prevState) => !prevState);
    document.body.style.overflow = !showHiringModal ? "hidden" : "auto";
  };

  const profileDescriptionInput = (e: any) => {
    const { value } = e.target;
    setProfileDescriptionText(value);
  };

  const addProfileDescription = () => {
    setProfileDescriptionText(userState.profileDescription);
    setShowDescriptionForm(true);
  };

  const submitProfileDescription = async (e: any) => {
    e.preventDefault();
    const url = `${apiUrl}/user/profileDescription/${
      userState && userState._id
    }`;

    const data = {
      profileDescription: profileDescriptionText,
    };

    try {
      const response = await fetch(url, postFetchConfig(data));
      const result = await response.json();
      setUserState((prev: any) => {
        return {
          ...prev,
          profileDescription: result.profileDescription,
        };
      });
      setShowDescriptionForm(false);
      setProfileDescriptionText(result.profileDescription);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <header className="max-w-[948px] justify-center mx-auto relative">
        <div className="text-xs flex flex-col gap-4 items-center">
          <div className="flex flex-col gap-3 items-center">
            <p className="text-dark">Profile</p>
            <div className="w-16 h-16 rounded shadow-md relative overflow-hidden">
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
          {userState && userState._id === userId && (
            <>
              {userState.profileDescription.length === 0 && (
                <div className="py-3">
                  <button
                    className="text-sm text-black-100/80 underline"
                    onClick={addProfileDescription}
                  >
                    Add profile description
                  </button>
                </div>
              )}

              {showDescriptionForm && (
                <form
                  className="flex flex-col gap-2"
                  onSubmit={submitProfileDescription}
                >
                  <textarea
                    className="border border-dark/80 rounded p-4"
                    rows={4}
                    cols={50}
                    name="profileDescription"
                    value={profileDescriptionText}
                    onChange={profileDescriptionInput}
                  ></textarea>

                  <button
                    className="btn-primary"
                    onSubmit={submitProfileDescription}
                  >
                    Save
                  </button>
                </form>
              )}
            </>
          )}
          {isUser && (
            <div className="flex flex-col items-center gap-2 pb-3">
              <p className="text-sm text-center max-w-[400px]">
                {userState && userState._id === userId ? (
                  <>{userState && userState.profileDescription}</>
                ) : (
                  <>{isUser && isUser.profileDescription}</>
                )}
              </p>
              {userState && userState.profileDescription && (
                <>
                  {userState &&
                    userState._id === userId &&
                    !showDescriptionForm && (
                      <button
                        className="text-black-100/60 underline"
                        onClick={addProfileDescription}
                      >
                        Edit description
                      </button>
                    )}
                </>
              )}
            </div>
          )}
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
      </header>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showHiringModal && (
          <HiringModal userId={isUser?._id} onToggleModal={handleToggleModal} />
        )}
      </AnimatePresence>
    </>
  );
};

export default HeaderSection;
