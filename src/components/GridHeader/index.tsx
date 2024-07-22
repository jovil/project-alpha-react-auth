import { useContext } from "react";
import { GlobalStateContext } from "../../context/Context";
import iconGrid from "../../assets/images/icon-grid.svg";
import iconList from "../../assets/images/icon-list.svg";

const GridHeader = ({
  children,
  gridViewProp,
  captionProp,
}: {
  children: any;
  gridViewProp: string;
  captionProp: string;
}) => {
  const { state, setState } = useContext(GlobalStateContext);

  const handleGridView = (gridViewProp: string) => {
    setState((prev: any) => {
      return {
        ...prev,
        [gridViewProp]: "grid",
      };
    });
  };

  const handleListView = (gridViewProp: string) => {
    setState((prev: any) => {
      return {
        ...prev,
        [gridViewProp]: "list",
      };
    });
  };

  const handleCaption = (captionProp: string) => {
    setState((prev: any) => {
      return {
        ...prev,
        [captionProp]: !prev[captionProp],
      };
    });
  };

  return (
    <>
      <header className="hidden tablet:flex justify-between items-center gap-2">
        {children}
        <div className="flex justify-end items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-xs">Show caption</p>
            <button
              className={`toggle-btn ${state[captionProp] ? "toggled" : ""}`}
              onClick={() => handleCaption(captionProp)}
            >
              <div className="thumb"></div>
            </button>
          </div>
          <div className="flex">
            <button>
              <img
                className={`w-7 h-7 p-1.5 rounded-full ${
                  state[gridViewProp] === "list" ? "bg-dark/10" : ""
                }`}
                src={iconList}
                onClick={() => handleListView(gridViewProp)}
                alt=""
              />
            </button>
            <button>
              <img
                className={`w-7 h-7 p-1.5 rounded-full ${
                  state[gridViewProp] === "grid" ? "bg-dark/10" : ""
                }`}
                src={iconGrid}
                onClick={() => handleGridView(gridViewProp)}
                alt=""
              />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default GridHeader;
