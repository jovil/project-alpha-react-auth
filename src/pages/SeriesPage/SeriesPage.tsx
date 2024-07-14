import { useCallback, useEffect, useContext, useState } from "react";
import { GlobalStateContext } from "../../context/Context";
import { useParams } from "react-router-dom";
import iconGrid from "../../assets/images/icon-grid.svg";
import iconList from "../../assets/images/icon-list.svg";
import loading from "../../assets/images/loading.gif";

const SeriesPage = () => {
  const { seriesTitle } = useParams();
  const { state, setState } = useContext(GlobalStateContext);
  const [seriesPosts, setSeriesPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSeries = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/series/${seriesTitle}`;
    const configuration = {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
    };

    try {
      const response = await fetch(url, configuration);
      const result = await response.json();
      setSeriesPosts(result);
      console.log("result", result);
    } catch (error) {
      console.log("error", error);
    }
  }, [seriesTitle]);

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  const handlePostImageLoad = () => {
    setIsLoading(false);
  };

  const handleGridView = () => {
    setState({ ...state, seriesView: "grid" });
  };

  const handleListView = () => {
    setState({ ...state, seriesView: "list" });
  };

  return (
    <>
      <section className="max-w-[908px] w-full mx-auto flex flex-col gap-4">
        <header className="flex justify-end items-center gap-2">
          <button>
            <img
              className={`w-7 h-7 p-1.5 rounded-full ${
                state.seriesView === "list" ? "bg-dark/10" : ""
              }`}
              src={iconList}
              onClick={handleListView}
              alt=""
            />
          </button>
          <button>
            <img
              className={`w-7 h-7 p-1.5 rounded-full ${
                state.seriesView === "grid" ? "bg-dark/10" : ""
              }`}
              src={iconGrid}
              onClick={handleGridView}
              alt=""
            />
          </button>
        </header>
        <div
          className={`grid gap-1 ${
            state.seriesView === "grid" ? "grid-cols-3" : ""
          }`}
        >
          {seriesPosts?.length ? (
            <>
              {seriesPosts?.toReversed().map((post: any) => {
                return (
                  <div
                    className={`w-full h-auto border border-dark/80 shadow-md rounded p-4 pb-3 flex flex-col gap-3 ${
                      state.seriesView === "grid" ? "max-w-[300px]" : ""
                    }`}
                    key={post._id}
                  >
                    <div className="relative aspect-square">
                      <img
                        className={
                          isLoading
                            ? `w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0`
                            : "hidden"
                        }
                        src={isLoading ? loading : ""}
                        alt=""
                      />
                      <img
                        className="aspect-square object-cover w-full rounded-sm"
                        src={post.fileUrl}
                        alt=""
                        loading="lazy"
                        onLoad={handlePostImageLoad}
                      />
                    </div>
                    <div className="flex flex-col flex-grow justify-between gap-6">
                      <p className="text-sm">{post.characterName}</p>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <></>
          )}
        </div>
      </section>
    </>
  );
};

export default SeriesPage;
