import { useCallback, useEffect, useState, useContext } from "react";
import { GlobalStateContext } from "../../context/Context";
import { usePosts } from "../../context/PostsContext";
import { NavLink } from "react-router-dom";
import loading from "../../assets/images/loading.gif";
import defaultAvatar from "../../assets/images/toon_6.png";
import iconGrid from "../../assets/images/icon-grid.svg";
import iconList from "../../assets/images/icon-list.svg";

const PostListView = () => {
  const { state, setState } = useContext(GlobalStateContext);
  const { allPosts, setAllPosts } = usePosts();
  const [noPosts, setNoPosts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const url = `${process.env.REACT_APP_API_URL}/posts`;

  const fetchPosts = useCallback(async () => {
    const configuration = {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
    };

    try {
      const response = await fetch(url, configuration);
      const result = await response.json();
      await setAllPosts(result);
      if (result.length === 0) setNoPosts(true);
    } catch (error) {
      console.log("error creating post", error);
    }
  }, [url, setAllPosts]);

  useEffect(() => {
    if (allPosts?.length) return;
    fetchPosts();
  }, [fetchPosts, allPosts?.length]);

  useEffect(() => {
    console.log("posts", allPosts);
  }, [allPosts]);

  const handlePostImageLoad = () => {
    setIsLoading(false);
  };

  const handlePostsGridView = () => {
    setState({ ...state, postsView: "grid" });
  };

  const handlePostsListView = () => {
    setState({ ...state, postsView: "list" });
  };

  return (
    <>
      <section className="max-w-[908px] w-full mx-auto flex flex-col gap-4">
        <header className="flex justify-end items-center gap-2">
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
        </header>
        <div
          className={`grid gap-1 ${
            state.postsView === "grid" ? "grid-cols-3" : ""
          }`}
        >
          {allPosts?.length ? (
            <>
              {allPosts?.toReversed().map((post: any) => {
                return (
                  <div
                    className={`w-full h-auto border border-dark/80 shadow-md rounded p-4 pb-3 flex flex-col gap-3 ${
                      state.postsView === "grid" ? "max-w-[300px]" : ""
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
                    <div className="flex flex-col flex-grow justify-between gap-3">
                      <p className="text-sm">{post.characterName}</p>
                      <p className="text-sm">from {post.seriesTitle}</p>
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
                          <p className="text-xs">@{post.user.userName}</p>
                        </NavLink>
                        {post.user?.hasProducts && (
                          <div className="ml-auto">
                            <NavLink
                              className="btn-outline-dark text-xs text-center group rounded-full flex items-center gap-1.5"
                              to={`/shop/${post.user._id}`}
                            >
                              <svg
                                className="w-4 h-4"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  className="group-hover:stroke-white"
                                  d="M20.25 6.75H3.75C3.33579 6.75 3 7.08579 3 7.5V19.5C3 19.9142 3.33579 20.25 3.75 20.25H20.25C20.6642 20.25 21 19.9142 21 19.5V7.5C21 7.08579 20.6642 6.75 20.25 6.75Z"
                                  stroke="#171717"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>
                                <path
                                  className="group-hover:stroke-white"
                                  d="M8.25 6.75C8.25 5.75544 8.64509 4.80161 9.34835 4.09835C10.0516 3.39509 11.0054 3 12 3C12.9946 3 13.9484 3.39509 14.6517 4.09835C15.3549 4.80161 15.75 5.75544 15.75 6.75"
                                  stroke="#171717"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>
                              </svg>
                            </NavLink>
                          </div>
                        )}
                      </div>
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
    </>
  );
};

export default PostListView;
