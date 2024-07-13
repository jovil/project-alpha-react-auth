import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeaderSection from "./HeaderSection";

const UserPostListPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<{
    profileName: string;
    email: string;
  }>({
    profileName: "",
    email: "",
  });
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}/user/${userId}`;
    const configuration = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const fetchUser = async () => {
      try {
        const response = await fetch(url, configuration);
        const result = await response.json();
        setUser(result);
        setIsLoadingAvatar(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUser();
  }, [userId, setUser]);

  return (
    <>
      <HeaderSection isUser={user} isLoadingAvatar={isLoadingAvatar} />
    </>
  );
};

export default UserPostListPage;
