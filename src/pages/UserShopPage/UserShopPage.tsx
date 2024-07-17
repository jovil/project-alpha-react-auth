import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import HeaderSection from "./HeaderSection";
import CreateProductComponent from "../../components/CreateProductComponent";
import ProductListComponent from "./ProductListComponent";
import { getFetchConfig } from "../../utils/fetchConfig";

const UserShopPage = () => {
  const { userState } = useUser();
  const { profileId } = useParams();
  const [profile, setProfile] = useState<{
    profileName: string;
    email: string;
  }>({
    profileName: "",
    email: "",
  });
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}/user/${profileId}`;

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
  }, [profileId, setProfile]);

  useEffect(() => {}, [profile]);

  return (
    <>
      <HeaderSection
        profileHeader={profile}
        profileLoadingAvatar={isLoadingAvatar}
      />
      {profileId === userState._id && <CreateProductComponent />}
      <ProductListComponent isUser={profile} />
    </>
  );
};

export default UserShopPage;
