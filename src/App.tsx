import { useContext, useState, useRef, useEffect } from "react";
import { useLocation, Routes, Route, NavLink } from "react-router-dom";
import { GlobalStateContext } from "./context/Context";
import { useUser } from "./context/UserContext";
import Home from "./pages/HomePage/Home";
import ProtectedRoutes from "./ProtectedRoutes";
import "./App.css";
import Register from "./pages/RegisterPage/RegisterPage";
import Login from "./pages/LoginPage/Login";
import Cookies from "universal-cookie";
import UserShopPage from "./pages/UserShopPage/index";
import ShopPage from "./pages/ShopPage/ShopPage";
import UserPage from "./pages/UserPage";
import SeriesPage from "./pages/SeriesPage/SeriesPage";
import HiringPage from "./pages/HiringPage/HiringPage";
import SeriesListPage from "./pages/SeriesListPage";
import { AnimatePresence } from "framer-motion";
import UserPostsPage from "./pages/UserPostsPage/index";
import UserHirePage from "./pages/UserHirePage/index";
import CreatePost from "./components/CreatePost";
import CreatePostModal from "./components/CreatePost/modal";
import useFileUpload from "./hooks/useFileUpload";
import CreateProduct from "./components/CreateProduct";
import CreateProductModal from "./components/CreateProduct/modal";
import useCreateProduct from "./hooks/useCreateProduct";
import SearchModal from "./components/SearchModal";

function App() {
  const cookies = new Cookies();
  const { state } = useContext(GlobalStateContext);
  const { userState } = useUser();
  const location = useLocation();
  const token = cookies.get("TOKEN");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);
  const [isPastHeader, setIsPastHeader] = useState<boolean>(false);
  const headerRef = useRef<any>(null);
  const menuDropdownRef = useRef<any>(null);
  const createDropdownRef = useRef<any>(null);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const headerHeight = headerRef.current.clientHeight;
    if (currentScrollY > lastScrollY) {
      setIsScrollingDown(true);
    } else {
      setIsScrollingDown(false);
    }

    if (currentScrollY > headerHeight) {
      setIsPastHeader(true);
    } else {
      setIsPastHeader(false);
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

    // eslint-disable-next-line
  }, [lastScrollY]);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      createDropdownRef.current &&
      !createDropdownRef.current?.contains(e.target as Node)
    ) {
      setShowCreateDropdown(false);
    }

    if (
      menuDropdownRef.current &&
      !menuDropdownRef.current?.contains(e.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const {
    showModal,
    postImage,
    imageBase64,
    handleFileUpload,
    handleTogglePostModal,
  } = useFileUpload();
  const { isShowModal, handleToggleCreateProductModal } = useCreateProduct();

  const onToggleMenuDropdown = () => {
    setShowDropdown((prevState: boolean) => !prevState);
  };

  const onToggleSearchModal = () => {
    setShowSearchModal((prevState: boolean) => !prevState);
  };

  const onShowSearchModal = () => {
    setShowSearchModal((prevState: boolean) => !prevState);
  };

  const handleCreateDropdown = () => {
    setShowCreateDropdown((prevState: boolean) => !prevState);
  };

  return (
    <>
      <header
        className={`bg-white sticky top-0 z-20 py-3.5 transition ${
          isScrollingDown ? "is-hidden" : ""
        } ${isPastHeader ? "shadow-nav" : ""}`}
        ref={headerRef}
      >
        <div className="container relative">
          <SearchModal
            onToggleSearchModal={onToggleSearchModal}
            onShowSearchModal={onShowSearchModal}
            isShowSearchModal={showSearchModal}
          />
          <div className="flex justify-between gap-4 w-full">
            <nav>
              <ul className="flex items-center gap-1">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }: { isActive: any }) =>
                      isActive
                        ? "nav-button rounded-full text-sm flex items-center"
                        : "text-sm px-5 py-2 flex items-center text-black-200"
                    }
                  >
                    Discover
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    end
                    to="/shop"
                    className={({ isActive }: { isActive: any }) =>
                      isActive
                        ? "nav-button rounded-full text-sm flex items-center"
                        : "text-sm px-5 py-2 flex items-center text-black-200"
                    }
                  >
                    Shop
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    end
                    to="/hirecosplayer"
                    className={({ isActive }: { isActive: any }) =>
                      isActive
                        ? "nav-button rounded-full text-sm flex items-center"
                        : "text-sm px-5 py-2 flex items-center text-black-200"
                    }
                  >
                    Hire cosplayer
                  </NavLink>
                </li>
              </ul>
            </nav>

            <div className="flex gap-4 items-center">
              <button className="text-blue" onClick={onToggleSearchModal}>
                <svg
                  className="h-4 w-4 stroke-blue-100"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.8889 19.7778C15.7981 19.7778 19.7778 15.7981 19.7778 10.8889C19.7778 5.97969 15.7981 2 10.8889 2C5.97969 2 2 5.97969 2 10.8889C2 15.7981 5.97969 19.7778 10.8889 19.7778Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22.0003 22.0003L17.167 17.167"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {token && (
                <>
                  <div className="relative" ref={menuDropdownRef}>
                    <button
                      className="text-xs btn-outline-dark shadow-none border-grey text-blue-100 hover:bg-blue-900 hover:text-blue-100"
                      onClick={onToggleMenuDropdown}
                    >
                      <div className="flex items-center gap-1">
                        @{userState.userName}
                        <svg
                          className={`w-3 h-3 transition-transform ${
                            showDropdown ? "rotate-180" : ""
                          }`}
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.02701 8.15332L2.66701 10.5133L16 23.8473L29.333 10.5133L26.973 8.15332L16 19.1273L5.02701 8.15332Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </button>
                    {showDropdown && (
                      <div className="min-w-32 p-1.5 bg-white shadow-nav rounded-md absolute top-full right-0 translate-y-3 flex flex-col gap-1 z-10">
                        <ul>
                          <li className="flex">
                            <NavLink
                              className="text-xs px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap w-full"
                              to={`/user/${userState._id}`}
                              onClick={onToggleMenuDropdown}
                            >
                              Profile
                            </NavLink>
                          </li>
                          <li className="flex">
                            <NavLink
                              className="text-xs px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap w-full"
                              to={`/posts/${userState._id}`}
                              onClick={onToggleMenuDropdown}
                            >
                              Posts
                            </NavLink>
                          </li>
                          {userState?.productCount > 0 && (
                            <li className="flex">
                              <NavLink
                                className="text-xs px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap w-full"
                                to={`/shop/${userState._id}`}
                                onClick={onToggleMenuDropdown}
                              >
                                Shop
                              </NavLink>
                            </li>
                          )}
                          {userState.hasHiringDetails && (
                            <li className="flex">
                              <NavLink
                                className="text-xs px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap w-full"
                                to={`/hire/${userState._id}`}
                                onClick={onToggleMenuDropdown}
                              >
                                Book me
                              </NavLink>
                            </li>
                          )}
                        </ul>
                        <hr className="h-[1px] bg-grey border-none" />
                        <ul>
                          <li className="flex">
                            <NavLink
                              to="/auth"
                              className="text-xs px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap w-full"
                              onClick={onToggleMenuDropdown}
                            >
                              Account
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={createDropdownRef}>
                    <button
                      className="btn-primary p-2 shadow-none"
                      onClick={handleCreateDropdown}
                    >
                      <svg
                        className={`text-white h-4 w-4 transition-transform ${
                          showCreateDropdown ? "rotate-45" : ""
                        }`}
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 3V21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 12H21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {showCreateDropdown && (
                      <ul className="p-1.5 bg-white shadow-nav rounded-md absolute top-full right-0 translate-y-3 flex flex-col gap-1">
                        {userState?._id && (
                          <li>
                            <CreatePost
                              btnClasses="text-xs px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap"
                              onFileUpload={handleFileUpload}
                            />
                          </li>
                        )}
                        {userState?._id && (
                          <li>
                            <CreateProduct
                              btnClasses="text-xs px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap"
                              onToggleModal={handleToggleCreateProductModal}
                            />
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </>
              )}
              {!token && (
                <>
                  {!state.isLoggedIn ? (
                    <>
                      <>
                        {location.pathname !== "/login" && (
                          <NavLink
                            to="/login"
                            className={({ isActive }: { isActive: any }) =>
                              isActive
                                ? "btn-outline-dark text-xs font-semibold border-[#dadce0] text-blue-100 hover:text-blue-100 hover:bg-blue-900 shadow-none"
                                : "btn-outline-dark text-xs font-semibold border-[#dadce0] text-blue-100 hover:text-blue-100 hover:bg-blue-900 shadow-none"
                            }
                          >
                            Login
                          </NavLink>
                        )}
                      </>
                      {location.pathname !== "/register" && (
                        <NavLink
                          to="/register"
                          className={({ isActive }: { isActive: any }) =>
                            isActive
                              ? "btn-primary text-xs font-semibold"
                              : "btn-primary bg-blue-100 border-blue-100 text-white shadow-none hover:bg-blue-300 hover:border-blue-300 text-xs font-semibold"
                          }
                        >
                          Register
                        </NavLink>
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="py-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<ProtectedRoutes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path={`/shop/:userId`} element={<UserShopPage />} />
          <Route path={`/user/:userId`} element={<UserPage />} />
          <Route path={`/posts/:userId`} element={<UserPostsPage />} />
          <Route path={`/hire/:userId`} element={<UserHirePage />} />
          <Route path={`/series/:seriesTitle`} element={<SeriesPage />} />
          <Route path={`/shop`} element={<ShopPage />} />
          <Route path={`/hirecosplayer`} element={<HiringPage />} />
          <Route path={`/series`} element={<SeriesListPage />} />
        </Routes>

        <CreatePostModal
          isShowModal={showModal}
          isPostImage={postImage}
          isImageBase64={imageBase64}
          onToggleModal={handleTogglePostModal}
        />
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => null}
        >
          {isShowModal && (
            <CreateProductModal
              onToggleModal={handleToggleCreateProductModal}
            />
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
