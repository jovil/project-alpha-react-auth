import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import loading from "../../assets/images/loading.gif";
import defaultAvatar from "../../assets/images/toon_6.png";
import { apiUrl } from "../../utils/fetchConfig";
import { postFetchConfig } from "../../utils/fetchConfig";

const HeaderSection = ({
  isProfile,
  profileLoadingAvatar,
}: {
  isProfile: any;
  profileLoadingAvatar: boolean;
}) => {
  const { userState, setUserState } = useUser();
  const [showDescriptionForm, setShowDescriptionForm] = useState(false);
  const [shopDescriptionText, setShopDescriptionText] = useState("");

  const shopDescriptionInput = (e: any) => {
    const { value } = e.target;
    setShopDescriptionText(value);
  };

  const addShopDescription = () => {
    setShopDescriptionText(userState.shopDescription);
    setShowDescriptionForm(true);
  };

  const submitShopDescription = async (e: any) => {
    e.preventDefault();
    const url = `${apiUrl}/user/shopDescription/${userState && userState._id}`;

    const data = {
      shopDescription: shopDescriptionText,
    };

    try {
      const response = await fetch(url, postFetchConfig(data));
      const result = await response.json();
      setUserState((prev: any) => {
        return {
          ...prev,
          shopDescription: result.shopDescription,
        };
      });
      setShowDescriptionForm(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <header className="flex justify-center relative">
        <div className="text-sm flex flex-col gap-4 items-center">
          <div className="flex flex-col gap-3 items-center">
            <p className="text-dark font-bold">Shop</p>
            <NavLink
              className="flex flex-col gap-3 items-center"
              to={`/user/${isProfile._id}`}
            >
              <div className="w-16 h-16 rounded shadow-md relative overflow-hidden">
                {profileLoadingAvatar && (
                  <img
                    className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0"
                    src={loading}
                    alt=""
                  />
                )}
                <img
                  className="object-cover aspect-square"
                  src={
                    profileLoadingAvatar
                      ? defaultAvatar
                      : isProfile.avatar
                      ? isProfile.avatar
                      : defaultAvatar
                  }
                  alt=""
                />
              </div>
              <p className="font-bold">{isProfile.userName}</p>
            </NavLink>
          </div>
          {userState && userState._id === isProfile._id && (
            <>
              {userState.shopDescription?.length === 0 && (
                <div className="py-3">
                  <button
                    className="text-sm text-black-100/80 underline"
                    onClick={addShopDescription}
                  >
                    Add shop description
                  </button>
                </div>
              )}
              {showDescriptionForm && (
                <form
                  className="flex flex-col gap-2"
                  onSubmit={submitShopDescription}
                >
                  <textarea
                    className="border border-dark/80 rounded p-4"
                    rows={4}
                    cols={50}
                    name="shopDescription"
                    value={shopDescriptionText}
                    onChange={shopDescriptionInput}
                  ></textarea>

                  <button
                    className="btn-primary"
                    onSubmit={submitShopDescription}
                  >
                    Save
                  </button>
                </form>
              )}
            </>
          )}
          {isProfile && (
            <div className="flex flex-col items-center gap-2 pb-3">
              <p className="text-sm text-dark text-center leading-6 max-w-[420px]">
                {userState && userState._id === isProfile._id ? (
                  <>{userState && userState.shopDescription}</>
                ) : (
                  <>{isProfile && isProfile.shopDescription}</>
                )}
              </p>
              {userState &&
                userState?._id === isProfile._id &&
                !showDescriptionForm && (
                  <button
                    className="text-black-100/60 underline"
                    onClick={addShopDescription}
                  >
                    Edit description
                  </button>
                )}
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default HeaderSection;
