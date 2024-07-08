import { useEffect, useState } from "react";
import { useUser } from "../Context/UserContext";
import { useParams } from "react-router-dom";
import HeaderSection from "./HeaderSection";
import CreateProduct from "./CreateProduct";

const UserShopPage = () => {
  const { userState, setUserState } = useUser();
  const { userId } = useParams();
  const [profile, setProfile] = useState({
    avatar: "",
    user: "",
  });
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}/profile`;
    const configuration = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${url}/${userId}`, configuration);
        const result = await response.json();
        setProfile(result);
        setIsLoadingAvatar(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId, setProfile]);

  useEffect(() => {
    console.log("profile", profile);
  }, [profile]);

  return (
    <>
      <HeaderSection
        profileHeader={profile}
        profileLoadingAvatar={isLoadingAvatar}
      />
      {userId === userState._id && <CreateProduct />}
    </>
  );
};

export default UserShopPage;
