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
                className="max-w-[300px] w-full h-auto border border-dark/80 shadow-md rounded flex flex-col gap-3 relative overflow-hidden group aspect-[3/4]"
                key={post._id}
              >
                <div className="h-full">
                  {isLoading && (
                    <img
                      className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0"
                      src={loading}
                      alt=""
                    />
                  )}
                  <img
                    className="w-full h-full object-cover rounded-sm"
                    src={post.fileUrl}
                    alt=""
                    loading="lazy"
                    onLoad={handlePostImageLoad}
                  />
                </div>
                <div className="flex flex-col justify-between gap-4 absolute p-3 pt-12 bottom-0 w-full bg-gradient-to-t from-dark text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
                  <p>{post.characterName}</p>
                  <p className="text-xs">from {post.seriesTitle}</p>
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
