import { useEffect, useState, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import { GlobalStateContext } from "../../context/Context";
import { usePosts } from "../../context/PostsContext";
import loading from "../../assets/images/loading.gif";
import { getFetchConfig } from "../../utils/fetchConfig";
import { apiUrl } from "../../utils/fetchConfig";
import GridHeader from "../../components/GridHeader";

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
  const { state } = useContext(GlobalStateContext);
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
      <GridHeader
        gridViewProp={"userPostsView"}
        captionProp={"showUserPostsCaption"}
      >
        <h2>{posts.length ? "All posts" : "No posts"}</h2>
      </GridHeader>
      <div
        className={`grid gap-1 ${
          state.userPostsView === "grid"
            ? "tablet:grid-cols-2 desktop:grid-cols-3"
            : ""
        }`}
      >
        {posts?.length ? (
          <>
            {posts?.toReversed().map((post: any) => {
              if (!post || !post.fileUrl || !post.fileUrl.length) {
                console.warn("Post or fileUrl is undefined or empty", post);
                return null; // Skip this post if data is invalid
              }

              return (
                <div
                  className={`w-full h-auto rounded-3xl flex flex-col gap-3 relative overflow-hidden group ${
                    state.userPostsView === "grid" &&
                    !state.showUserPostsCaption
                      ? "desktop:max-w-[300px] tablet:aspect-[3/4]"
                      : ""
                  }`}
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
                      className={`object-cover w-full rounded-3xl ${
                        state.userPostsView === "grid" ? "aspect-[3/4]" : ""
                      }`}
                      src={post.fileUrl}
                      alt=""
                      loading="lazy"
                      onLoad={handlePostImageLoad}
                    />
                  </div>
                  {!state.showUserPostsCaption && (
                    <div className="flex flex-col justify-between gap-4 tablet:absolute px-3 pb-3 tablet:p-3 tablet:pt-12 tablet:bottom-0 w-full tablet:bg-gradient-to-t tablet:from-dark tablet:text-white tablet:opacity-0 tablet:translate-y-2 tablet:group-hover:opacity-100 tablet:group-hover:translate-y-0 tablet:transition">
                      <p>{post.characterName}</p>
                      <p className="text-xs">from {post.seriesTitle}</p>
                    </div>
                  )}

                  {state.showUserPostsCaption && (
                    <div className="flex flex-col justify-between gap-4 px-3 pb-3 tablet:py-3 w-full">
                      <p>{post.characterName}</p>
                      <p className="text-xs">from {post.seriesTitle}</p>
                    </div>
                  )}
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
