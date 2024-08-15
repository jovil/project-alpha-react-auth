import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import UserNavigation from "../../components/UserNavigation";
import UserProfile from "../UserProfile";
import UserPosts from "../UserPosts";
import UserShop from "../UserShop";
import UserTalent from "../UserTalent";
import { apiUrl, getFetchConfig } from "../../utils/fetchConfig";
import loadingImage from "../../assets/images/loading.gif";

const User = () => {
  const location = useLocation();
  const pathUrl = location.pathname.split("/")[1];
  const { userId } = location.state || {};
  const { setUserState } = useUser();
  const [user, setUser] = useState<Record<string, any>>();
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const url = `${apiUrl}/user/${userId}`;
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }

    // eslint-disable-next-line
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
          {pathUrl === "user" && <UserProfile isUser={user} />}
          {pathUrl === "posts" && <UserPosts isUser={user} />}
          {pathUrl === "shop" && <UserShop isUser={user} />}
          {pathUrl === "talent" && <UserTalent isUser={user} />}
        </>
      )}
      <UserNavigation />
    </>
  );
};

export default User;
