import { useState } from "react";
import { marqueePeeps } from "../../utils/marqueePeeps";
import loading from "../../assets/images/loading.gif";
import { apiUrl, postFetchConfig } from "../../utils/fetchConfig";

const Home = () => {
  const [formData, setFormData] = useState<Record<string, string>>({
    email: "",
  });
  const [showFormMessage, setShowFormMessage] = useState<string>();
  const [runShimmerAnimation, setRunShimmerAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleOnLoad = () => {
    setIsLoading(false);
    setRunShimmerAnimation(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(() => ({
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `${apiUrl}/waiting_list`;
    try {
      const response = await fetch(url, postFetchConfig(formData));
      const result = await response.json();

      if (result.error) return setShowFormMessage(result.error);
      if (response.ok) return setShowFormMessage("Thank you for signing up!");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-24">
        <section className="container flex flex-col justify-center items-center gap-10">
          <div className="flex flex-col items-center gap-6">
            <h1 className="max-w-[900px] text-center text-6xl font-medium mx-auto leading-tight">
              Community Platform for Creators to Share, Sell, and Shine
            </h1>

            <p className="text-xl leading-8 text-dark text-center max-w-[580px]">
              Showcase your talent, sell unique products, and offer bespoke
              services. Flourish creatively and grow your income in our
              dedicated creator community.
            </p>
          </div>

          <form
            className="flex flex-col relative"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="flex gap-4">
              <input
                className="font-bold bg-white border-b-2 border-[#444] p-5 py-2.5 min-w-[280px]"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <button
                className="btn-chunky-primary"
                onSubmit={(e) => handleSubmit(e)}
                type="submit"
              >
                Join waitlist
              </button>
            </div>
            {showFormMessage && (
              <p className="absolute -bottom-2 translate-y-full">
                {showFormMessage}
              </p>
            )}
          </form>
        </section>
        <section>
          <div className="overflow-hidden pb-2">
            <div className="marquee-track">
              {marqueePeeps?.length ? (
                <div className="flex flex-nowrap gap-8">
                  {marqueePeeps?.map((post: any, index: number) => {
                    return (
                      <div
                        className="bg-white min-w-[270px] shadow-chunky rounded-xl p-4 flex"
                        key={index}
                      >
                        <>
                          <div className={`w-full h-auto flex flex-col`}>
                            <div className="h-full relative overflow-hidden rounded-lg">
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
                                className="object-cover w-full h-full rounded-lg aspect-[5/6]"
                                src={post.fileUrl}
                                alt=""
                                loading="lazy"
                                onLoad={handleOnLoad}
                              />
                            </div>
                          </div>
                        </>
                      </div>
                    );
                  })}

                  {marqueePeeps?.map((post: any, index: number) => {
                    return (
                      <div
                        className="bg-white min-w-[270px] shadow-chunky rounded-xl p-4 flex"
                        key={index}
                      >
                        <>
                          <div className={`w-full h-auto flex flex-col`}>
                            <div className="h-full relative overflow-hidden rounded-lg">
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
                                className="object-cover w-full h-full rounded-lg aspect-[5/6]"
                                src={post.fileUrl}
                                alt=""
                                loading="lazy"
                                onLoad={handleOnLoad}
                              />
                            </div>
                          </div>
                        </>
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
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
