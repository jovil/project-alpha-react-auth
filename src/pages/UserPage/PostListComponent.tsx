import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { usePosts } from "../../context/PostsContext";
import loading from "../../assets/images/loading.gif";
import { getFetchConfig } from "../../utils/fetchConfig";
import { apiUrl } from "../../utils/fetchConfig";

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

const ProductListComponent = ({ isUser }: { isUser: any }) => {
  const { userId } = useParams();
  const { allPosts } = usePosts();
  const [posts, setPosts] = useState<Posts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [runShimmerAnimation, setRunShimmerAnimation] = useState(false);

  const fetchPosts = useCallback(async () => {
    const url = `${apiUrl}/posts/${userId}`;
    try {
      const response = await fetch(url, getFetchConfig);
      const result: Posts[] = await response.json();
      setPosts(result);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, allPosts]);

  const handlePostImageLoad = () => {
    setIsLoading(false);
    setRunShimmerAnimation(true);
  };

  return (
    <section className="max-w-[908px] w-full mx-auto flex flex-col gap-4 py-16">
      <header className="hidden tablet:flex justify-between items-center gap-2">
        <h2>{posts.length ? "All posts" : "No posts"}</h2>
      </header>
      <div className="grid tablet:grid-cols-2 desktop:grid-cols-3 gap-1 max-w-[908px] w-full mx-auto">
        {posts?.length ? (
          <>
            {posts?.toReversed().map((post: any) => {
              if (!post || !post.fileUrl || !post.fileUrl.length) {
                console.warn("Post or fileUrl is undefined or empty", post);
                return null; // Skip this post if data is invalid
              }

              return (
                <div
                  className="desktop:max-w-[300px] w-full h-auto border border-dark/80 shadow-md rounded flex flex-col gap-3 relative overflow-hidden group tablet:aspect-[3/4]"
                  key={post._id}
                >
                  <div className="h-full relative overflow-hidden">
                    {runShimmerAnimation && (
                      <div className="shimmer-overlay"></div>
                    )}
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
                  <div className="flex flex-col justify-between gap-4 tablet:absolute px-3 pb-3 tablet:p-3 tablet:pt-12 tablet:bottom-0 w-full tablet:bg-gradient-to-t tablet:from-dark tablet:text-white tablet:opacity-0 tablet:translate-y-2 tablet:group-hover:opacity-100 tablet:group-hover:translate-y-0 tablet:transition">
                    <p>{post.characterName}</p>
                    <p className="text-xs">from {post.seriesTitle}</p>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

export default ProductListComponent;
