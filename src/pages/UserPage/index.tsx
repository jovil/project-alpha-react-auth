import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
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
      setUser(result);
      setIsLoadingAvatar(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, [userId, setUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const fetchPosts = useCallback(async () => {
    const url = `${apiUrl}/posts/${userId}?limit=4`;
    try {
      const response = await fetch(url, getFetchConfig);
      const result: Posts[] = await response.json();
      setPosts(result);
      console.log("result", result);
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
  }, [fetchProducts]);

  return (
    <>
      <HeaderSection isUser={user} isLoadingAvatar={isLoadingAvatar} />
      <div className="max-w-[1140px] mx-auto grid grid-cols-12 gap-4 h-full flex-grow">
        <div className="flex flex-col items-center px-4 col-span-5">
          <section>
            <header>
              <h2>Products</h2>
            </header>
            <div className="grid gap-3 tablet:grid-cols-2">
              {products.map((product: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    <Card data={product} />
                  </React.Fragment>
                );
              })}
            </div>
          </section>
        </div>

        <div className="px-8 col-span-7 flex flex-col items-center">
          <section>
            <header>
              <h2>Posts</h2>
            </header>
            <div className="flex flex-col gap-3">
              {posts.map((post: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    <Card data={post} />
                  </React.Fragment>
                );
              })}
            </div>
          </section>
        </div>
      </div>
      <UserNavigation />
    </>
  );
};

export default UserPostListPage;
