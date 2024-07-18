import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { GlobalStateContext } from "../../context/Context";
import HiringModal from "../../components/HiringModal";
import { apiUrl, getFetchConfig } from "../../utils/fetchConfig";
import loading from "../../assets/images/loading.gif";
import defaultAvatar from "../../assets/images/toon_6.png";
import iconGrid from "../../assets/images/icon-grid.svg";
import iconList from "../../assets/images/icon-list.svg";
import { AnimatePresence } from "framer-motion";

const HiringPage = () => {
  const { state, setState } = useContext(GlobalStateContext);
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
  };

  const handlePostsGridView = () => {
    setState({ ...state, hiringView: "grid" });
  };

  const handlePostsListView = () => {
    setState({ ...state, hiringView: "list" });
  };

  const handleLoading = () => {
    setIsLoading(false);
    setRunShimmerAnimation(true);
  };

  return (
    <>
      <section className="max-w-[908px] w-full mx-auto flex flex-col gap-4">
        <header className="hidden tablet:flex justify-between items-center gap-2">
          <>
            <h1>All cosplayers</h1>
          </>
          <div className="flex justify-end">
            <button>
              <img
                className={`w-7 h-7 p-1.5 rounded-full ${
                  state.hiringView === "list" ? "bg-dark/10" : ""
                }`}
                src={iconList}
                onClick={handlePostsListView}
                alt=""
              />
            </button>
            <button>
              <img
                className={`w-7 h-7 p-1.5 rounded-full ${
                  state.hiringView === "grid" ? "bg-dark/10" : ""
                }`}
                src={iconGrid}
                onClick={handlePostsGridView}
                alt=""
              />
            </button>
          </div>
        </header>
        <div
          className={`grid gap-1 ${
            state.hiringView === "grid"
              ? "tablet:grid-cols-2 desktop:grid-cols-3"
              : ""
          }`}
        >
          {users?.length ? (
            <>
              {users?.toReversed().map((user: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    <div
                      className={`w-full h-auto text-left border border-dark/80 shadow-md rounded flex flex-col gap-3 relative overflow-hidden group ${
                        state.hiringView === "grid"
                          ? "desktop:max-w-[300px] tablet:aspect-[3/4]"
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
                          className="object-cover w-full h-full rounded-sm"
                          src={user.avatar ?? defaultAvatar}
                          alt=""
                          loading="lazy"
                          onLoad={handleLoading}
                        />
                      </div>
                      <div className="flex flex-col justify-between gap-6 tablet:absolute px-3 pb-3 tablet:p-3 tablet:pt-12 tablet:bottom-0 w-full tablet:bg-gradient-to-t tablet:from-dark tablet:text-white tablet:opacity-0 tablet:translate-y-2 tablet:group-hover:opacity-100 tablet:group-hover:translate-y-0 tablet:transition">
                        <p>{user.userName}</p>
                        <div className="flex justify-between items-center">
                          <NavLink
                            className="flex gap-1.5 items-center"
                            to={`/user/${user._id}`}
                          >
                            {user.avatar.length > 0 ? (
                              <img
                                className="rounded-full w-6 h-6 border border-dark/10"
                                src={user.avatar}
                                alt=""
                              />
                            ) : (
                              <img
                                className="rounded-full w-6 h-6 border border-dark/10"
                                src={defaultAvatar}
                                alt=""
                              />
                            )}
                            <p className="text-xs underline">
                              @{user.userName}
                            </p>
                          </NavLink>

                          <button
                            className="btn-outline-small-no-hover tablet:btn-outline-small text-center group flex items-center gap-1.5"
                            onClick={() => handleToggleModal(user._id)}
                          >
                            Hire {user.userName}
                          </button>
                        </div>
                      </div>
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
        </div>
      </section>
    </>
  );
};

export default HiringPage;
