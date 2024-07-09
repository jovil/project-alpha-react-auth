import { useEffect, useCallback } from "react";
import { useUser } from "../Context/UserContext";
import HeaderSection from "./HeaderSection";
import CreatePost from "./CreatePost";
import CreateProduct from "./CreateProduct";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const AuthComponent = () => {
  const { userState, setUserState } = useUser();
  const apiUrl = process.env.REACT_APP_API_URL;
  const authUrl = `${apiUrl}/auth-endpoint/${userState._id}`;

  const fetchUserData = useCallback(async () => {
    const token = cookies.get("TOKEN");

    // set configurations for the API call here
    const authConfiguration = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await fetch(authUrl, authConfiguration);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [authUrl, setUserState]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <>
      <HeaderSection />
      <section className="flex justify-center gap-6 py-16">
        <CreatePost />
        <CreateProduct />
      </section>
    </>
  );
};

export default AuthComponent;
