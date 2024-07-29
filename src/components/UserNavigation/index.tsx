import { useState, useEffect, useCallback } from "react";
import { useParams, NavLink, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import CreatePost from "../../components/CreatePost";
import { getFetchConfig } from "../../utils/fetchConfig";
import CreateProductModal from "../CreateProduct/modal";
import { AnimatePresence } from "framer-motion";

const UserNavigation = () => {
  const { userId } = useParams();
  const { userState } = useUser();
  const [user, setUser] = useState<Record<string, any | null>>();
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  const fetchUser = useCallback(async () => {
    console.log("user", userId);
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

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  const handleToggleModal = (e: any) => {
    if (e.target !== e.currentTarget) return;
    setShowModal((prevState) => !prevState);
  };

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
            <ul className="flex items-center gap-1">
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
                    to={`/shop/${user?._id}`}
                  >
                    Shop
                  </NavLink>
                </li>
              )}
              {userState?._id === userId &&
                location.pathname.includes("posts") && (
                  <li>
                    <CreatePost btnClasses="text-sm text-blue-200 px-5 py-2 bg-blue-800 rounded-full" />
                  </li>
                )}
              {userState?._id === userId &&
                location.pathname.includes("shop") && (
                  <li>
                    <button
                      className="text-sm text-blue-200 px-5 py-2 bg-blue-800 rounded-full cursor-pointer"
                      onClick={handleToggleModal}
                    >
                      Create product
                    </button>
                  </li>
                )}
            </ul>
          </nav>
        </div>
      </div>
      {userState?._id === userId && location.pathname.includes("shop") && (
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => null}
        >
          {showModal && (
            <CreateProductModal onToggleModal={handleToggleModal} />
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default UserNavigation;
