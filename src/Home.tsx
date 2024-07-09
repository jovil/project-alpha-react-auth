import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { usePosts } from "./pages/Context/PostsContext";
import CreatePostModal from "./components/CreatePostModal";
import loading from "./assets/images/loading.gif";

export default function Home() {
  const { posts, setPosts } = usePosts();
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
      await setPosts(result);
      if (result.length === 0) setNoPosts(true);
    } catch (error) {
      console.log("error creating post", error);
    }
  }, [url, setPosts]);

  useEffect(() => {
    if (posts.length) return;
    fetchPosts();
  }, [fetchPosts, posts.length]);

  useEffect(() => {
    console.log("posts", posts);
  }, [posts]);

  const handlePostImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      <section className="grid grid-cols-3 gap-1 max-w-[908px] w-full mx-auto">
        {posts.length ? (
          <>
            {posts?.toReversed().map((post: any) => {
              return (
                <div
                  className="max-w-[300px] w-full h-auto border border-dark/80 shadow-md rounded p-4 pb-3 flex flex-col gap-3"
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
                  <div className="flex flex-col justify-between gap-3">
                    <p className="text-sm">{post.caption}</p>
                    {post.user?.hasPosted && (
                      <div className="ml-auto">
                        <NavLink
                          className="btn-outline-dark font-normal text-xs text-center group rounded-full flex items-center gap-1"
                          to={`/shop/${post.user._id}`}
                        >
                          @{post.user.userName}
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
      </section>
      <CreatePostModal />
    </>
  );
}
