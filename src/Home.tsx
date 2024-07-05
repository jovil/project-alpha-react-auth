import { useCallback, useEffect, useState } from "react";
import CreatePostModal from "./components/CreatePostModal";

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
      console.table(result);
      setPosts(result);
    } catch (error) {
      console.log("error creating post", error);
    }
  }, [url]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <>
      <section className="flex flex-col gap-5">
        {posts ? (
          <>
            {posts?.map((post: any) => {
              return (
                <div key={post._id}>
                  <h2>{post.email}</h2>
                  <h2>{post.title}</h2>
                  <p>{post.description}</p>
                </div>
              );
            })}
          </>
        ) : (
          ""
        )}
      </section>
      <CreatePostModal />
    </>
  );
}
