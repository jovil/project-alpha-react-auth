import UserNavigation from "../../components/UserNavigation";
import { useLocation } from "react-router-dom";
import UserProfile from "../UserProfile";
import UserPosts from "../UserPosts";
import UserShop from "../UserShop";
import UserTalent from "../UserTalent";

const User = () => {
  const location = useLocation();
  const pathUrl = location.pathname.split("/")[1];

  return (
    <>
      {pathUrl === "user" && <UserProfile />}
      {pathUrl === "posts" && <UserPosts />}
      {pathUrl === "shop" && <UserShop />}
      {pathUrl === "talent" && <UserTalent />}
      <UserNavigation />
    </>
  );
};

export default User;
