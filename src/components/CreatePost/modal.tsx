import { useState, useEffect, useRef } from "react";
import { useUser } from "../../context/UserContext";
import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.css";
import Cookies from "universal-cookie";
import loading from "../../assets/images/loading.gif";
import { usePosts } from "../../context/PostsContext";
import { motion, AnimatePresence } from "framer-motion";
import Backdrop from "../Backdrop";
import { slideInFromRight } from "../../utils/animations";

const CreatePostModal = ({
  isImageBase64,
  isPostImage,
  isShowModal,
  onToggleModal,
}: {
  isImageBase64: string;
  isPostImage: string | File;
  isShowModal: boolean;
  onToggleModal: () => void;
}) => {
  const cookies = new Cookies();
  const { userState } = useUser();
  const { setAllPosts } = usePosts();
  const [post, setPost] = useState<{
    image: any;
    title: string;
    description: string;
    tags: string;
    _id: string;
  }>({
    image: "",
    title: "",
    description: "",
    tags: "",
    _id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTitleInputEmpty, setIsTitleInputEmpty] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [showTagsLimitMessage, setShowTagsLimitMessage] =
    useState<boolean>(false);
  const token = cookies.get("TOKEN");
  const url = `${process.env.REACT_APP_API_URL}/create`;
  const tagsContainerRef = useRef<any>(null);

  useEffect(() => {
    setPost((prev: any) => {
      return {
        ...prev,
        image: isPostImage,
        _id: userState?._id,
      };
    });
  }, [userState, isPostImage]);

  useEffect(() => {
    document.body.style.pointerEvents = isLoading ? "none" : "auto";
  }, [isLoading]);

  useEffect(() => {
    if (post.title.length > 0) setIsTitleInputEmpty(false);
  }, [post]);

  useEffect(() => {
    setPost((prev: any) => ({
      ...prev,
      title: "",
      description: "",
    }));
    setTags([]);
  }, [onToggleModal]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setPost((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleFormData = () => {
    const formData = new FormData();
    const file = isPostImage;
    formData.append("image", file);
    formData.append(
      "post",
      JSON.stringify({
        _id: userState._id,
        userName: userState.userName,
        title: post.title,
        description: post.description,
        tags: tags,
      })
    );

    return formData;
  };

  // Modify handleTitle to return a boolean
  const handleTitle = () => {
    if (post.title.length === 0) {
      setIsTitleInputEmpty(true);
      return false; // Return false if title is empty
    }
    setIsTitleInputEmpty(false);
    return true; // Return true if title is valid
  };

  const createPost = async (e: any) => {
    e.preventDefault();

    // Return if title is empty
    if (!handleTitle()) return;
    setIsLoading(true);

    const formData = handleFormData();

    const configuration = {
      method: "POST",
      body: formData,
    };

    try {
      const response = await fetch(url, configuration);
      const result = await response.json();
      // Add new post to the start of the array
      setAllPosts((prevPosts: any) => [result.post, ...prevPosts]);
      setIsLoading(false);
      new Notify({
        title: "Post created successfully",
        text: "Your new post is now live.",
      });

      // Clear post form
      setPost((prev: any) => {
        return {
          ...prev,
          image: "",
          title: "",
          description: "",
          tags: "",
        };
      });
      setTags([]);

      onToggleModal();
    } catch (error) {
      console.log("error", error);
    }
  };

  const addTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (post.tags === "") return;
    if (tags.length < 3 && showTagsLimitMessage) setShowTagsLimitMessage(false);

    if (tags.length >= 3) setShowTagsLimitMessage(true);
    if (tags.length >= 3) return;
    setTags((prevTags: string[]) => [...prevTags, post.tags]);
    setPost((prev: any) => ({
      ...prev,
      tags: "",
    }));
  };

  const deleteTag = (tagToRemove: string) => {
    setTags((prevTags: string[]) =>
      prevTags.filter((prevTags) => prevTags !== tagToRemove)
    );
  };

  return token ? (
    <>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isShowModal && (
          <Backdrop onClick={onToggleModal} showCloseButton={false}>
            <motion.div
              className="h-full w-4/5 tablet:w-2/5 overflow-scroll ml-auto cursor-default"
              variants={slideInFromRight}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <section className="min-h-[calc(100vh-32px)] m-4 bg-white rounded p-3 pb-16 flex flex-col gap-3 relative">
                <header>
                  <h2 className="subtitle">Create post</h2>
                </header>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4 items-center w-full">
                    {isPostImage && (
                      <img
                        className="w-full h-[50vh] object-cover border border-dark/40 rounded select-none"
                        src={isImageBase64 ? isImageBase64 : undefined}
                        alt=""
                      />
                    )}
                    <form className="w-full" onSubmit={(e) => createPost(e)}>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="subtitle">Title</label>
                          <input
                            type="text"
                            className={`border-2 border-[#444] p-3 rounded ${
                              isTitleInputEmpty ? "!border-danger" : ""
                            }`}
                            placeholder="Create a title"
                            name="title"
                            value={post.title}
                            onChange={handleChange}
                            autoFocus
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="subtitle">Description</label>
                          <input
                            type="text"
                            className="border-2 border-[#444] p-3 rounded"
                            placeholder="Create a description"
                            name="description"
                            value={post.description}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="subtitle flex gap-1">
                            Tags
                            {showTagsLimitMessage && (
                              <p className="font-medium text-sm text-danger normal-case">
                                You can only select up to 3 tags.
                              </p>
                            )}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              className="border-2 border-[#444] p-3 rounded w-full"
                              placeholder="Create tags"
                              name="tags"
                              value={post.tags}
                              onChange={handleChange}
                            />
                            <div className="flex">
                              <button
                                className="btn-chunky-primary whitespace-nowrap"
                                type="button"
                                onClick={addTag}
                              >
                                Add tag
                              </button>
                            </div>
                          </div>

                          <div
                            className="flex flex-wrap gap-2"
                            ref={tagsContainerRef}
                          >
                            {tags.length > 0 && (
                              <>
                                {tags.map((tag: string, index: number) => {
                                  return (
                                    <div
                                      className="tag flex items-center gap-1"
                                      key={index}
                                    >
                                      <p>{tag}</p>
                                      <button
                                        type="button"
                                        onClick={() => deleteTag(tag)}
                                      >
                                        <svg
                                          className="text-blue-100 h-3 w-3 rotate-45"
                                          width="24"
                                          height="25"
                                          viewBox="0 0 24 25"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M12 3V21"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            d="M3 12H21"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </div>
                        </div>

                        <button type="submit" className="hidden">
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                  <footer className="flex justify-end gap-3">
                    <button
                      className={`min-w-[91px] btn-chunky-primary flex justify-center items-center ${
                        isLoading
                          ? "bg-blue/20 border-blue/20 text-white/20 shadow-none pointer-events-none"
                          : ""
                      }`}
                      onClick={createPost}
                    >
                      {isLoading ? (
                        <img
                          className="w-4 h-4 object-cover"
                          src={loading}
                          alt=""
                        />
                      ) : (
                        "Publish"
                      )}
                    </button>
                    <button
                      className="btn-chunky-danger"
                      onClick={onToggleModal}
                    >
                      Close
                    </button>
                  </footer>
                </div>
              </section>
            </motion.div>
          </Backdrop>
        )}
      </AnimatePresence>
    </>
  ) : (
    ""
  );
};

export default CreatePostModal;
