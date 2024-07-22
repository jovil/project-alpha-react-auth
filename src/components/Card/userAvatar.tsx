import { NavLink } from "react-router-dom";
import defaultAvatar from "../../assets/images/toon_6.png";

const UserAvatar = ({ data }: { data: any }) => {
  return (
    <>
      <div className="flex">
        <NavLink
          className="flex gap-2 items-center"
          to={`/user/${data.user?._id || data._id}`}
        >
          <img
            className="rounded-full w-7 h-7 object-cover"
            src={
              data.user?.avatar || data.avatar
                ? data.user?.avatar || data.avatar
                : defaultAvatar
            }
            alt=""
          />
          <p className="text-sm underline">
            @{data.user?.userName || data.userName}
          </p>
        </NavLink>
      </div>
    </>
  );
};

export default UserAvatar;
