import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Grid from "./Grid";
import { getFetchConfig } from "../../utils/fetchConfig";
import UserNavigation from "../../components/UserNavigation";

const UserPostsPage = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [user, setUser] = useState<Record<string, any | null>>();

  const fetchUser = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/user/${userId}`;
    try {
      const response = await fetch(url, getFetchConfig);
      const result = await response.json();
      setUser(result);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, [userId, setUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <Grid isUser={user} />
      <UserNavigation />
    </>
  );
};

export default UserPostsPage;
