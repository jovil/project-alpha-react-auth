import { useState, useEffect, useCallback } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { getFetchConfig } from "../../utils/fetchConfig";
import defaultAvatar from "../../assets/images/toon_6.png";

const UserNavigation = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const { userState } = useUser();
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
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs flex flex-col items-center gap-3">
        <img
          className="h-9 w-9 rounded-full object-cover"
          src={user?.avatar || defaultAvatar}
          alt=""
        />
        <div className="relative">
          <nav className="bg-white rounded-full shadow-nav p-2 pointer-events-auto">
            <ul className="flex items-center gap-1">
              <li>
                <NavLink
                  className={({ isActive }: { isActive: any }) =>
                    isActive
                      ? "nav-button rounded-full text-sm flex items-center"
                      : "text-sm px-5 py-2 flex items-center text-black-200"
                  }
                  to={`/user/${user?.userName}`}
                  state={{ userId: user?._id }}
                >
                  Profile
                </NavLink>
              </li>
              {(userState?._id === user?._id || user?.postCount > 0) && (
                <li>
                  <NavLink
                    className={({ isActive }: { isActive: any }) =>
                      isActive
                        ? "nav-button rounded-full text-sm flex items-center"
                        : "text-sm px-5 py-2 flex items-center text-black-200"
                    }
                    to={`/posts/${user?.userName}`}
                    state={{ userId: user?._id }}
                  >
                    Posts
                  </NavLink>
                </li>
              )}
              {(userState?._id === user?._id || user?.productCount > 0) && (
                <li>
                  <NavLink
                    className={({ isActive }: { isActive: any }) =>
                      isActive
                        ? "nav-button rounded-full text-sm flex items-center"
                        : "text-sm px-5 py-2 flex items-center text-black-200"
                    }
                    to={`/shop/${user?.userName}`}
                    state={{ userId: user?._id }}
                  >
                    Shop
                  </NavLink>
                </li>
              )}
              {user?.hasHiringDetails && (
                <li>
                  <NavLink
                    to={`/hire/${user.userName}`}
                    state={{ userId: user?._id }}
                    className={({ isActive }: { isActive: any }) =>
                      isActive
                        ? "nav-button rounded-full text-sm flex items-center"
                        : "text-sm px-5 py-2 flex items-center text-black-200"
                    }
                  >
                    Hire {user.userName}
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default UserNavigation;
