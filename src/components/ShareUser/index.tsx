import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Backdrop from "../../components/Backdrop";
import { slideInFromBottom } from "../../utils/animations";
import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.css";

const ShareUser = ({ title }: { title: string }) => {
  const location = useLocation();
  const [showShareModal, setShowShareModal] = useState(false);
  const profileUrlRef = useRef<any>(null);

  const handleShareModal = () => {
    setShowShareModal((prevState: boolean) => !prevState);
  };

  const copyToClipBoard = () => {
    (profileUrlRef.current as HTMLInputElement).select();
    profileUrlRef.current.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(profileUrlRef.current.value);

    new Notify({
      title: "Link copied!",
    });
  };
  return (
    <>
      <button className="btn-chunky text-xs" onClick={handleShareModal}>
        {title}
      </button>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showShareModal && (
          <Backdrop onClick={handleShareModal} showCloseButton={true}>
            <motion.div
              className="h-full w-full flex justify-center items-center pointer-events-none"
              variants={slideInFromBottom}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="min-w-[400px] bg-white p-4 rounded-md flex cursor-default pointer-events-auto">
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex flex-col gap-1">
                    <p className="subtitle">{title}</p>
                    <p className="text-grey">
                      Copy the link and share it on social media.
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      className="border-2 border-[#444] p-3 rounded w-full"
                      ref={profileUrlRef}
                      value={`${window.location.origin}${location.pathname}`}
                      type="text"
                      disabled
                    />
                    <button
                      className="font-bold text-sm btn-primary rounded-lg absolute top-1/2 -translate-y-1/2 right-1"
                      onClick={copyToClipBoard}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </Backdrop>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareUser;
