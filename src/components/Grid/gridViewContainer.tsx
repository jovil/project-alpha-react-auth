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
        className={`grid gap-3 ${
          state[gridComponent] === "grid"
            ? "tablet:grid-cols-2 desktop:grid-cols-3"
            : ""
        } ${state[captionComponent] ? "gap-y-9" : ""}`}
      >
        {children}
      </div>
    </>
  );
};

export default GridViewContainer;
