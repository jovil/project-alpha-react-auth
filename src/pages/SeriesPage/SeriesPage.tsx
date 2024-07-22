import { useCallback, useEffect, useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { GlobalStateContext } from "../../context/Context";
import { useParams } from "react-router-dom";
import loading from "../../assets/images/loading.gif";
import defaultAvatar from "../../assets/images/toon_6.png";
import { getFetchConfig } from "../../utils/fetchConfig";
import GridHeader from "../../components/Grid/header";
import GridViewContainer from "../../components/Grid/gridViewContainer";

const SeriesPage = () => {
  const { seriesTitle } = useParams();
  const { state } = useContext(GlobalStateContext);
  const [seriesPosts, setSeriesPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [runShimmerAnimation, setRunShimmerAnimation] = useState(false);

  const fetchSeries = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/series/${seriesTitle}`;

    try {
      const response = await fetch(url, getFetchConfig);
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
    setRunShimmerAnimation(true);
  };

  return (
    <>
      <section className="max-w-[948px] w-full mx-auto flex flex-col gap-4">
        <GridHeader
          gridViewProp={"seriesView"}
          captionProp={"showSeriesCaption"}
        >
          <h1>
            <NavLink className="underline" to="/series">
              All series
            </NavLink>
            {" > "}
            <span className="capitalize">{seriesTitle}</span> series
          </h1>
        </GridHeader>
        <GridViewContainer
          gridComponent={"seriesView"}
          captionComponent={"showSeriesCaption"}
        >
          {seriesPosts?.length ? (
            <>
              {seriesPosts?.toReversed().map((post: any) => {
                return (
                  <div
                    className={`w-full h-auto rounded-3xl flex flex-col relative group ${
                      state.seriesView === "grid" && state.showSeriesCaption
                        ? "tablet:aspect-[3/4]"
                        : state.seriesView === "grid" &&
                          !state.showSeriesCaption
                        ? "tablet:aspect-[3/4] overflow-hidden"
                        : state.seriesView === "list" && state.showSeriesCaption
                        ? ""
                        : "overflow-hidden"
                    }`}
                    key={post._id}
                  >
                    <div className="h-full relative overflow-hidden">
                      {runShimmerAnimation && (
                        <div className="shimmer-overlay"></div>
                      )}
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
                        className={`object-cover w-full rounded-3xl ${
                          state.seriesView === "grid" && state.showSeriesCaption
                            ? "aspect-[3/4]"
                            : "aspect-[3/4]"
                        }`}
                        src={post.fileUrl}
                        alt=""
                        loading="lazy"
                        onLoad={handlePostImageLoad}
                      />
                    </div>
                    {!state.showSeriesCaption && (
                      <div className="flex flex-col flex-grow justify-between gap-2 tablet:absolute px-3 pb-3 tablet:p-3 tablet:pt-12 tablet:bottom-0 w-full tablet:bg-gradient-to-t tablet:from-dark tablet:text-white tablet:opacity-0 tablet:translate-y-2 tablet:group-hover:opacity-100 tablet:group-hover:translate-y-0 tablet:transition">
                        <p>{post.characterName}</p>

                        <div className="flex">
                          <NavLink
                            className="flex gap-1.5 items-center"
                            to={`/user/${post.user._id}`}
                          >
                            {post.user.avatar.length > 0 ? (
                              <img
                                className="rounded-full w-6 h-6 border border-dark/10"
                                src={post.user.avatar}
                                alt=""
                              />
                            ) : (
                              <img
                                className="rounded-full w-6 h-6 border border-dark/10"
                                src={defaultAvatar}
                                alt=""
                              />
                            )}
                            <p className="text-xs underline">
                              @{post.user.userName}
                            </p>
                          </NavLink>
                        </div>
                      </div>
                    )}

                    {state.showSeriesCaption && (
                      <div className="flex flex-col flex-grow justify-between gap-2 px-3 pb-3 tablet:py-6 w-full">
                        <p>{post.characterName}</p>

                        <div className="flex">
                          <NavLink
                            className="flex gap-1.5 items-center"
                            to={`/user/${post.user._id}`}
                          >
                            {post.user.avatar.length > 0 ? (
                              <img
                                className="rounded-full w-6 h-6 border border-dark/10"
                                src={post.user.avatar}
                                alt=""
                              />
                            ) : (
                              <img
                                className="rounded-full w-6 h-6 border border-dark/10"
                                src={defaultAvatar}
                                alt=""
                              />
                            )}
                            <p className="text-xs underline">
                              @{post.user.userName}
                            </p>
                          </NavLink>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <></>
          )}
        </GridViewContainer>
      </section>
    </>
  );
};

export default SeriesPage;
