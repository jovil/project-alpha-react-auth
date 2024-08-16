import { useContext } from "react";
import { GlobalStateContext } from "../../context/Context";

const GridViewContainer = ({
  gridComponent,
  captionComponent,
  children,
}: {
  gridComponent?: any;
  captionComponent?: any;
  children: any;
}) => {
  const { state } = useContext(GlobalStateContext);

  return (
    <>
      <div
        className={`grid ${
          state[gridComponent] === "grid"
            ? "grid-cols-2 gap-4 desktop:grid-cols-3 desktop:gap-6"
            : "gap-y-9"
        } ${state[captionComponent] ? "gap-y-9" : ""}`}
      >
        {children}
      </div>
    </>
  );
};

export default GridViewContainer;
