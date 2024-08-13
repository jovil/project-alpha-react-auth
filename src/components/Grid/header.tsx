import { useContext } from "react";
import { GlobalStateContext } from "../../context/Context";

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
            <p className="text-sm">Show caption</p>
            <button
              className={`toggle-btn ${state[captionProp] ? "toggled" : ""}`}
              onClick={() => handleCaption(captionProp)}
            >
              <div className="thumb"></div>
            </button>
          </div>
          <div className="flex gap-1">
            <button
              className={`rounded-full ${
                state[gridViewProp] === "list" ? "bg-dark/10" : ""
              }`}
            >
              <svg
                className={`w-8 h-8 p-1.5`}
                onClick={() => handleListView(gridViewProp)}
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.5 20.5L3.5 13.5L20.5 13.5V20.5H3.5Z"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.5 10.5L3.5 3.5L20.5 3.5V10.5L3.5 10.5Z"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className={`rounded-full ${
                state[gridViewProp] === "grid" ? "bg-dark/10" : ""
              }`}
            >
              <svg
                className={`w-8 h-8 p-1.5`}
                onClick={() => handleGridView(gridViewProp)}
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.5 3.5H10.5V10.5H3.5V3.5Z"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.5 13.5H10.5V20.5H3.5V13.5Z"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.5 3.5H20.5V10.5H13.5V3.5Z"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.5 13.5H20.5V20.5H13.5V13.5Z"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default GridHeader;
