import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.css";
import Cookies from "universal-cookie";
import loading from "../../assets/images/loading.gif";
import { usePosts } from "../../context/PostsContext";

const CreatePostModal = ({
  isImageBase64,
  isPostImage,
  isShowModal,
  onToggleModal,
}: {
  isImageBase64: string;
  isPostImage: string | File;
  isShowModal: boolean;
  onToggleModal: (value: boolean) => void;
}) => {
  const cookies = new Cookies();
  const { userState } = useUser();
  const { setAllPosts } = usePosts();
  const [post, setPost] = useState<{
    email: string;
    image: any;
    title: string;
    description: string;
    _id: string;
  }>({
    email: "",
    image: "",
    title: "",
    description: "",
    _id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTitleInputEmpty, setIsTitleInputEmpty] = useState(false);
  const [isDescriptionInputEmpty, setIsDescriptionInputEmpty] = useState(false);
  const token = cookies.get("TOKEN");
  const url = `${process.env.REACT_APP_API_URL}/create`;

  useEffect(() => {
    setPost((prev: any) => {
      return {
        ...prev,
        email: userState?.email,
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
    if (post.description.length > 0) setIsDescriptionInputEmpty(false);
  }, [post]);

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
        email: userState.email,
        title: post.title,
        description: post.description,
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

  // Modify handleDescription to return a boolean
  const handleDescription = () => {
    if (post.description.length === 0) {
      setIsDescriptionInputEmpty(true);
      return false; // Return false if description is empty
    }
    setIsDescriptionInputEmpty(false);
    return true; // Return true if description is valid
  };

  const createPost = async (e: any) => {
    e.preventDefault();

    // Return if title is empty
    if (!handleTitle()) return;
    // Return if description is empty
    if (!handleDescription()) return;
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
      onToggleModal(false);
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
        };
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const closeModal = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    onToggleModal(false);
  };

  return token ? (
    <>
      {isShowModal && (
        <div
          className="bg-dark/80 backdrop-blur p-4 fixed inset-0 z-30 flex justify-center items-center"
          onClick={closeModal}
        >
          <section className="w-[500px] p-4 mx-auto flex flex-col gap-4 bg-white rounded-md">
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
                        className={`border-2 border-[#444] p-3 rounded ${
                          isDescriptionInputEmpty ? "!border-danger" : ""
                        }`}
                        placeholder="Create a description"
                        name="description"
                        value={post.description}
                        onChange={handleChange}
                      />
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
                <button className="btn-chunky-danger" onClick={closeModal}>
                  Close
                </button>
              </footer>
            </div>
          </section>
        </div>
      )}
    </>
  ) : (
    ""
  );
};

export default CreatePostModal;
