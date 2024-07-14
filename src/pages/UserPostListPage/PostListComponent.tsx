import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import loading from "../../assets/images/loading.gif";

interface User {
  _id: string;
  avatar: string;
  userName: string;
}

interface Posts {
  email: string;
  fileUrl: string;
  charactherName: string;
  user: User;
}

const ProductListComponent = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState<Posts[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/posts/${userId}`;
    const configuration = {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
    };

    try {
      const response = await fetch(url, configuration);
      const result: Posts[] = await response.json();
      setPosts(result);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    console.log("posts", posts);
  }, [posts]);

  const handlePostImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <section className="grid grid-cols-3 gap-1 max-w-[908px] w-full py-16 mx-auto">
      {posts?.length ? (
        <>
          {posts?.toReversed().map((post: any) => {
            if (!post || !post.fileUrl || !post.fileUrl.length) {
              console.warn("Post or fileUrl is undefined or empty", post);
              return null; // Skip this post if data is invalid
            }

            return (
              <div
                className="max-w-[300px] w-full h-auto border border-dark/80 shadow-md rounded p-4 pb-3 flex flex-col gap-3"
                key={post._id}
              >
                <div className="relative aspect-square">
                  {isLoading && (
                    <img
                      className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0"
                      src={loading}
                      alt=""
                    />
                  )}
                  <img
                    className="aspect-square w-full object-cover rounded-sm"
                    src={post.fileUrl}
                    alt=""
                    loading="lazy"
                    onLoad={handlePostImageLoad}
                  />
                </div>
                <div className="h-full flex flex-col justify-between gap-4">
                  <p className="text-sm">{post.characterName}</p>
                  <p className="text-sm">from {post.seriesTitle}</p>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
          No posts.
        </p>
      )}
    </section>
  );
};

export default ProductListComponent;
