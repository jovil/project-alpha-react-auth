import { useCallback, useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { NavLink } from "react-router-dom";
import { usePosts } from "../../context/PostsContext";
import CreatePostModal from "../../components/CreatePostModal";
import loading from "../../assets/images/loading.gif";
import { Form } from "react-bootstrap";
import defaultAvatar from "../../assets/images/toon_6.png";
import Cookies from "universal-cookie";

export default function Home() {
  const cookies = new Cookies();
  const { userState } = useUser();
  const { allPosts, setAllPosts } = usePosts();
  const [noPosts, setNoPosts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [postImage, setPostImage] = useState();
  const [showModal, setShowModal] = useState(false);
  const url = `${process.env.REACT_APP_API_URL}/posts`;
  const token = cookies.get("TOKEN");

  const handleToggleModal = (value: boolean) => {
    setShowModal(value);
  };

  const fetchPosts = useCallback(async () => {
    const configuration = {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
    };

    try {
      const response = await fetch(url, configuration);
      const result = await response.json();
      await setAllPosts(result);
      if (result.length === 0) setNoPosts(true);
    } catch (error) {
      console.log("error creating post", error);
    }
  }, [url, setAllPosts]);

  useEffect(() => {
    if (allPosts?.length) return;
    fetchPosts();
  }, [fetchPosts, allPosts?.length]);

  useEffect(() => {
    console.log("posts", allPosts);
  }, [allPosts]);

  const handlePostImageLoad = () => {
    setIsLoading(false);
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);

    setImageBase64(base64 as string);
    setPostImage(file);
    setShowModal(true);
  };

  function convertToBase64(file: File) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  return (
    <>
      <section className="grid grid-cols-3 gap-1 max-w-[908px] w-full mx-auto">
        {allPosts?.length ? (
          <>
            {allPosts?.toReversed().map((post: any) => {
              return (
                <div
                  className="max-w-[300px] w-full h-auto border border-dark/80 shadow-md rounded p-4 pb-3 flex flex-col gap-3"
                  key={post._id}
                >
                  <div className="relative aspect-square">
                    <img
                      className={
                        isLoading
                          ? `w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0`
                          : "hidden"
                      }
                      src={isLoading ? loading : ""}
                      alt=""
                    />
                    <img
                      className="aspect-square object-cover w-full rounded-sm"
                      src={post.fileUrl}
                      alt=""
                      loading="lazy"
                      onLoad={handlePostImageLoad}
                    />
                  </div>
                  <div className="flex flex-col justify-between gap-3">
                    <p className="text-sm">{post.caption}</p>
                    {post.user?.hasProducts && (
                      <div className="ml-auto">
                        <NavLink
                          className="btn-outline-dark text-xs text-center group rounded-full flex items-center gap-1.5"
                          to={`/shop/${post.user._id}`}
                        >
                          @{post.user.userName}
                          <svg
                            className="w-4 h-4"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              className="group-hover:stroke-white"
                              d="M20.25 6.75H3.75C3.33579 6.75 3 7.08579 3 7.5V19.5C3 19.9142 3.33579 20.25 3.75 20.25H20.25C20.6642 20.25 21 19.9142 21 19.5V7.5C21 7.08579 20.6642 6.75 20.25 6.75Z"
                              stroke="#171717"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              className="group-hover:stroke-white"
                              d="M8.25 6.75C8.25 5.75544 8.64509 4.80161 9.34835 4.09835C10.0516 3.39509 11.0054 3 12 3C12.9946 3 13.9484 3.39509 14.6517 4.09835C15.3549 4.80161 15.75 5.75544 15.75 6.75"
                              stroke="#171717"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                        </NavLink>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        ) : noPosts ? (
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
            No posts.
          </p>
        ) : (
          <img
            className="w-6 h-6 absolute inset-1/2 -translate-x-1/2 -translate-y-1/2"
            src={loading}
            alt=""
          />
        )}
      </section>
      <CreatePostModal
        isShowModal={showModal}
        isPostImage={postImage}
        isImageBase64={imageBase64}
        onToggleModal={handleToggleModal}
      />
      {token && (
        <div className="fixed bottom-0 right-0 left-0 px-4 py-3.5 pointer-events-none">
          <div className="max-w-[908px] flex flex-col justify-center items-center gap-3.5 mx-auto">
            <img
              className="rounded-full w-10 h-10 object-cover border border-dark/30 shadow-md"
              src={userState.avatar64 ? userState.avatar64 : defaultAvatar}
              alt=""
            />
            <Form className="flex flex-col pointer-events-auto">
              <Form.Label className="m-0" htmlFor="file-upload">
                <div className="btn-primary rounded-full text-sm flex gap-2 justify-center items-center cursor-pointer">
                  Create post
                </div>
              </Form.Label>
              <Form.Group className="hidden">
                <Form.Control
                  id="file-upload"
                  type="file"
                  name="image"
                  accept=".jpeg, .png, .jpg"
                  onChange={(e) => handleFileUpload(e)}
                />
              </Form.Group>
            </Form>
          </div>
        </div>
      )}
    </>
  );
}
