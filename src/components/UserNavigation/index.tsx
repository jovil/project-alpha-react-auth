import { useState, useEffect, useCallback } from "react";
import { useParams, NavLink, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import CreatePost from "../../components/CreatePost";
import { getFetchConfig } from "../../utils/fetchConfig";

const UserNavigation = () => {
  const { userId } = useParams();
  const { userState } = useUser();
  const [user, setUser] = useState<Record<string, any | null>>();
  const location = useLocation();

  const fetchUser = useCallback(async () => {
    console.log("user", userId);
    const url = `${process.env.REACT_APP_API_URL}/user/${userId}`;
    try {
      const response = await fetch(url, getFetchConfig);
      const result = await response.json();
      setUser(result);
      console.log("result", result);
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
          src={user?.avatar}
          alt=""
        />
        <div className="relative">
          <nav className="bg-white rounded-full shadow-nav p-2 pointer-events-auto">
            <ul className="flex items-center">
              <li>
                <NavLink
                  className={({ isActive }: { isActive: any }) =>
                    isActive
                      ? "nav-button rounded-full text-sm flex items-center"
                      : "text-sm px-5 py-2 flex items-center text-black-200"
                  }
                  to={`/user/${user?._id}`}
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }: { isActive: any }) =>
                    isActive
                      ? "nav-button rounded-full text-sm flex items-center"
                      : "text-sm px-5 py-2 flex items-center text-black-200"
                  }
                  to={`/posts/${user?._id}`}
                >
                  Posts
                </NavLink>
              </li>
              {user?.hasHiringDetails && (
                <li>
                  <NavLink
                    to={`/hire/${user._id}`}
                    className={({ isActive }: { isActive: any }) =>
                      isActive
                        ? "nav-button rounded-full text-sm flex items-center"
                        : "text-sm px-5 py-2 flex items-center text-black-200"
                    }
                  >
                    Hire
                  </NavLink>
                </li>
              )}

              {user?.hasProducts && (
                <li>
                  <NavLink
                    className={({ isActive }: { isActive: any }) =>
                      isActive
                        ? "nav-button rounded-full text-sm flex items-center"
                        : "text-sm px-5 py-2 flex items-center text-black-200"
                    }
                    to={`/shop/${user._id}`}
                  >
                    Shop
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
          {userState._id === userId && location.pathname.includes("posts") && (
            <CreatePost
              title={
                <svg
                  className="h-4 w-4"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3V21"
                    stroke="#5D5A88"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3 12H21"
                    stroke="#5D5A88"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              }
              classes={
                "absolute top-1/2 -translate-y-1/2 -right-2 translate-x-full"
              }
              btnClasses="bg-white rounded-full p-4 shadow-nav"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UserNavigation;
