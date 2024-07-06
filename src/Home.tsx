import { useCallback, useEffect } from "react";
import { usePosts } from "./PostsContext";
import CreatePostModal from "./components/CreatePostModal";
import loading from "./assets/images/loading.gif";

export default function Home() {
  const { posts, setPosts } = usePosts();
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

      setPosts(result);
    } catch (error) {
      console.log("error creating post", error);
    }
  }, [url, setPosts]);

  useEffect(() => {
    if (posts.length) return;
    console.log("fetchPosts");
    fetchPosts();
  }, [fetchPosts, posts.length]);

  // Log state changes using useEffect
  useEffect(() => {
    console.table("posts", posts);
  }, [posts]);

  return (
    <>
      <section className="grid grid-cols-3 gap-1 max-w-[908px] w-full mx-auto">
        {posts.length ? (
          <>
            {posts?.toReversed().map((post: any) => {
              return (
                <div
                  className="max-w-[300px] w-full h-auto max-h-[320px] border border-dark/80 shadow-md rounded p-4 flex flex-col gap-2"
                  key={post._id}
                >
                  <img
                    className="aspect-square object-cover rounded-sm"
                    src={post.image}
                    alt=""
                    loading="lazy"
                  />
                  <p className="text-sm">{post.caption}</p>
                </div>
              );
            })}
          </>
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
