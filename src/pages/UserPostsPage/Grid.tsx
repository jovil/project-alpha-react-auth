import { useEffect, useState, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import { GlobalStateContext } from "../../context/Context";
import { usePosts } from "../../context/PostsContext";
import { getFetchConfig } from "../../utils/fetchConfig";
import { apiUrl } from "../../utils/fetchConfig";
import GridHeader from "../../components/Grid/header";
import GridViewContainer from "../../components/Grid/gridViewContainer";
import Card from "../../components/Card";

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

const Grid = ({ isUser }: { isUser?: any }) => {
  const { userId } = useParams();
  const { state } = useContext(GlobalStateContext);
  const { allPosts } = usePosts();
  const [posts, setPosts] = useState<Posts[]>([]);

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

  return (
    <>
      {posts.length > 0 ? (
        <section className="container flex flex-col gap-4 py-16">
          <GridHeader
            gridViewProp={"userPostsView"}
            captionProp={"showUserPostsCaption"}
          >
            <h2>All posts</h2>
          </GridHeader>
          <GridViewContainer
            gridComponent={"userPostsView"}
            captionComponent={"showUserPostsCaption"}
          >
            {posts?.length ? (
              <>
                {posts?.map((post: any, index: number) => {
                  if (!post || !post.fileUrl || !post.fileUrl.length) {
                    console.warn("Post or fileUrl is undefined or empty", post);
                    return null; // Skip this post if data is invalid
                  }

                  return (
                    <div
                      className="flex flex-col relative group overflow-hidden rounded-3xl"
                      key={index}
                      data-item
                    >
                      <Card
                        gridComponent={"userPostsView"}
                        captionComponent={"showUserPostsCaption"}
                        data={post}
                        isShowSettings={true}
                      />
                      {!state.showUserPostsCaption && (
                        <div className="flex flex-col justify-between gap-4 tablet:absolute px-3 pb-3 tablet:p-3 tablet:pt-12 tablet:bottom-0 w-full tablet:bg-gradient-to-t tablet:from-dark tablet:text-white tablet:opacity-0 tablet:translate-y-2 tablet:group-hover:opacity-100 tablet:group-hover:translate-y-0 tablet:transition">
                          <p>{post.characterName}</p>
                          <p className="text-xs">from {post.seriesTitle}</p>
                        </div>
                      )}

                      {state.showUserPostsCaption && (
                        <div className="flex flex-col justify-between gap-4 px-3 pb-3 tablet:py-6 w-full">
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
          </GridViewContainer>
        </section>
      ) : (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          No posts
        </div>
      )}
    </>
  );
};

export default Grid;
