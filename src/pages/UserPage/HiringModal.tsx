import React from "react";
import loading from "../../assets/images/loading.gif";
import Backdrop from "../../components/Backdrop";
import { motion } from "framer-motion";

const HiringModal = ({
  isUser,
  onToggleModal,
}: {
  isUser: any;
  onToggleModal: any;
}) => {
  const { hiringDetails } = isUser;
  const { favoriteCharacters } = hiringDetails;
  const favCharactersArr = favoriteCharacters.split(",");
  const { otherServices } = hiringDetails;
  const otherServicesArr = otherServices.split(",");
  const { otherAvailability } = hiringDetails;
  const otherAvailabilityArr = otherAvailability.split(",");

  const slideIn = {
    hidden: {
      opacity: 0,
      y: "50px",
    },
    visible: {
      opacity: 1,
      y: "0",
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: "50px",
    },
  };

  return (
    <>
      <Backdrop onClick={onToggleModal}>
        <motion.div
          variants={slideIn}
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
                <div className="grid grid-cols-2 gap-4 h-full flex-grow">
                  <div className="flex flex-col justify-center gap-3 px-12">
                    <h2 className="text-3xl font-semibold">
                      Hire {isUser.userName} for your next event!
                    </h2>
                    <p>
                      Bring your favorite characters to life. From events and
                      photoshoots to promotional appearances, {isUser.userName}{" "}
                      offer a range of services to make your occasion
                      unforgettable.
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
                  <div className="bg-[#101010] text-white rounded-md h-full p-4 grid auto-rows-fr gap-4">
                    <div className="bg-[#303030] border border-[#4b4b4b] rounded-md p-4">
                      <div className="flex flex-col gap-1">
                        <h4 className="font-medium">Location</h4>
                        <p>{hiringDetails.location}</p>
                      </div>
                    </div>

                    <div className="bg-[#303030] border border-[#4b4b4b] rounded-md p-4">
                      <div className="flex flex-col gap-1">
                        <h4 className="font-medium">Favorite characters</h4>
                        <div className="flex gap-1">
                          {favCharactersArr.map((favChar: any, index: any) => {
                            return (
                              <p key={index}>
                                {favChar}
                                <>
                                  {index !== favCharactersArr.length - 1 && (
                                    <>,</>
                                  )}
                                </>
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#303030] border border-[#4b4b4b] rounded-md p-4">
                      <div className="flex flex-col gap-1">
                        <h4 className="font-medium">Skills and services</h4>
                        <div className="grid grid-cols-2 gap-1">
                          {hiringDetails.services.map(
                            (service: any, index: any) => {
                              return (
                                <React.Fragment key={index}>
                                  {service.serviceAvailable && (
                                    <label className="flex items-center gap-2">
                                      <input
                                        className="border border-dark/40 p-3 rounded"
                                        type="checkbox"
                                        name={service.service}
                                        checked={service.serviceAvailable}
                                        disabled={service.serviceAvailable}
                                      />
                                      {service.service}
                                    </label>
                                  )}
                                </React.Fragment>
                              );
                            }
                          )}

                          {otherAvailabilityArr.map((item: any, index: any) => {
                            return (
                              <label
                                className="flex items-center gap-2"
                                key={index}
                              >
                                <input
                                  className="border border-dark/40 p-3 rounded"
                                  type="checkbox"
                                  name={item}
                                  checked={true}
                                  disabled={true}
                                />
                                {item}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#303030] border border-[#4b4b4b] rounded-md p-4">
                      <div className="flex flex-col gap-1">
                        <h4 className="font-medium">Event availability</h4>
                        <div className="grid grid-cols-2 gap-1">
                          {hiringDetails.availability.map(
                            (available: any, index: any) => {
                              return (
                                <React.Fragment key={index}>
                                  {available.isAvailable && (
                                    <label className="flex items-center gap-2">
                                      <input
                                        className="border border-dark/40 p-3 rounded"
                                        type="checkbox"
                                        name={available.availabilityName}
                                        checked={available.isAvailable}
                                        disabled={available.isAvailable}
                                      />
                                      {available.availabilityName}
                                    </label>
                                  )}
                                </React.Fragment>
                              );
                            }
                          )}

                          {otherServicesArr.map((item: any, index: any) => {
                            return (
                              <label
                                className="flex items-center gap-2"
                                key={index}
                              >
                                <input
                                  className="border border-dark/40 p-3 rounded"
                                  type="checkbox"
                                  name={item}
                                  checked={true}
                                  disabled={true}
                                />
                                {item}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#303030] border border-[#4b4b4b] rounded-md p-4">
                      <div className="flex flex-col gap-1">
                        <h4 className="font-medium">Schedule and travel</h4>
                        <p>
                          <span className="capitalize">
                            {hiringDetails.preferredSchedule.type}
                          </span>
                          {" & "}
                          <span className="capitalize">
                            {hiringDetails.travelAvailability.type}
                          </span>
                        </p>
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
