import { useCallback, useEffect, useState } from "react";
import CreatePostModal from "./components/CreatePostModal";
import loading from "./assets/images/loading.gif";

export default function Home() {
  const [posts, setPosts] = useState([]);
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
      console.table("all posts", result);
      setPosts(result);
    } catch (error) {
      console.log("error creating post", error);
    }

    console.log("effect home");
  }, [url, setPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <>
      <section className="grid grid-cols-3 gap-1 max-w-[908px] mx-auto">
        {posts.length ? (
          <>
            {posts?.toReversed().map((post: any) => {
              return (
                <div
                  className="w-[300px] h-[320px] border border-dark/80 shadow-md rounded p-4 flex flex-col gap-2"
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
