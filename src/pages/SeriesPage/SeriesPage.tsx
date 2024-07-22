import { useCallback, useEffect, useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { GlobalStateContext } from "../../context/Context";
import { useParams } from "react-router-dom";
import { getFetchConfig } from "../../utils/fetchConfig";
import GridHeader from "../../components/Grid/header";
import GridViewContainer from "../../components/Grid/gridViewContainer";
import UserAvatar from "../../components/Card/userAvatar";
import Card from "../../components/Card";

const SeriesPage = () => {
  const { seriesTitle } = useParams();
  const { state } = useContext(GlobalStateContext);
  const [seriesPosts, setSeriesPosts] = useState([]);

  const fetchSeries = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/series/${seriesTitle}`;

    try {
      const response = await fetch(url, getFetchConfig);
      const result = await response.json();
      setSeriesPosts(result);
    } catch (error) {
      console.log("error", error);
    }
  }, [seriesTitle]);

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

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
              {seriesPosts?.toReversed().map((post: any, index: number) => {
                return (
                  <div
                    className="flex flex-col relative group overflow-hidden rounded-3xl"
                    key={index}
                  >
                    <Card
                      gridComponent={"seriesView"}
                      captionComponent={"showSeriesCaption"}
                      data={post}
                    />
                    {!state.showSeriesCaption && (
                      <div className="flex flex-col flex-grow justify-between gap-4 tablet:absolute px-3 pb-3 tablet:p-3 tablet:pt-12 tablet:bottom-0 w-full tablet:bg-gradient-to-t tablet:from-dark tablet:text-white tablet:opacity-0 tablet:translate-y-2 tablet:group-hover:opacity-100 tablet:group-hover:translate-y-0 tablet:transition">
                        <p>{post.characterName}</p>
                        <UserAvatar data={post} />
                      </div>
                    )}

                    {state.showSeriesCaption && (
                      <div className="flex flex-col flex-grow justify-between gap-4 px-3 pb-3 tablet:py-6 w-full">
                        <p>{post.characterName}</p>
                        <UserAvatar data={post} />
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
