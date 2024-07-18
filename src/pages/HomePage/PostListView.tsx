import { useCallback, useEffect, useState, useContext, useRef } from "react";
import { GlobalStateContext } from "../../context/Context";
import { usePosts } from "../../context/PostsContext";
import { NavLink } from "react-router-dom";
import loading from "../../assets/images/loading.gif";
import defaultAvatar from "../../assets/images/toon_6.png";
import iconGrid from "../../assets/images/icon-grid.svg";
import iconList from "../../assets/images/icon-list.svg";
import end from "../../assets/images/end.png";
import { getFetchConfig } from "../../utils/fetchConfig";

const PostListView = () => {
  const { state, setState } = useContext(GlobalStateContext);
  const { allPosts, setAllPosts } = usePosts();
  const [noPosts, setNoPosts] = useState(false);
  const [postImageIsLoading, setPostImageLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [runShimmerAnimation, setRunShimmerAnimation] = useState(false);
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

  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePostImageLoad = () => {
    setPostImageLoading(false);
    setRunShimmerAnimation(true);
  };

  const handlePostsGridView = () => {
    setState({ ...state, postsView: "grid" });
  };

  const handlePostsListView = () => {
    setState({ ...state, postsView: "list" });
  };

  return (
    <>
      <section className="max-w-[908px] w-full mx-auto flex flex-col gap-4 min-h-[100vh]">
        <header className="hidden tablet:flex justify-between items-center gap-2">
          <>
            <h1>All posts</h1>
          </>
          <div className="flex justify-end">
            <button>
              <img
                className={`w-7 h-7 p-1.5 rounded-full ${
                  state.postsView === "list" ? "bg-dark/10" : ""
                }`}
                src={iconList}
                onClick={handlePostsListView}
                alt=""
              />
            </button>
            <button>
              <img
                className={`w-7 h-7 p-1.5 rounded-full ${
                  state.postsView === "grid" ? "bg-dark/10" : ""
                }`}
                src={iconGrid}
                onClick={handlePostsGridView}
                alt=""
              />
            </button>
          </div>
        </header>
        <div
          className={`grid gap-1 ${
            state.postsView === "grid"
              ? "tablet:grid-cols-2 desktop:grid-cols-3"
              : ""
          }`}
        >
          {allPosts?.length ? (
            <>
              {allPosts?.map((post: any) => {
                return (
                  <div
                    className={`w-full h-auto border border-dark/80 shadow-md rounded flex flex-col gap-3 relative overflow-hidden group ${
                      state.postsView === "grid"
                        ? "desktop:max-w-[300px] tablet:aspect-[3/4]"
                        : ""
                    }`}
                    key={post._id}
                  >
                    <div className="h-full relative overflow-hidden">
                      {runShimmerAnimation && (
                        <div className="shimmer-overlay"></div>
                      )}
                      <img
                        className={
                          postImageIsLoading
                            ? `w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0`
                            : "hidden"
                        }
                        src={postImageIsLoading ? loading : ""}
                        alt=""
                      />
                      <img
                        className="object-cover w-full h-full rounded-sm"
                        src={post.fileUrl}
                        alt=""
                        loading="lazy"
                        onLoad={handlePostImageLoad}
                      />
                    </div>
                    <div className="flex flex-col justify-between gap-6 tablet:absolute px-3 pb-3 tablet:p-3 tablet:pt-12 tablet:bottom-0 w-full tablet:bg-gradient-to-t tablet:from-dark tablet:text-white tablet:opacity-0 tablet:translate-y-2 tablet:group-hover:opacity-100 tablet:group-hover:translate-y-0 tablet:transition">
                      <p>{post.characterName}</p>
                      <footer className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <p className="text-xs">from</p>
                          <NavLink
                            className="tag-no-hover tablet:tag"
                            to={`/series/${post.seriesTitle}`}
                          >
                            {post.seriesTitle}
                          </NavLink>
                        </div>
                        <div className="flex-grow flex justify-between items-center">
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
                          {post.user?.hasProducts && (
                            <div className="ml-auto">
                              <NavLink
                                className="btn-outline-small-no-hover tablet:btn-outline-small text-center group flex items-center gap-1.5"
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
        </div>
      </section>
      <footer className="flex justify-center p-8 text-dark/80" data-site-footer>
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
