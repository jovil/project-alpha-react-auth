import React from "react";
import loading from "../assets/images/loading.gif";
import Backdrop from "./Backdrop";
import { motion } from "framer-motion";
import { slideInFromBottom } from "../utils/animations";

const HiringModal = ({
  isUser,
  onToggleModal,
}: {
  isUser: any;
  onToggleModal: any;
}) => {
  const { hiringDetails } = isUser;
  const { favoriteCharacters } = hiringDetails;
  const favCharactersArr = favoriteCharacters?.split(",");
  const { otherServices } = hiringDetails;
  const otherServicesArr = otherServices?.split(",");
  const { otherAvailability } = hiringDetails;
  const otherAvailabilityArr = otherAvailability?.split(",");

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
            <div className="min-h-[calc(100vh-48px)] mt-12 p-4 bg-white rounded flex flex-col gap-3 relative pointer-events-auto cursor-default">
              {isUser ? (
                <div className="max-w-[1140px] mx-auto grid grid-cols-12 gap-4 h-full flex-grow">
                  <div className="flex items-center p-4 col-span-5">
                    <div className="bg-white flex flex-col w-full p-10 rounded-3xl">
                      <div className="border-[#dadce0] py-4">
                        <div className="text-sm flex justify-between gap-2">
                          <h4>Location:</h4>
                          <p className="font-medium text-blue-100">
                            {hiringDetails.location}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-[#dadce0] py-4">
                        <div className="text-sm flex justify-between gap-2">
                          <h4>Favorite characters:</h4>
                          <div className="flex gap-1">
                            {favCharactersArr?.map(
                              (favChar: any, index: any) => {
                                return (
                                  <p
                                    className="font-medium text-blue-100"
                                    key={index}
                                  >
                                    {favChar}
                                    <>
                                      {index !==
                                        favCharactersArr.length - 1 && <>,</>}
                                    </>
                                  </p>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[#dadce0] py-4">
                        <div className="text-sm flex flex-col gap-2">
                          <h4>Skills and services:</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {hiringDetails?.services.map(
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

                            {otherAvailability.length > 0 && (
                              <>
                                {otherAvailabilityArr?.map(
                                  (item: any, index: any) => {
                                    return (
                                      <p
                                        className="text-sm font-medium bg-blue-800 text-blue-200 py-1.5 px-3 rounded-full"
                                        key={index}
                                      >
                                        {item}
                                      </p>
                                    );
                                  }
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[#dadce0] py-4">
                        <div className="text-sm flex flex-col gap-2">
                          <h4>Event availability</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {hiringDetails.availability?.map(
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

                            {otherServices.length > 0 && (
                              <>
                                {otherServicesArr?.map(
                                  (item: any, index: any) => {
                                    return (
                                      <p
                                        className="text-sm font-medium bg-blue-800 text-blue-200 py-1.5 px-3 rounded-full"
                                        key={index}
                                      >
                                        {item}
                                      </p>
                                    );
                                  }
                                )}
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
                              {hiringDetails.preferredSchedule?.type}
                            </span>
                            {" & "}
                            <span className="capitalize">
                              {hiringDetails.travelAvailability?.type}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-8 col-span-7 flex flex-col justify-center items-center">
                    <div className="flex flex-col gap-3 max-w-[640px]">
                      <h2 className="text-3xl font-semibold">
                        Hire {isUser.userName} for your next event!
                      </h2>
                      <p>
                        Bring your favorite characters to life. From events and
                        photoshoots to promotional appearances,{" "}
                        {isUser.userName} offer a range of services to make your
                        occasion unforgettable.
                      </p>
                      <div className="mt-3">
                        <a
                          className="btn-outline-dark inline-block"
                          href={`mailto:${hiringDetails.email}`}
                        >
                          Contact @{isUser.userName}
                        </a>
                      </div>
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
        </motion.div>
      </Backdrop>
    </>
  );
};

export default HiringModal;
