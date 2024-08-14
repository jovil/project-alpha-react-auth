import React, { useEffect, useState, useCallback, useContext } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import Backdrop from "../../components/Backdrop";
import { slideInFromBottom } from "../../utils/animations";

interface User {
  _id: string;
  avatar: string;
  userName: string;
}

interface Posts {
  email: string;
  fileUrl: string;
  title: string;
  description: string;
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
  const [showPostModal, setShowPostModal] = useState(false);
  const [postModalImageSrc, setPostModalImageSrc] = useState<string>("");

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
  }, [fetchPosts, allPosts, userState.postCount]);

  useEffect(() => {
    document.body.style.overflow = showPostModal ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPostModal]);

  const togglePostModal = (e: React.MouseEvent<HTMLElement>) => {
    const image = e.target as HTMLImageElement;
    const imageSrc = image.src;
    setPostModalImageSrc(imageSrc);
    setShowPostModal((prevState) => !prevState);
  };

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
                <h2 className="subtitle">All posts</h2>
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
                          className="bg-white p-4 flex flex-col gap-4 relative group overflow-hidden rounded-xl shadow-chunky"
                          key={index}
                        >
                          <div
                            className="relative group/modalIcon cursor-zoom-in"
                            onClick={(e) => {
                              togglePostModal(e);
                              e.stopPropagation();
                            }}
                          >
                            <div className="absolute top-2 right-2 z-10 text-white bg-[#1d1d1fcc] w-[30px] h-[30px] p-1 rounded-full flex justify-center items-center opacity-0 group-hover/modalIcon:opacity-100 transition-opacity pointer-events-none">
                              <svg
                                fill="currentColor"
                                width="18px"
                                height="18px"
                                viewBox="0 0 32 32"
                                id="icon"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M28,4H10A2.0059,2.0059,0,0,0,8,6V20a2.0059,2.0059,0,0,0,2,2H28a2.0059,2.0059,0,0,0,2-2V6A2.0059,2.0059,0,0,0,28,4Zm0,16H10V6H28Z"></path>
                                <path d="M18,26H4V16H6V14H4a2.0059,2.0059,0,0,0-2,2V26a2.0059,2.0059,0,0,0,2,2H18a2.0059,2.0059,0,0,0,2-2V24H18Z"></path>
                                <rect
                                  id="_Transparent_Rectangle_"
                                  data-name="<Transparent Rectangle>"
                                  fill="none"
                                  width="18"
                                  height="18"
                                ></rect>
                              </svg>
                            </div>
                            <Card
                              gridComponent={"userPostsView"}
                              captionComponent={"showUserPostsCaption"}
                              data={post}
                              isShowSettings={true}
                            />
                          </div>
                          {state.showUserPostsCaption && (
                            <div className="flex flex-col justify-between gap-6 w-full">
                              <div className="flex flex-col gap-1">
                                <p className="font-bold">{post.title}</p>
                                <p className="text-grey">{post.description}</p>
                              </div>
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
      {posts?.length > 0 && (
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => null}
        >
          {showPostModal && (
            <>
              <Backdrop onClick={togglePostModal} showCloseButton={true}>
                <motion.div
                  className="h-full w-full flex justify-center items-center pointer-events-none"
                  variants={slideInFromBottom}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={(e) => e.stopPropagation()}
                >
                  {postModalImageSrc && (
                    <div className="bg-white h-[calc(100vh-60px)] p-2 rounded-md flex cursor-default pointer-events-auto">
                      <img
                        className="max-w-full"
                        src={postModalImageSrc}
                        alt=""
                      />
                    </div>
                  )}
                </motion.div>
              </Backdrop>
            </>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default Grid;
