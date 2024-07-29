import { useState, useContext } from "react";
import { GlobalStateContext } from "../../context/Context";
import loading from "../../assets/images/loading.gif";

const Card = ({
  gridComponent,
  captionComponent,
  data,
}: {
  gridComponent?: string | null;
  captionComponent?: string | null;
  data: Record<string, any>;
}) => {
  const { state } = useContext(GlobalStateContext);
  const [isLoading, setIsLoading] = useState(true);
  const [runShimmerAnimation, setRunShimmerAnimation] = useState(false);

  const handleOnLoad = () => {
    setIsLoading(false);
    setRunShimmerAnimation(true);
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
        <div className="h-full relative overflow-hidden rounded-3xl">
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
              className={`object-cover w-full h-full rounded-3xl group-hover:scale-[1.03] transition-transform ${
                state[gridComponent ? gridComponent : ""] === "grid" &&
                state[captionComponent ? captionComponent : ""]
                  ? "aspect-[4/6]"
                  : ""
              }`}
              src={data.fileUrl}
              alt=""
              loading="lazy"
              onLoad={handleOnLoad}
            />
          )}
          {typeof data.fileUrl === "object" && (
            <img
              className={`object-cover w-full h-full rounded-3xl group-hover:scale-[1.03] transition-transform ${
                state[gridComponent ? gridComponent : ""] === "grid" &&
                state[captionComponent ? captionComponent : ""]
                  ? "aspect-[4/6]"
                  : ""
              }`}
              src={data.fileUrl[data.fileUrl.length - 1]}
              alt=""
              loading="lazy"
              onLoad={handleOnLoad}
            />
          )}
          {data.avatar && (
            <img
              className={`object-cover w-full h-full rounded-3xl group-hover:scale-[1.03] transition-transform ${
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
    </>
  );
};

export default Card;
