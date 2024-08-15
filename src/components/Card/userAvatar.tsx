import { NavLink } from "react-router-dom";
import defaultAvatar from "../../assets/images/toon_6.png";

const UserAvatar = ({ user }: { user: Record<string, any> | undefined }) => {
  return (
    <>
      <div className="flex">
        <NavLink
          className="flex gap-2 items-center"
          to={`/user/${user?.userName?.toLowerCase()}`}
          state={{ userId: user?._id }}
        >
          <img
            className="rounded-full w-7 h-7 object-cover"
            src={user?.avatar ? user.avatar : defaultAvatar}
            alt=""
          />
          <p className="text-sm font-bold underline">@{user?.userName}</p>
        </NavLink>
      </div>
    </>
  );
};

export default UserAvatar;
