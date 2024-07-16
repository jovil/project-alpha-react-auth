import { useEffect } from "react";
import loading from "../../assets/images/loading.gif";
import Backdrop from "../../components/Backdrop";
import { motion } from "framer-motion";

const HiringModal = ({
  isUser,
  onToggleModal,
  showHiringModal,
}: {
  isUser: any;
  onToggleModal: any;
  showHiringModal: boolean;
}) => {
  const { hiringDetails } = isUser;
  const { favoriteCharacters } = hiringDetails;

  const favCharactersArr = favoriteCharacters.split(",");

  useEffect(() => {
    console.log("showHiringModal", showHiringModal);
  }, [showHiringModal]);

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
                      Hire {isUser.userName} to bring your favorite characters
                      to life. From events and photoshoots to promotional
                      appearances, our cosplayers offer a range of services to
                      make your occasion unforgettable.
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
                  <div className="bg-dark text-white rounded-md h-full p-4 grid row-auto gap-4">
                    <div className="grid grid-cols-12 bg-[#3d3c3c] rounded-md p-4">
                      <div className="col-span-2"></div>
                      <div className="col-span-10">
                        <h4 className="font-medium">Based in</h4>
                        <p>{hiringDetails.location}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 bg-[#3d3c3c] rounded-md p-4">
                      <div className="col-span-2"></div>
                      <div className="col-span-10">
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

                    <div className="grid grid-cols-12 bg-[#3d3c3c] rounded-md p-4">
                      <div className="col-span-2"></div>
                      <div className="col-span-10">
                        <h4 className="font-medium">Services</h4>
                        {hiringDetails.services.costumeMaking && (
                          <label className="flex items-center gap-2">
                            <input
                              className="border border-dark/40 p-3 rounded"
                              type="checkbox"
                              name="costumeMaking"
                              checked={true}
                              disabled
                            />
                            Costume making
                          </label>
                        )}
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
