import { useCallback, useEffect, useState } from "react";
import { usePosts } from "./PostsContext";
import CreatePostModal from "./components/CreatePostModal";
import loading from "./assets/images/loading.gif";

export default function Home() {
  const { posts, setPosts } = usePosts();
  const [noPosts, setNoPosts] = useState(false);
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

  useEffect(() => {}, [posts]);

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
                    src={post.fileUrl}
                    alt=""
                    loading="lazy"
                  />
                  <p className="text-sm">{post.caption}</p>
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
