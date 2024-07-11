import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import HeaderSection from "./HeaderSection";
import CreateProduct from "./CreateProduct";
import ProductListComponent from "./ProductListComponent";

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
    const configuration = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const fetchProfile = async () => {
      try {
        const response = await fetch(url, configuration);
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
      {profileId === userState._id && <CreateProduct />}
      <ProductListComponent />
    </>
  );
};

export default UserShopPage;
