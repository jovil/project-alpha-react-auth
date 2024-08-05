import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import HeaderSection from "./HeaderSection";
import UserNavigation from "../../components/UserNavigation";
import { apiUrl } from "../../utils/fetchConfig";
import { getFetchConfig } from "../../utils/fetchConfig";
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
  const { userId } = useParams();
  const { userState, setUserState } = useUser();
  const [user, setUser] = useState<{
    profileName: string;
    email: string;
    hasHiringDetails: boolean;
  }>({
    profileName: "",
    email: "",
    hasHiringDetails: false,
  });
  const [posts, setPosts] = useState<Posts[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

  const fetchUser = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/user/${userId}`;
    try {
      const response = await fetch(url, getFetchConfig);
      const result = await response.json();
      setUserState((prevState: any) => {
        return {
          ...prevState,
          profileDescription: result.profileDescription,
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
  }, [fetchProducts, userState.productCount]);

  return (
    <>
      <HeaderSection isUser={user} isLoadingAvatar={isLoadingAvatar} />
      <div className="max-w-[1140px] py-16 mx-auto grid grid-cols-12 gap-4 h-full flex-grow">
        <section className="flex flex-col gap-4 px-4 col-span-5">
          <header className="flex justify-between items-end">
            <h2>Products</h2>
            {products.length > 0 && (
              <NavLink
                className="text-sm text-blue-100 underline"
                to={`/shop/${userId}`}
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
                  <Card data={product} />
                </React.Fragment>
              );
            })}

            {products.length === 0 && (
              <div className="rounded-md bg-dark/5 px-4 py-20 flex justify-center items-center">
                No products found
              </div>
            )}
          </div>
        </section>

        <section className="px-4 col-span-7 flex flex-col gap-4">
          <header className="flex justify-between items-end">
            <h2>Posts</h2>

            {posts.length > 0 && (
              <NavLink
                className="text-sm text-blue-100 underline"
                to={`/posts/${userId}`}
              >
                See all posts
              </NavLink>
            )}
          </header>
          <div className="flex flex-col gap-3">
            {posts.map((post: any, index: number) => {
              return (
                <React.Fragment key={index}>
                  <Card data={post} />
                </React.Fragment>
              );
            })}

            {posts.length === 0 && (
              <div className="rounded-md bg-dark/5 px-4 py-20 flex justify-center items-center">
                No posts found
              </div>
            )}
          </div>
        </section>
      </div>
      <UserNavigation />
    </>
  );
};

export default UserPostListPage;
