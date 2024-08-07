import { useState } from "react";
import { marqueePeeps } from "../../utils/marqueePeeps";
import loading from "../../assets/images/loading.gif";

const Home = () => {
  const [runShimmerAnimation, setRunShimmerAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleOnLoad = () => {
    setIsLoading(false);
    setRunShimmerAnimation(true);
  };

  return (
    <>
      <div className="flex flex-col gap-32">
        <section className="container">
          <h1 className="max-w-[800px] text-center text-5xl font-medium mx-auto leading-tight">
            Community Platform for Creators to Share, Sell, and Shine
          </h1>
        </section>
        <section>
          <div className="marquee-track">
            {marqueePeeps?.length ? (
              <div className="flex flex-nowrap gap-8 overflow-hidden">
                {marqueePeeps?.map((post: any, index: number) => {
                  return (
                    <div
                      className="min-w-[270px] flex flex-col relative overflow-hidden rounded-3xl"
                      key={index}
                    >
                      <div className="relative">
                        <>
                          <div className={`w-full h-auto flex flex-col`}>
                            <div className="h-full relative overflow-hidden rounded-3xl">
                              {runShimmerAnimation && (
                                <div className="shimmer-overlay"></div>
                              )}
                              {isLoading && (
                                <img
                                  className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0"
                                  src={loading}
                                  alt=""
                                />
                              )}

                              <img
                                className="object-cover w-full h-full rounded-3xl aspect-[5/6]"
                                src={post.fileUrl}
                                alt=""
                                loading="lazy"
                                onLoad={handleOnLoad}
                              />
                            </div>
                          </div>
                        </>
                      </div>
                    </div>
                  );
                })}

                {marqueePeeps?.map((post: any, index: number) => {
                  return (
                    <div
                      className="min-w-[270px] flex flex-col relative overflow-hidden rounded-3xl"
                      key={index}
                    >
                      <div className="relative">
                        <>
                          <div className={`w-full h-auto flex flex-col`}>
                            <div className="h-full relative overflow-hidden rounded-3xl">
                              {runShimmerAnimation && (
                                <div className="shimmer-overlay"></div>
                              )}
                              {isLoading && (
                                <img
                                  className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0"
                                  src={loading}
                                  alt=""
                                />
                              )}

                              <img
                                className="object-cover w-full h-full rounded-3xl aspect-[5/6]"
                                src={post.fileUrl}
                                alt=""
                                loading="lazy"
                                onLoad={handleOnLoad}
                              />
                            </div>
                          </div>
                        </>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <img
                className="w-6 h-6 absolute inset-1/2 -translate-x-1/2 -translate-y-1/2"
                src={loading}
                alt=""
              />
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
