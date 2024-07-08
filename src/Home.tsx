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
                  className="max-w-[300px] w-full h-auto min-h-[320px] border border-dark/80 shadow-md rounded p-4 pb-3 flex flex-col gap-3 relative"
                  key={post._id}
                >
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
                    className="aspect-square object-cover rounded-sm"
                    src={post.fileUrl}
                    alt=""
                    loading="lazy"
                    onLoad={handlePostImageLoad}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm">{post.caption}</p>
                    <NavLink
                      className="btn-outline-dark text-xs shadow-none rounded-full"
                      to={`/shop/${post.user}`}
                    >
                      Visit my shop
                    </NavLink>
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
