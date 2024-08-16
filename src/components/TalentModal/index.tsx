import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../../context/UserContext";
import loadingImage from "../../assets/images/loading.gif";
import Backdrop from "../Backdrop";
import { motion } from "framer-motion";
import { slideInFromBottom } from "../../utils/animations";
import { getFetchConfig } from "../../utils/fetchConfig";
import defaultAvatar from "../../assets/images/toon_6.png";
import { NavLink } from "react-router-dom";

const TalentModal = ({
  userId,
  onToggleModal,
}: {
  userId: string;
  onToggleModal: any;
}) => {
  const { setUserState } = useUser();
  const [user, setUser] = useState<Record<string, any> | undefined>();

  const fetchUser = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/user/${userId}`;
    try {
      const response = await fetch(url, getFetchConfig);
      const result = await response.json();
      setUser(result);

      if (result.hiringDetails?.description) {
        setUserState((prev: Record<string, any>) => {
          return {
            ...prev,
            hiringDescription: result.hiringDetails.description,
          };
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, [userId, setUser, setUserState]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <Backdrop onClick={onToggleModal} showCloseButton={true}>
        <motion.div
          variants={slideInFromBottom}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div
            className="h-full overflow-scroll mx-auto pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#f6f5f2] h-[calc(100vh-48px)] mt-12 rounded flex flex-col relative pointer-events-auto cursor-default">
              {user ? (
                <div
                  className="container pt-24 h-full overflow-scroll mx-auto pointer-events-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="container flex flex-col gap-10 relative pointer-events-auto cursor-default">
                    {user.talentProfileActive ? (
                      <>
                        <div className="flex justify-between items-center w-full">
                          <div className="grid grid-cols-12 gap-16 w-full">
                            <div className="col-span-8 py-12 flex flex-col gap-10">
                              <div className="flex flex-col gap-6">
                                <h2 className="text-6xl font-medium leading-tight">
                                  {user.talentProfile.title}
                                </h2>
                                <p className="text-xl leading-8 text-grey">
                                  {user.talentProfile.description}
                                </p>
                              </div>

                              <div className="flex">
                                <a
                                  className="btn-chunky-primary block text-center"
                                  href={`mailto:${user.email}`}
                                >
                                  Contact @{user.userName}
                                </a>
                              </div>
                            </div>

                            <div className="col-span-4 flex flex-col gap-4">
                              <div className="col-span-4 flex flex-col gap-4 bg-white rounded-xl p-4 shadow-chunky">
                                <img
                                  className="w-46 h-46 object-cover rounded-lg"
                                  src={user.avatar || defaultAvatar}
                                  alt=""
                                />
                                <div className="flex flex-col gap-1">
                                  <NavLink
                                    className="font-bold text-blue-100"
                                    to={`/user/${user.userName.toLowerCase()}`}
                                    state={{ userId: user._id }}
                                  >
                                    {user.userName},{" "}
                                    <span>{user?.talentProfile?.role}</span>
                                  </NavLink>

                                  <p className="text-grey">
                                    {user.state}, {user.city}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col items-center col-span-4 bg-white rounded-xl p-4 shadow-chunky">
                                <div className="w-full">
                                  <div className="text-sm flex flex-col justify-between gap-3">
                                    <h4 className="subtitle">Talents:</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {user?.talentProfile?.talents?.map(
                                        (talent: string, index: number) => {
                                          return (
                                            <React.Fragment key={index}>
                                              <p className="text-sm font-bold bg-blue-800 text-blue-200 py-1.5 px-3 rounded-full">
                                                {talent}
                                              </p>
                                            </React.Fragment>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <img
                        className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        src={loadingImage}
                        alt=""
                      />
                    )}
                  </div>
                </div>
              ) : (
                <img
                  className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  src={loadingImage}
                  alt=""
                />
              )}
            </div>
          </div>
        </motion.div>
      </Backdrop>
    </>
  );
};

export default TalentModal;
