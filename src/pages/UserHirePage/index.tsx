import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import loading from "../../assets/images/loading.gif";
import { apiUrl } from "../../utils/fetchConfig";
import { getFetchConfig, postFetchConfig } from "../../utils/fetchConfig";
import UserNavigation from "../../components/UserNavigation";

const UserHirePage = () => {
  const { userId } = useParams();
  const { userState, setUserState } = useUser();
  const [showDescriptionForm, setShowDescriptionForm] = useState(false);
  const [hiringDescriptionText, setHiringDescriptionText] = useState(
    (userState && userState.hiringDescription) || ""
  );
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

  useEffect(() => {
    setHiringDescriptionText(userState && userState.hiringDescription);
  }, [userState]);

  const hireDescriptionInput = (e: any) => {
    const { value } = e.target;
    setHiringDescriptionText(value);
  };

  const addHiringDescription = () => {
    setHiringDescriptionText(userState.hiringDescription);
    setShowDescriptionForm(true);
  };

  const submitHiringDescription = async (e: any) => {
    e.preventDefault();
    const url = `${apiUrl}/user/update/hiringDescription/${
      userState && userState._id
    }`;

    const data = {
      hiringDescription: hiringDescriptionText,
    };

    try {
      const response = await fetch(url, postFetchConfig(data));
      const result = await response.json();
      setUserState((prev: any) => {
        return {
          ...prev,
          hiringDescription: result.hiringDetails.description,
        };
      });
      setShowDescriptionForm(false);
      setHiringDescriptionText(result.hiringDescription);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div
        className="h-full overflow-scroll mx-auto pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-3 relative pointer-events-auto cursor-default">
          {user ? (
            <div className="max-w-[1140px] mx-auto grid grid-cols-12 gap-4 h-full flex-grow">
              <div className="flex flex-col justify-center items-center px-4 col-span-5">
                <div className="flex flex-col items-center gap-4 w-full px-10">
                  <img
                    className="w-20 h-20 object-cover rounded-full"
                    src={user.avatar}
                    alt=""
                  />
                  <p className="font-medium">{user.userName}</p>

                  {user && user._id === userState?._id && (
                    <>
                      {userState?.hiringDescription?.length === 0 && (
                        <div className="py-1">
                          <button
                            className="text-sm text-black-100/80 underline"
                            onClick={addHiringDescription}
                          >
                            Add description
                          </button>
                        </div>
                      )}
                      {showDescriptionForm && (
                        <form
                          className="text-xs flex flex-col gap-2"
                          onSubmit={submitHiringDescription}
                        >
                          <textarea
                            className="border border-dark/80 rounded p-4"
                            rows={4}
                            cols={30}
                            name="profileDescription"
                            value={hiringDescriptionText}
                            onChange={hireDescriptionInput}
                          ></textarea>

                          <button
                            className="btn-primary"
                            onSubmit={submitHiringDescription}
                          >
                            Save
                          </button>
                        </form>
                      )}
                    </>
                  )}
                  {user && userState?.hiringDescription?.length > 0 && (
                    <div className="flex flex-col items-center gap-2 pb-3">
                      <p className="text-sm text-center max-w-[400px]">
                        {userState && userState._id === user._id ? (
                          <>{userState && userState.hiringDescription}</>
                        ) : (
                          <>{user && user.hiringDetails.description}</>
                        )}
                      </p>
                      {userState && userState.hiringDescription && (
                        <>
                          {userState &&
                            userState._id === user._id &&
                            !showDescriptionForm && (
                              <button
                                className="text-xs text-black-100/60 underline"
                                onClick={addHiringDescription}
                              >
                                Edit description
                              </button>
                            )}
                        </>
                      )}
                    </div>
                  )}
                  <div className="w-full">
                    <a
                      className="btn-primary text-sm block text-center"
                      href={`mailto:${user.email}`}
                    >
                      Contact @{user.userName}
                    </a>
                  </div>
                </div>
                <div className="bg-white flex flex-col w-full px-10 py-6 rounded-3xl">
                  <div className="border-[#dadce0] py-4">
                    <div className="text-sm flex justify-between gap-2">
                      <h4>Location:</h4>
                      <p className="font-medium text-blue-100">
                        {user.state}, {user.city}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#dadce0] py-4">
                    <div className="text-sm flex justify-between gap-2">
                      <h4>Favorite characters:</h4>
                      <div className="flex gap-1">
                        {user.hiringDetails.favoriteCharacters
                          .split(",")
                          ?.map((favChar: any, index: any) => {
                            return (
                              <p
                                className="font-medium text-blue-100"
                                key={index}
                              >
                                {favChar}
                                <>
                                  {index !==
                                    user.hiringDetails.favoriteCharacters.split(
                                      ","
                                    )?.length -
                                      1 && <>,</>}
                                </>
                              </p>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#dadce0] py-4">
                    <div className="text-sm flex flex-col gap-2">
                      <h4>Skills and services:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {user.hiringDetails?.services.map(
                          (service: any, index: any) => {
                            return (
                              <React.Fragment key={index}>
                                {service.serviceAvailable && (
                                  <p className="text-sm font-medium bg-blue-800 text-blue-200 py-1.5 px-3 rounded-full">
                                    {service.service}
                                  </p>
                                )}
                              </React.Fragment>
                            );
                          }
                        )}

                        {user.hiringDetails.otherAvailability?.length > 0 && (
                          <>
                            {user.hiringDetails.otherAvailability
                              .split(",")
                              ?.map((item: any, index: any) => {
                                return (
                                  <p
                                    className="text-sm font-medium bg-blue-800 text-blue-200 py-1.5 px-3 rounded-full"
                                    key={index}
                                  >
                                    {item}
                                  </p>
                                );
                              })}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#dadce0] py-4">
                    <div className="text-sm flex flex-col gap-2">
                      <h4>Event availability</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {user.hiringDetails.availability?.map(
                          (available: any, index: any) => {
                            return (
                              <React.Fragment key={index}>
                                {available.isAvailable && (
                                  <p className="text-sm font-medium bg-blue-800 text-blue-200 py-1.5 px-3 rounded-full">
                                    {available.availabilityName}
                                  </p>
                                )}
                              </React.Fragment>
                            );
                          }
                        )}

                        {user.hiringDetails.otherServices?.length > 0 && (
                          <>
                            {user.hiringDetails.otherServices
                              .split(",")
                              ?.map((item: any, index: any) => {
                                return (
                                  <p
                                    className="text-sm font-medium bg-blue-800 text-blue-200 py-1.5 px-3 rounded-full"
                                    key={index}
                                  >
                                    {item}
                                  </p>
                                );
                              })}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#dadce0] py-4">
                    <div className="text-sm flex justify-between gap-2">
                      <h4>Schedule and travel:</h4>
                      <p className="font-medium text-blue-100">
                        <span className="capitalize">
                          {user.hiringDetails.preferredSchedule?.type}
                        </span>
                        {" & "}
                        <span className="capitalize">
                          {user.hiringDetails.travelAvailability?.type}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 col-span-7 flex flex-col items-center">
                <div className="flex flex-col gap-3 max-w-[640px]">
                  <h2 className="text-3xl font-semibold">
                    Hire {user.userName} for your next event!
                  </h2>
                  <p>
                    Bring your favorite characters to life. From events and
                    photoshoots to promotional appearances, {user.userName}{" "}
                    offer a range of services to make your occasion
                    unforgettable.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <img
              className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              src={loading}
              alt=""
            />
          )}
        </div>
      </div>
      <UserNavigation />
    </>
  );
};

export default UserHirePage;
