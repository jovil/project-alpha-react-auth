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
import TalentPage from "./pages/TalentPage";
import SeriesListPage from "./pages/SeriesListPage";
import { AnimatePresence } from "framer-motion";
import UserPostsPage from "./pages/UserPostsPage/index";
import UserTalentPage from "./pages/UserTalentPage/index";
import CreatePost from "./components/CreatePost";
import CreatePostModal from "./components/CreatePost/modal";
import useFileUpload from "./hooks/useFileUpload";
import CreateProduct from "./components/CreateProduct";
import CreateProductModal from "./components/CreateProduct/modal";
import useCreateProduct from "./hooks/useCreateProduct";
import SearchModal from "./components/SearchModal";
import DiscoverPage from "./pages/DiscoverPage";

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
    const headerHeight = headerRef.current?.clientHeight;
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
        className={`bg-white sticky top-0 z-20 py-4 transition ${
          isScrollingDown ? "is-hidden" : ""
        } ${isPastHeader ? "border-b-2 border-[#444] shadow-nav" : ""}`}
        ref={headerRef}
      >
        <div className="container relative">
          <SearchModal
            onToggleSearchModal={onToggleSearchModal}
            onShowSearchModal={onShowSearchModal}
            isShowSearchModal={showSearchModal}
          />
          <div className="grid grid-cols-12 items-center gap-4 w-full">
            <nav className="col-span-5">
              <ul className="flex items-center gap-2">
                <li>
                  <NavLink
                    to="/discover"
                    className={({ isActive }: { isActive: any }) =>
                      isActive
                        ? "font-bold px-6 py-2 flex items-center text-blue-100"
                        : "font-bold px-6 py-2 flex items-center text-dark"
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
                        ? "font-bold px-6 py-2 flex items-center text-blue-100"
                        : "font-bold px-6 py-2 flex items-center text-dark"
                    }
                  >
                    Shop
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    end
                    to="/talent"
                    className={({ isActive }: { isActive: any }) =>
                      isActive
                        ? "font-bold px-6 py-2 flex items-center text-blue-100"
                        : "font-bold px-6 py-2 flex items-center text-dark"
                    }
                  >
                    Talent
                  </NavLink>
                </li>
              </ul>
            </nav>

            <div className="col-span-2 flex justify-center">
              <NavLink to="/">Home</NavLink>
            </div>

            <div className="col-span-5 justify-end flex gap-6 items-center">
              <button className="text-blue" onClick={onToggleSearchModal}>
                <svg
                  className="h-5 w-5 stroke-blue-100"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.8889 19.7778C15.7981 19.7778 19.7778 15.7981 19.7778 10.8889C19.7778 5.97969 15.7981 2 10.8889 2C5.97969 2 2 5.97969 2 10.8889C2 15.7981 5.97969 19.7778 10.8889 19.7778Z"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22.0003 22.0003L17.167 17.167"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {token && (
                <>
                  <div className="relative" ref={menuDropdownRef}>
                    <button
                      className="text-sm btn-chunky"
                      onClick={onToggleMenuDropdown}
                    >
                      <div className="flex items-center gap-1.5">
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
                            d="M3.5 10.1299L16.5 23.1299"
                            stroke="currentColor"
                            strokeWidth="4.5"
                          />
                          <path
                            d="M28.5 10.1306L14.7629 23.8679"
                            stroke="currentColor"
                            strokeWidth="4.5"
                          />
                        </svg>
                      </div>
                    </button>
                    {showDropdown && (
                      <div className="min-w-44 bg-white border-2 border-[#444] rounded-md absolute top-full right-0 translate-y-3 flex flex-col z-10 overflow-hidden">
                        <ul>
                          <li className="flex">
                            <NavLink
                              className="text-sm font-bold px-5 py-5 hover:bg-blue-900 whitespace-nowrap w-full"
                              to={`/user/${userState.userName.toLowerCase()}`}
                              state={{ userId: userState._id }}
                              onClick={onToggleMenuDropdown}
                            >
                              Profile
                            </NavLink>
                          </li>
                          <li className="flex">
                            <NavLink
                              className="text-sm font-bold px-5 py-5 hover:bg-blue-900 whitespace-nowrap w-full"
                              to={`/posts/${userState.userName.toLowerCase()}`}
                              state={{ userId: userState._id }}
                              onClick={onToggleMenuDropdown}
                            >
                              Posts
                            </NavLink>
                          </li>
                          <li className="flex">
                            <NavLink
                              className="text-sm font-bold px-5 py-5 hover:bg-blue-900 whitespace-nowrap w-full"
                              to={`/shop/${userState.userName.toLowerCase()}`}
                              state={{ userId: userState._id }}
                              onClick={onToggleMenuDropdown}
                            >
                              Shop
                            </NavLink>
                          </li>
                          <li className="flex">
                            <NavLink
                              className="text-sm font-bold px-5 py-5 hover:bg-blue-900 whitespace-nowrap w-full"
                              to={`/talent/${userState.userName.toLowerCase()}`}
                              state={{ userId: userState._id }}
                              onClick={onToggleMenuDropdown}
                            >
                              Talent
                            </NavLink>
                          </li>
                        </ul>
                        <hr className="h-[2px] bg-[#444] border-none" />
                        <ul>
                          <li className="flex">
                            <NavLink
                              to="/auth"
                              className="text-sm font-bold px-5 py-5 hover:bg-blue-900 whitespace-nowrap w-full"
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
                      className="btn-chunky-primary !p-2 !rounded-full"
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
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 12H21"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {showCreateDropdown && (
                      <ul className="bg-white border-2 border-[#444] rounded-md absolute top-full right-0 translate-y-3 flex flex-col overflow-hidden">
                        {userState?._id && (
                          <li>
                            <CreatePost
                              btnClasses="text-sm font-bold px-5 py-5 hover:bg-blue-900 whitespace-nowrap w-full"
                              onFileUpload={handleFileUpload}
                            />
                          </li>
                        )}
                        {userState?._id && (
                          <li>
                            <CreateProduct
                              btnClasses="text-sm font-bold px-5 py-5 hover:bg-blue-900 whitespace-nowrap w-full"
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
                                ? "btn-chunky text-sm"
                                : "btn-chunky text-sm"
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
                              ? "btn-chunky-primary text-sm font-bold"
                              : "btn-chunky-primary text-sm font-bold bg-blue-100 text-white hover:bg-blue-300"
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

      <main
        className={`flex flex-col ${
          location.pathname === "/register"
            ? "justify-center items-center"
            : "py-24"
        } ${location.pathname === "/" ? "pb-8" : ""}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/auth" element={<ProtectedRoutes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path={`/shop/:userName`} element={<UserShopPage />} />
          <Route path={`/user/:userName`} element={<UserPage />} />
          <Route path={`/posts/:userName`} element={<UserPostsPage />} />
          <Route path={`/talent/:userName`} element={<UserTalentPage />} />
          <Route path={`/series/:seriesTitle`} element={<SeriesPage />} />
          <Route path={`/shop`} element={<ShopPage />} />
          <Route path={`/talent`} element={<TalentPage />} />
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
