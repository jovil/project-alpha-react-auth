import { useEffect, useState, useCallback, useContext } from "react";
import { useLocation } from "react-router-dom";
import { GlobalStateContext } from "../../context/Context";
import { useUser } from "../../context/UserContext";
import { usePosts } from "../../context/PostsContext";
import { getFetchConfig } from "../../utils/fetchConfig";
import { apiUrl } from "../../utils/fetchConfig";
import GridHeader from "../../components/Grid/header";
import GridViewContainer from "../../components/Grid/gridViewContainer";
import Card from "../../components/Card";
import useFileUpload from "../../hooks/useFileUpload";
import CreatePostModal from "../../components/CreatePost/modal";
import SadFace from "../../assets/images/sad-face.svg";
import loadingImage from "../../assets/images/loading.gif";

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
  const location = useLocation();
  const { userId } = location.state || {};
  const { state } = useContext(GlobalStateContext);
  const { userState } = useUser();
  const { allPosts } = usePosts();
  const [posts, setPosts] = useState<Posts[]>([]);
  const {
    showModal,
    postImage,
    imageBase64,
    handleFileUpload,
    handleTogglePostModal,
  } = useFileUpload();
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    const url = `${apiUrl}/posts/${userId}`;
    try {
      const response = await fetch(url, getFetchConfig);
      const result: Posts[] = await response.json();
      setPosts(result);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, allPosts]);

  return (
    <>
      {loading ? (
        <img
          className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0"
          src={loadingImage}
          alt=""
        />
      ) : (
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
                        console.warn(
                          "Post or fileUrl is undefined or empty",
                          post
                        );
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
            <>
              {userState._id === userId && (
                <>
                  <section className="flex justify-center items-center flex-grow">
                    <div className="container">
                      <form className="bg-dark/5 w-full flex flex-col border border-dashed border-dark/60 rounded pointer-events-auto">
                        <label
                          className="p-16 m-0 cursor-pointer"
                          htmlFor="file-upload"
                        >
                          <div className="flex flex-col justify-center items-center gap-4">
                            <img className="h-16 w-16" src={SadFace} alt="" />
                            <div className="flex flex-col gap-6 items-center">
                              <p>You don't have any posts.</p>
                              <div className="btn-chunky-primary">
                                Create a post
                              </div>
                            </div>
                          </div>
                        </label>
                        <div className="hidden">
                          <input
                            id="file-upload"
                            type="file"
                            name="image"
                            accept=".jpeg, .png, .jpg"
                            onChange={handleFileUpload}
                          />
                        </div>
                      </form>
                    </div>
                  </section>
                  <CreatePostModal
                    isShowModal={showModal}
                    isPostImage={postImage}
                    isImageBase64={imageBase64}
                    onToggleModal={handleTogglePostModal}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Grid;
