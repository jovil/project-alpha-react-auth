import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import HeaderSection from "./HeaderSection";
import CreateProductComponent from "../../components/CreateProduct/CreateProductComponent";
import Grid from "./Grid";
import { getFetchConfig } from "../../utils/fetchConfig";
import UserNavigation from "../../components/UserNavigation";

const UserShopPage = () => {
  const { userState } = useUser();
  const { userId } = useParams();
  const [profile, setProfile] = useState<{
    profileName: string;
    email: string;
  }>({
    profileName: "",
    email: "",
  });
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}/user/${userId}`;

    const fetchProfile = async () => {
      try {
        const response = await fetch(url, getFetchConfig);
        const result = await response.json();
        setProfile(result);
        setIsLoadingAvatar(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId, setProfile]);

  return (
    <>
      <HeaderSection
        isProfile={profile}
        profileLoadingAvatar={isLoadingAvatar}
      />
      {userId === userState?._id && (
        <CreateProductComponent alignButton={"right"} />
      )}
      <Grid isUser={profile} />
      <UserNavigation />
    </>
  );
};

export default UserShopPage;
