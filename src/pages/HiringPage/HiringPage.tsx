import React, { useEffect, useState, useContext } from "react";
import { GlobalStateContext } from "../../context/Context";
import HiringModal from "../../components/HiringModal";
import { apiUrl, getFetchConfig } from "../../utils/fetchConfig";
import loading from "../../assets/images/loading.gif";
import defaultAvatar from "../../assets/images/toon_6.png";
import { AnimatePresence } from "framer-motion";
import GridHeader from "../../components/Grid/header";
import GridViewContainer from "../../components/Grid/gridViewContainer";
import UserAvatar from "../../components/Card/userAvatar";

const HiringPage = () => {
  const { state } = useContext(GlobalStateContext);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noUsers, setNoUsers] = useState(false);
  const [showHiringModal, setShowHiringModal] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [runShimmerAnimation, setRunShimmerAnimation] = useState(false);

  const fetchUsersForHire = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/forHire`, getFetchConfig);
      const result = await response.json();
      // Show message when no users for hire exists
      if (result.length === 0) setNoUsers(true);
      setUsers(result);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUsersForHire();
  }, []);

  const handleToggleModal = (id: any) => {
    setShowHiringModal((prevState) => !prevState);
    setCurrentUserId(id);
    document.body.style.overflow = !showHiringModal ? "hidden" : "auto";
  };

  const handleLoading = () => {
    setIsLoading(false);
    setRunShimmerAnimation(true);
  };

  return (
    <>
      <section className="max-w-[948px] w-full mx-auto flex flex-col gap-4">
        <GridHeader
          gridViewProp={"hiringView"}
          captionProp={"showHiringCaption"}
        >
          <h1>All cosplayers</h1>
        </GridHeader>
        <GridViewContainer
          gridComponent={"hiringView"}
          captionComponent={"showHiringCaption"}
        >
          {users?.length ? (
            <>
              {users?.toReversed().map((user: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    <div
                      className={`w-full h-auto text-left rounded-3xl flex flex-col relative overflow-hidden group ${
                        state.hiringView === "grid" && !state.showHiringCaption
                          ? "tablet:aspect-[4/6]"
                          : ""
                      }`}
                    >
                      <div className="h-full w-full relative overflow-hidden">
                        {runShimmerAnimation && (
                          <div className="shimmer-overlay"></div>
                        )}
                        <img
                          className={
                            isLoading
                              ? `w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0`
                              : "hidden"
                          }
                          src={isLoading ? loading : ""}
                          alt=""
                        />
                        <img
                          className={`object-cover w-full h-full rounded-3xl ${
                            state.hiringView === "grid" &&
                            state.showHiringCaption
                              ? "aspect-[4/6]"
                              : ""
                          }`}
                          src={user.avatar ?? defaultAvatar}
                          alt=""
                          loading="lazy"
                          onLoad={handleLoading}
                        />
                      </div>
                      {!state.showHiringCaption && (
                        <div className="flex flex-col justify-between gap-6 tablet:absolute px-3 pb-3 tablet:p-3 tablet:pt-12 tablet:bottom-0 w-full tablet:bg-gradient-to-t tablet:from-dark tablet:text-white tablet:opacity-0 tablet:translate-y-2 tablet:group-hover:opacity-100 tablet:group-hover:translate-y-0 tablet:transition">
                          <p>{user.userName}</p>
                          <div className="flex justify-between items-center">
                            <UserAvatar data={user} />
                            <button
                              className="btn-outline-small-no-hover tablet:btn-outline-small text-center group flex items-center gap-1.5"
                              onClick={() => handleToggleModal(user._id)}
                            >
                              Hire {user.userName}
                            </button>
                          </div>
                        </div>
                      )}

                      {state.showHiringCaption && (
                        <div className="flex flex-col justify-between gap-6 px-3 pb-3 tablet:p-3 tablet:py-6 w-full">
                          <p>{user.userName}</p>
                          <div className="flex justify-between items-center">
                            <UserAvatar data={user} />

                            <button
                              className="btn-outline-small-no-hover text-center group flex items-center gap-1.5"
                              onClick={() => handleToggleModal(user._id)}
                            >
                              Hire {user.userName}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <AnimatePresence
                      initial={false}
                      mode="wait"
                      onExitComplete={() => null}
                    >
                      {showHiringModal && currentUserId === user._id && (
                        <HiringModal
                          isUser={user}
                          onToggleModal={handleToggleModal}
                        />
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </>
          ) : noUsers ? (
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
              No cosplayers for hire.
            </p>
          ) : (
            <img
              className="w-6 h-6 absolute inset-1/2 -translate-x-1/2 -translate-y-1/2"
              src={loading}
              alt=""
            />
          )}
        </GridViewContainer>
      </section>
    </>
  );
};

export default HiringPage;
