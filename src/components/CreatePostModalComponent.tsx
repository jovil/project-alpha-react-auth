import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.css";
import Cookies from "universal-cookie";
import loading from "../assets/images/loading.gif";
import { usePosts } from "../context/PostsContext";

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
  const { userState, setUserState } = useUser();
  const { setAllPosts } = usePosts();
  const [post, setPost] = useState<{
    email: string;
    image: any;
    characterName: string;
    seriesTitle: string;
    _id: string;
  }>({
    email: "",
    image: "",
    characterName: "",
    seriesTitle: "",
    _id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCharacterNameInputEmpty, setIsCharacterNameInputEmpty] =
    useState(false);
  const [isSeriesTitleInputEmpty, setIsSeriesTitleInputEmpty] = useState(false);
  const token = cookies.get("TOKEN");
  const url = `${process.env.REACT_APP_API_URL}/create`;

  useEffect(() => {
    setPost((prev: any) => {
      return {
        ...prev,
        email: userState.email,
        image: isPostImage,
        _id: userState._id,
      };
    });
  }, [userState, isPostImage]);

  useEffect(() => {
    document.body.style.pointerEvents = isLoading ? "none" : "auto";
  }, [isLoading]);

  useEffect(() => {
    if (post.characterName.length > 0) setIsCharacterNameInputEmpty(false);
    if (post.seriesTitle.length > 0) setIsSeriesTitleInputEmpty(false);
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
        characterName: post.characterName,
        seriesTitle: post.seriesTitle,
      })
    );

    return formData;
  };

  // Modify handleCharacterName to return a boolean
  const handleCharacterName = () => {
    if (post.characterName.length === 0) {
      setIsCharacterNameInputEmpty(true);
      return false; // Return false if characterName is empty
    }
    setIsCharacterNameInputEmpty(false);
    return true; // Return true if characterName is valid
  };

  // Modify handleSeriesTitle to return a boolean
  const handleSeriesTitle = () => {
    if (post.seriesTitle.length === 0) {
      setIsSeriesTitleInputEmpty(true);
      return false; // Return false if seriesTitle is empty
    }
    setIsSeriesTitleInputEmpty(false);
    return true; // Return true if seriesTitle is valid
  };

  const createPost = async (e: any) => {
    e.preventDefault();

    // Return if characterName is empty
    if (!handleCharacterName()) return;
    // Return if seriesTitle is empty
    if (!handleSeriesTitle()) return;
    setIsLoading(true);

    const formData = handleFormData();

    const configuration = {
      method: "POST",
      body: formData,
    };

    try {
      const response = await fetch(url, configuration);
      const result = await response.json();
      !userState.hasPosted && (await updateHasPosted());
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
          characterName: "",
          seriesTitle: "",
        };
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateHasPosted = async () => {
    const url = `${process.env.REACT_APP_API_URL}/update-hasPosted/${userState._id}`;

    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify({ hasPosted: true }), // Convert the data to JSON string
      });
      setUserState((prev: any) => {
        return {
          ...prev,
          hasPosted: true,
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
          className="bg-dark/80 backdrop-blur p-4 fixed inset-0 z-10 flex justify-center items-center"
          onClick={closeModal}
        >
          <section className="w-[500px] p-4 mx-auto flex flex-col gap-4 bg-white rounded-md">
            <header>
              <h2>Create post</h2>
            </header>
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
                  <input
                    type="text"
                    className={`border border-dark/40 p-3 rounded ${
                      isCharacterNameInputEmpty ? "!border-danger" : ""
                    }`}
                    placeholder="Character Name"
                    name="characterName"
                    value={post.characterName}
                    onChange={handleChange}
                    autoFocus
                    required
                  />
                  <input
                    type="text"
                    className={`border border-dark/40 p-3 rounded ${
                      isSeriesTitleInputEmpty ? "!border-danger" : ""
                    }`}
                    placeholder="Series Title"
                    name="seriesTitle"
                    value={post.seriesTitle}
                    onChange={handleChange}
                    required
                  />
                  <button type="submit" className="hidden">
                    Save
                  </button>
                </div>
              </form>
            </div>
            <footer className="flex justify-end gap-3">
              <button
                className={`min-w-[91px] btn-primary text-sm flex justify-center items-center ${
                  isLoading
                    ? "bg-blue/20 border-blue/20 text-white/20 shadow-none pointer-events-none"
                    : ""
                }`}
                onClick={createPost}
              >
                {isLoading ? (
                  <img className="w-4 h-4 object-cover" src={loading} alt="" />
                ) : (
                  "Publish"
                )}
              </button>
              <button
                className="btn-outline-danger text-sm"
                onClick={closeModal}
              >
                Close
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  ) : (
    ""
  );
};

export default CreatePostModal;
