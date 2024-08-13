import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import HiringModal from "../../components/HiringModal";
import loading from "../../assets/images/loading.gif";
import defaultAvatar from "../../assets/images/toon_6.png";

const TalentCard = ({
  talent,
}: {
  gridComponent?: string | null;
  captionComponent?: string | null;
  talent: Record<string, any>;
  isShowSettings?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [runShimmerAnimation, setRunShimmerAnimation] = useState(false);
  const [showHiringModal, setShowHiringModal] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const handleOnLoad = () => {
    setIsLoading(false);
    setRunShimmerAnimation(true);
  };

  const handleToggleModal = (id: any) => {
    setShowHiringModal((prevState) => !prevState);
    setCurrentUserId(id);
    document.body.style.overflow = !showHiringModal ? "hidden" : "auto";
  };

  return (
    <>
      <div
        className="flex flex-col gap-4 relative overflow-hidden cursor-pointer shadow-chunky rounded-xl p-4"
        onClick={() => handleToggleModal(talent._id)}
      >
        <div className="w-full flex flex-col" key={talent._id}>
          <div className="relative overflow-hidden">
            {runShimmerAnimation && <div className="shimmer-overlay"></div>}
            {isLoading && (
              <img
                className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0"
                src={loading}
                alt=""
              />
            )}
            <img
              className="object-cover w-full transition-transform aspect-square rounded-lg"
              src={talent.avatar || defaultAvatar}
              alt=""
              loading="lazy"
              onLoad={handleOnLoad}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="bg-white/90 flex flex-col justify-between gap-1">
            <p className="font-bold">{talent.userName}</p>
            <p className="text-grey">{talent.talentProfile.role}</p>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showHiringModal && currentUserId === talent._id && (
          <HiringModal userId={talent._id} onToggleModal={handleToggleModal} />
        )}
      </AnimatePresence>
    </>
  );
};

export default TalentCard;
