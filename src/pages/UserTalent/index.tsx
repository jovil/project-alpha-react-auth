import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import defaultAvatar from "../../assets/images/toon_6.png";
import SadFace from "../../assets/images/sad-face.svg";
import loadingImage from "../../assets/images/loading.gif";

const UserTalentPage = ({
  isUser,
}: {
  isUser: Record<string, any> | undefined;
}) => {
  const location = useLocation();
  const { userId } = location.state || {};
  const { userState } = useUser();

  return (
    <>
      {isUser?.talentProfileActive ? (
        <div
          className="h-full mx-auto pointer-events-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="container flex flex-col gap-10 relative pointer-events-auto cursor-default">
            {isUser ? (
              <>
                <div className="flex justify-between items-center w-full">
                  <div className="grid grid-cols-12 gap-16 w-full">
                    <div className="col-span-8 py-12 flex flex-col gap-10">
                      <div className="flex flex-col gap-6">
                        <h2 className="text-6xl font-medium leading-tight">
                          {isUser.talentProfile.title}
                        </h2>
                        <p className="text-xl leading-8 text-grey">
                          {isUser.talentProfile.description}
                        </p>
                      </div>

                      <div className="flex">
                        <a
                          className="btn-chunky-primary block text-center"
                          href={`mailto:${isUser.email}`}
                        >
                          Contact @{isUser.userName}
                        </a>
                      </div>
                    </div>

                    <div className="col-span-4 flex flex-col gap-4">
                      <div className="col-span-4 flex flex-col gap-4 bg-white rounded-xl p-4 shadow-chunky">
                        <img
                          className="w-46 h-46 object-cover rounded-lg w-full"
                          src={isUser.avatar || defaultAvatar}
                          alt=""
                        />

                        <div className="flex flex-col gap-1">
                          <NavLink
                            className="font-bold text-blue-100"
                            to={`/user/${isUser.userName.toLowerCase()}`}
                            state={{ userId: isUser._id }}
                          >
                            {isUser.userName},{" "}
                            <span>{isUser?.talentProfile?.role}</span>
                          </NavLink>

                          <p className="text-grey">
                            {isUser.state}, {isUser.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center col-span-4 bg-white rounded-xl p-4 shadow-chunky">
                        <div className="w-full">
                          <div className="text-sm flex flex-col justify-between gap-3">
                            <h4 className="subtitle">Talents:</h4>
                            <div className="flex flex-wrap gap-2">
                              {isUser?.talentProfile?.talents?.map(
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
        <>
          {userState._id === userId && (
            <>
              <section className="flex justify-center items-center flex-grow">
                <div className="container">
                  <div className="bg-dark/5 w-full flex flex-col border border-dashed border-dark/60 rounded pointer-events-auto">
                    <NavLink
                      className="p-16 m-0 cursor-pointer"
                      to="/auth?view=talent"
                    >
                      <div className="flex flex-col justify-center items-center gap-4">
                        <img className="h-16 w-16" src={SadFace} alt="" />
                        <div className="flex flex-col gap-6 items-center">
                          <p>You don't have a profile.</p>
                          <div className="btn-chunky-primary">
                            Create a talent profile
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </>
  );
};

export default UserTalentPage;
