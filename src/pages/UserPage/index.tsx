import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import HeaderSection from "./HeaderSection";
import UserNavigation from "../../components/UserNavigation";
import { getFetchConfig } from "../../utils/fetchConfig";

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

  return (
    <>
      <HeaderSection isUser={user} isLoadingAvatar={isLoadingAvatar} />
      My page
      <UserNavigation />
    </>
  );
};

export default UserPostListPage;
