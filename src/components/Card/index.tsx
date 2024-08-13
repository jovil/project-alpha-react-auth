import { useState, useContext, useRef, useEffect } from "react";
import { GlobalStateContext } from "../../context/Context";
import { useUser } from "../../context/UserContext";
import loading from "../../assets/images/loading.gif";
import { apiUrl, deleteFetchConfig } from "../../utils/fetchConfig";
import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.css";
import Backdrop from "../Backdrop";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "../../utils/animations";

const Card = ({
  gridComponent,
  captionComponent,
  data,
  isShowSettings = false,
}: {
  gridComponent?: string | null;
  captionComponent?: string | null;
  data: Record<string, any>;
  isShowSettings?: boolean;
}) => {
  const settingsDropdownRef = useRef<any>(null);
  const { state } = useContext(GlobalStateContext);
  const { userState } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [runShimmerAnimation, setRunShimmerAnimation] = useState(false);
  const [showSettings] = useState<boolean>(isShowSettings || false);
  const [showSettingsDropdown, setShowSettingsDropdown] =
    useState<boolean>(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);
  const [postElement, setPostElement] = useState<Element | null>(null);
  const [postId, setPostId] = useState<string>("");
  const [postFileUrl, setPostFileUrl] = useState<string>("");

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      settingsDropdownRef.current &&
      !settingsDropdownRef.current?.contains(e.target as Node)
    ) {
      setShowSettingsDropdown(false);
    }
  };

  const handleOnLoad = () => {
    setIsLoading(false);
    setRunShimmerAnimation(true);
  };

  const handleSettingsClick = () => {
    setShowSettingsDropdown((prevState: boolean) => !prevState);
  };

  const handleConfirmationModal = (
    e: React.MouseEvent<HTMLElement>,
    postId: string,
    fileUrl: string
  ) => {
    const target = e.target;
    const post = (target as HTMLElement).closest("[data-item]");

    setPostId(postId);
    setPostElement(post);
    setPostFileUrl(fileUrl);
    setShowDeleteConfirmationModal(true);
  };

  const deletePost = async () => {
    const url = `${apiUrl}/posts/delete/${postId}?fileUrl=${postFileUrl}`;

    try {
      await fetch(url, deleteFetchConfig);
      postElement?.remove();
      new Notify({
        title: "Post deleted successfully",
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div
        className={`w-full h-auto flex flex-col ${
          state[gridComponent ? gridComponent : ""] === "grid" &&
          !state[captionComponent ? captionComponent : ""]
            ? "tablet:aspect-[4/6]"
            : ""
        }`}
        key={data._id}
      >
        <div className="h-full relative overflow-hidden rounded-xl group/settingsIcon">
          {showSettings && (
            <>
              {data.user._id === userState._id && (
                <div ref={settingsDropdownRef}>
                  <button
                    className="absolute top-2 left-2 z-10 text-white bg-[#1d1d1fcc] w-[30px] h-[30px] p-1 rounded-full flex justify-center items-center opacity-0 group-hover/settingsIcon:opacity-100 transition-opacity"
                    onClick={handleSettingsClick}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.99563 16C9.58188 16 9.22917 15.8527 8.9375 15.5581C8.64583 15.2635 8.5 14.9094 8.5 14.4956C8.5 14.0819 8.64729 13.7292 8.94187 13.4375C9.23646 13.1458 9.59062 13 10.0044 13C10.4181 13 10.7708 13.1473 11.0625 13.4419C11.3542 13.7365 11.5 14.0906 11.5 14.5044C11.5 14.9181 11.3527 15.2708 11.0581 15.5625C10.7635 15.8542 10.4094 16 9.99563 16ZM9.99563 11.5C9.58188 11.5 9.22917 11.3527 8.9375 11.0581C8.64583 10.7635 8.5 10.4094 8.5 9.99563C8.5 9.58188 8.64729 9.22917 8.94187 8.9375C9.23646 8.64583 9.59062 8.5 10.0044 8.5C10.4181 8.5 10.7708 8.64729 11.0625 8.94188C11.3542 9.23646 11.5 9.59062 11.5 10.0044C11.5 10.4181 11.3527 10.7708 11.0581 11.0625C10.7635 11.3542 10.4094 11.5 9.99563 11.5ZM9.99563 7C9.58188 7 9.22917 6.85271 8.9375 6.55812C8.64583 6.26354 8.5 5.90937 8.5 5.49562C8.5 5.08187 8.64729 4.72917 8.94187 4.4375C9.23646 4.14583 9.59062 4 10.0044 4C10.4181 4 10.7708 4.14729 11.0625 4.44188C11.3542 4.73646 11.5 5.09063 11.5 5.50438C11.5 5.91813 11.3527 6.27083 11.0581 6.5625C10.7635 6.85417 10.4094 7 9.99563 7Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>

                  {showSettingsDropdown && (
                    <ul className="min-w-24 p-1.5 bg-white shadow-nav rounded-md absolute top-[38px] left-2 translate-y-3 flex flex-col gap-1 z-10">
                      <li>
                        <button
                          className="text-sm font-medium text-left px-4 py-3 rounded-md hover:bg-red whitespace-nowrap w-full"
                          onClick={(e) =>
                            handleConfirmationModal(e, data._id, data.fileUrl)
                          }
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </>
          )}
          {runShimmerAnimation && <div className="shimmer-overlay"></div>}
          {isLoading && (
            <img
              className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0"
              src={loading}
              alt=""
            />
          )}
          {typeof data.fileUrl === "string" && (
            <img
              className={`object-cover w-full h-full rounded-lg group-hover:scale-[1.03] transition-transform aspect-[4/6]`}
              src={data.fileUrl}
              alt=""
              loading="lazy"
              onLoad={handleOnLoad}
            />
          )}
          {data.avatar && (
            <img
              className={`object-cover w-full h-full rounded-lg group-hover:scale-[1.03] transition-transform ${
                state[gridComponent ? gridComponent : ""] === "grid" &&
                state[captionComponent ? captionComponent : ""]
                  ? "aspect-[4/6]"
                  : ""
              }`}
              src={data.avatar}
              alt=""
              loading="lazy"
              onLoad={handleOnLoad}
            />
          )}
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showDeleteConfirmationModal && (
          <Backdrop
            onClick={() => setShowDeleteConfirmationModal(false)}
            showCloseButton={false}
          >
            <motion.div
              className="bg-white rounded-md p-10 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 max-w-[400px] w-full flex flex-col justify-center items-center gap-6 aspect-3/4 shadow-md"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-bold text-xl">Are you sure?</h2>
              <div className="flex gap-4">
                <button className="btn-chunky-danger" onClick={deletePost}>
                  Delete post
                </button>

                <button
                  className="btn-chunky border-grey-100 shadow-none text-blue-100 hover:bg-blue-900 hover:text-blue-100"
                  onClick={() => setShowDeleteConfirmationModal(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </Backdrop>
        )}
      </AnimatePresence>
    </>
  );
};

export default Card;
