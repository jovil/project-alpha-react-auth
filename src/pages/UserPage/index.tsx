import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import HeaderSection from "./HeaderSection";
import UserNavigation from "../../components/UserNavigation";
import { apiUrl } from "../../utils/fetchConfig";
import { getFetchConfig } from "../../utils/fetchConfig";
import Card from "../../components/Card";
import ProductCard from "../../components/ProductCard";
import loadingImage from "../../assets/images/loading.gif";
import SadFace from "../../assets/images/sad-face.svg";
import CreatePostModal from "../../components/CreatePost/modal";
import useFileUpload from "../../hooks/useFileUpload";
import { AnimatePresence } from "framer-motion";
import CreateProductModal from "../../components/CreateProduct/modal";
import useCreateProduct from "../../hooks/useCreateProduct";

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

interface Product {
  _id: string;
  user: string;
  fileUrl: string[];
  productName: string;
  productDescription: string;
  productPrice: string;
  paymentLink: string;
}

const UserPostListPage = () => {
  const { userName } = useParams();
  const location = useLocation();
  const { userId } = location.state || {};
  const { userState, setUserState } = useUser();
  const { isShowModal, handleToggleCreateProductModal } = useCreateProduct();
  const [user, setUser] = useState<{
    userName: string;
    email: string;
  }>({
    userName: "",
    email: "",
  });
  const [posts, setPosts] = useState<Posts[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);
  const [loading, setLoading] = useState(true);
  const {
    showModal,
    postImage,
    imageBase64,
    handleFileUpload,
    handleTogglePostModal,
  } = useFileUpload();

  const fetchUser = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/user/${userId}`;
    try {
      const response = await fetch(url, getFetchConfig);
      const result = await response.json();
      setUserState((prevState: any) => {
        return {
          ...prevState,
          profileDescription: result?.profileDescription,
        };
      });
      setUser(result);
      setIsLoadingAvatar(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const fetchPosts = useCallback(async () => {
    const url = `${apiUrl}/posts/${userId}?limit=4`;
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
  }, [fetchPosts]);

  const fetchProducts = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/products/${userId}?limit=4`;

    try {
      const response = await fetch(url, getFetchConfig);
      const result: Product[] = await response.json();

      // Ensure result is an array and contains the expected fields
      if (Array.isArray(result)) {
        setProducts(result);
      } else {
        console.error("Unexpected API response:", result);
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, userState?.productCount]);

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
          <HeaderSection isUser={user} isLoadingAvatar={isLoadingAvatar} />
          <div className="max-w-[1140px] py-16 mx-auto grid grid-cols-12 gap-4 h-full flex-grow w-full">
            <section className="flex flex-col gap-4 px-4 col-span-5">
              <header className="flex justify-between items-end">
                <h2 className="font-bold tracking-wide uppercase text-sm">
                  Products
                </h2>
                {products.length > 0 && (
                  <NavLink
                    className="font-bold text-sm text-blue-100 underline"
                    to={`/shop/${user && user?.userName.toLowerCase()}`}
                    state={{ userId: userId }}
                  >
                    Go to shop
                  </NavLink>
                )}
              </header>
              <div
                className={`${
                  products.length > 0 ? "grid gap-3 tablet:grid-cols-2" : ""
                }`}
              >
                {products.map((product: any, index: number) => {
                  return (
                    <React.Fragment key={index}>
                      <ProductCard data={product} />
                    </React.Fragment>
                  );
                })}

                {products.length === 0 && (
                  <>
                    {userState?._id === userId ? (
                      <>
                        <section className="flex justify-center items-center flex-grow">
                          <div className="bg-dark/5 w-full flex flex-col border border-dashed border-dark/60 rounded pointer-events-auto">
                            <div
                              className="p-16 m-0 cursor-pointer"
                              onClick={handleToggleCreateProductModal}
                            >
                              <div className="flex flex-col justify-center items-center gap-4">
                                <img
                                  className="h-16 w-16"
                                  src={SadFace}
                                  alt=""
                                />
                                <div className="flex flex-col items-center gap-6">
                                  <p>You don't have any products.</p>
                                  <div className="btn-chunky-primary">
                                    Create a product
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                        <AnimatePresence
                          initial={false}
                          mode="wait"
                          onExitComplete={() => null}
                        >
                          {isShowModal && (
                            <CreateProductModal
                              onToggleModal={handleToggleCreateProductModal}
                            />
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <>
                        <div className="rounded-md bg-dark/5 px-4 py-20 flex justify-center items-center">
                          No products found
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </section>

            <section className="px-4 col-span-7 flex flex-col gap-4">
              <header className="flex justify-between items-end">
                <h2 className="font-bold tracking-wide uppercase text-sm">
                  Posts
                </h2>
                {posts.length > 0 && (
                  <NavLink
                    className="font-bold text-sm text-blue-100 underline"
                    to={`/posts/${userName?.toLowerCase()}`}
                    state={{ userId: userId }}
                  >
                    See all posts
                  </NavLink>
                )}
              </header>
              <div className="flex flex-col gap-3 gap-y-9">
                {posts?.map((post: any, index: number) => {
                  return (
                    <div
                      className="bg-white p-4 flex flex-col gap-4 relative group overflow-hidden rounded-xl shadow-chunky"
                      key={index}
                    >
                      <Card data={post} />
                    </div>
                  );
                })}
                <>
                  {posts.length === 0 && (
                    <>
                      {userState?._id === userId ? (
                        <>
                          <section className="flex justify-center items-center flex-grow">
                            <form className="bg-dark/5 w-full flex flex-col border border-dashed border-dark/60 rounded pointer-events-auto">
                              <label
                                className="p-16 m-0 cursor-pointer"
                                htmlFor="file-upload"
                              >
                                <div className="flex flex-col justify-center items-center gap-4">
                                  <img
                                    className="h-16 w-16"
                                    src={SadFace}
                                    alt=""
                                  />
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
                          </section>
                          <CreatePostModal
                            isShowModal={showModal}
                            isPostImage={postImage}
                            isImageBase64={imageBase64}
                            onToggleModal={handleTogglePostModal}
                          />
                        </>
                      ) : (
                        <>
                          <div className="rounded-md bg-dark/5 px-4 py-20 flex justify-center items-center">
                            No posts found
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              </div>
            </section>
          </div>
          <UserNavigation />
        </>
      )}
    </>
  );
};

export default UserPostListPage;
