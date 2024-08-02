import { useCallback, useEffect, useState, useContext, useRef } from "react";
import { GlobalStateContext } from "../../context/Context";
import { usePosts } from "../../context/PostsContext";
import { NavLink } from "react-router-dom";
import loading from "../../assets/images/loading.gif";
import end from "../../assets/images/end.png";
import { getFetchConfig } from "../../utils/fetchConfig";
import GridHeader from "../../components/Grid/header";
import GridViewContainer from "../../components/Grid/gridViewContainer";
import UserAvatar from "../../components/Card/userAvatar";
import Card from "../../components/Card";
import { motion, AnimatePresence } from "framer-motion";
import Backdrop from "../../components/Backdrop";
import { slideInFromBottom } from "../../utils/animations";

const PostListView = () => {
  const { state } = useContext(GlobalStateContext);
  const { allPosts, setAllPosts } = usePosts();
  const [noPosts, setNoPosts] = useState(false);
  const [page, setPage] = useState(1);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postModalImageSrc, setPostModalImageSrc] = useState<string>("");
  const limit = 9;
  const url = `${process.env.REACT_APP_API_URL}/posts?page=${page}&limit=${limit}`;
  const isFetchingRef = useRef(false); // To keep track of fetching state
  const observerRef = useRef<IntersectionObserver | null>(null); // To store the observer instance
  const postsRef = useRef(limit);

  const fetchPosts = useCallback(async () => {
    if (isFetchingRef.current) return; // Prevent fetching if already in progress
    isFetchingRef.current = true; // Set fetching state to true

    // Return if there are no more posts to fetch
    if (postsRef.current < limit) return;

    try {
      const response = await fetch(url, getFetchConfig);
      const result = await response.json();
      postsRef.current = result.length;
      // Show no posts when no posts on initial load
      if (result.length === 0) setNoPosts(true);

      setAllPosts((prevPosts: any) => {
        // Filter out any posts that already exist in the state
        const uniquePosts = result.filter(
          (fetchedPost: any) =>
            !prevPosts.some((prevPost: any) => prevPost._id === fetchedPost._id)
        );
        return [...prevPosts, ...uniquePosts];
      });
    } catch (error) {
      console.log("error creating post", error);
    } finally {
      isFetchingRef.current = false; // Reset fetching state after fetch is completed
    }
  }, [url, setAllPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const handleIntersect = (entries: any) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting && !isFetchingRef.current) {
          loadMorePosts();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: null, // Use the viewport as the root
      rootMargin: "0px", // No margin around the root
      threshold: 0.1, // 10% of the target's visibility triggers the callback
    });
    observerRef.current = observer;

    const footerElement = document.querySelector("[data-site-footer]");

    // Check if the element exists and observe it
    if (footerElement) {
      observer.observe(footerElement);
    }

    // Cleanup observer on component unmount
    return () => {
      if (observerRef.current && footerElement) {
        observer.unobserve(footerElement);
      }
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = showPostModal ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPostModal]);

  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const togglePostModal = (e: React.MouseEvent<HTMLElement>) => {
    const image = e.target as HTMLImageElement;
    const imageSrc = image.src;
    setPostModalImageSrc(imageSrc);
    setShowPostModal((prevState) => !prevState);
  };

  return (
    <>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showPostModal && (
          <>
            <Backdrop onClick={togglePostModal} showCloseButton={true}>
              <motion.div
                className="h-full w-full flex justify-center items-center pointer-events-none"
                variants={slideInFromBottom}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                {postModalImageSrc && (
                  <div className="bg-white h-[calc(100vh-60px)] p-2 rounded-md flex cursor-default pointer-events-auto">
                    <img
                      className="max-w-full"
                      src={postModalImageSrc}
                      alt=""
                    />
                  </div>
                )}
              </motion.div>
            </Backdrop>
          </>
        )}
      </AnimatePresence>
      <section className="max-w-[948px] w-full mx-auto flex flex-col gap-4 min-h-[100vh]">
        <GridHeader gridViewProp={"postsView"} captionProp={"showPostsCaption"}>
          <h1>All posts</h1>
        </GridHeader>
        <GridViewContainer
          gridComponent={"postsView"}
          captionComponent={"showPostsCaption"}
        >
          {allPosts?.length ? (
            <>
              {allPosts?.map((post: any, index: number) => {
                return (
                  <div
                    className="flex flex-col relative group overflow-hidden rounded-3xl"
                    key={index}
                  >
                    <button
                      className="relative group/modalIcon"
                      onClick={togglePostModal}
                    >
                      <div className="absolute top-2 right-2 z-10 text-white bg-[#1d1d1fcc] w-[30px] h-[30px] p-1 rounded-full flex justify-center items-center opacity-0 group-hover/modalIcon:opacity-100 transition-opacity pointer-events-none">
                        <svg
                          fill="currentColor"
                          width="18px"
                          height="18px"
                          viewBox="0 0 32 32"
                          id="icon"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M28,4H10A2.0059,2.0059,0,0,0,8,6V20a2.0059,2.0059,0,0,0,2,2H28a2.0059,2.0059,0,0,0,2-2V6A2.0059,2.0059,0,0,0,28,4Zm0,16H10V6H28Z"></path>
                          <path d="M18,26H4V16H6V14H4a2.0059,2.0059,0,0,0-2,2V26a2.0059,2.0059,0,0,0,2,2H18a2.0059,2.0059,0,0,0,2-2V24H18Z"></path>
                          <rect
                            id="_Transparent_Rectangle_"
                            data-name="<Transparent Rectangle>"
                            fill="none"
                            width="18"
                            height="18"
                          ></rect>
                        </svg>
                      </div>
                      <Card
                        gridComponent={"postsView"}
                        captionComponent={"showPostsCaption"}
                        data={post}
                      />
                    </button>
                    {!state.showPostsCaption && (
                      <div className="flex flex-col justify-between gap-6 tablet:absolute px-3 pb-3 tablet:p-3 tablet:pt-12 tablet:bottom-0 w-full tablet:bg-gradient-to-t tablet:from-dark tablet:text-white tablet:opacity-0 tablet:translate-y-2 tablet:group-hover:opacity-100 tablet:group-hover:translate-y-0 tablet:transition">
                        <p>{post.characterName}</p>
                        <footer className="flex flex-col gap-4">
                          <div className="flex items-center gap-2">
                            <p className="text-xs">from</p>
                            <NavLink
                              className="tag-layered"
                              to={`/series/${post.seriesTitle}`}
                            >
                              {post.seriesTitle}
                            </NavLink>
                          </div>
                          <div className="flex-grow flex justify-between items-center">
                            <UserAvatar data={post} />
                            {post.user?.hasProducts && (
                              <div className="ml-auto">
                                <NavLink
                                  className="btn-primary-layered text-center group flex items-center gap-1.5"
                                  to={`/shop/${post.user._id}`}
                                >
                                  <p>Shop</p>
                                  <svg
                                    className="w-4 h-4"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      className="tablet:group-hover:stroke-white stroke-dark tablet:stroke-white"
                                      d="M20.25 6.75H3.75C3.33579 6.75 3 7.08579 3 7.5V19.5C3 19.9142 3.33579 20.25 3.75 20.25H20.25C20.6642 20.25 21 19.9142 21 19.5V7.5C21 7.08579 20.6642 6.75 20.25 6.75Z"
                                      stroke="#fff"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                    <path
                                      className="tablet:group-hover:stroke-white stroke-dark tablet:stroke-white"
                                      d="M8.25 6.75C8.25 5.75544 8.64509 4.80161 9.34835 4.09835C10.0516 3.39509 11.0054 3 12 3C12.9946 3 13.9484 3.39509 14.6517 4.09835C15.3549 4.80161 15.75 5.75544 15.75 6.75"
                                      stroke="#fff"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                  </svg>
                                </NavLink>
                              </div>
                            )}
                          </div>
                        </footer>
                      </div>
                    )}

                    {state.showPostsCaption && (
                      <div className="flex flex-col justify-between gap-6 px-3 pb-3 tablet:py-6 w-full">
                        <p>{post.characterName}</p>
                        <footer className="flex flex-col gap-4">
                          <div className="flex items-center gap-2">
                            <p className="text-xs">from</p>
                            <NavLink
                              className="tag"
                              to={`/series/${post.seriesTitle}`}
                            >
                              {post.seriesTitle}
                            </NavLink>
                          </div>
                          <div className="flex-grow flex justify-between items-center">
                            <UserAvatar data={post} />
                            {post.user?.hasProducts && (
                              <div className="ml-auto">
                                <NavLink
                                  className="btn-primary-small text-center group flex items-center gap-1.5"
                                  to={`/shop/${post.user._id}`}
                                >
                                  <p>Shop</p>
                                  <svg
                                    className="w-4 h-4"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      className="stroke-white"
                                      d="M20.25 6.75H3.75C3.33579 6.75 3 7.08579 3 7.5V19.5C3 19.9142 3.33579 20.25 3.75 20.25H20.25C20.6642 20.25 21 19.9142 21 19.5V7.5C21 7.08579 20.6642 6.75 20.25 6.75Z"
                                      stroke="#fff"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                    <path
                                      className="stroke-white"
                                      d="M8.25 6.75C8.25 5.75544 8.64509 4.80161 9.34835 4.09835C10.0516 3.39509 11.0054 3 12 3C12.9946 3 13.9484 3.39509 14.6517 4.09835C15.3549 4.80161 15.75 5.75544 15.75 6.75"
                                      stroke="#fff"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                  </svg>
                                </NavLink>
                              </div>
                            )}
                          </div>
                        </footer>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : noPosts ? (
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
              No posts.
            </p>
          ) : (
            <img
              className="w-6 h-6 absolute inset-1/2 -translate-x-1/2 -translate-y-1/2"
              src={loading}
              alt=""
            />
          )}
        </GridViewContainer>
      </section>
      <footer
        className="flex justify-center py-12 text-dark/80"
        data-site-footer
      >
        {postsRef.current >= limit ? (
          <button onClick={loadMorePosts}>Load more posts</button>
        ) : (
          <>
            <img className="w-10 h-10" src={end} alt="" />
          </>
        )}
      </footer>
    </>
  );
};

export default PostListView;
