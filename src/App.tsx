import { useContext, useState } from "react";
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
import Backdrop from "./components/Backdrop";
import { motion, AnimatePresence } from "framer-motion";
import { slideInFromRight } from "./utils/animations";
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

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-[948px] pt-6 pb-10 mx-auto">
        <div className="flex justify-end items-center gap-4 relative">
          <SearchModal
            onToggleSearchModal={onToggleSearchModal}
            onShowSearchModal={onShowSearchModal}
            isShowSearchModal={showSearchModal}
          />
          <div className="flex justify-end gap-4">
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
                <NavLink
                  to="/auth"
                  className={({ isActive }: { isActive: any }) =>
                    isActive
                      ? "btn-outline-dark text-xs font-semibold border-[#dadce0] text-blue-100 hover:text-blue-100 hover:bg-blue-900 shadow-none"
                      : "btn-outline-dark text-xs font-semibold border-[#dadce0] text-blue-100 hover:text-blue-100 hover:bg-blue-900 shadow-none"
                  }
                >
                  Account
                </NavLink>
                {!userState.hasProducts && !userState.hasHiringDetails && (
                  <NavLink
                    to={`/user/${userState._id}`}
                    className={({ isActive }: { isActive: any }) =>
                      `text-xs btn-primary ${isActive ? "" : ""}`
                    }
                  >
                    @{userState.userName}
                  </NavLink>
                )}

                {(userState.hasProducts || userState.hasHiringDetails) && (
                  <>
                    <button
                      className="text-xs btn-primary"
                      onClick={onToggleMenuDropdown}
                    >
                      <div className="flex items-center gap-1">
                        @{userState.userName}
                        <svg
                          className="w-3 h-3"
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.02701 8.15332L2.66701 10.5133L16 23.8473L29.333 10.5133L26.973 8.15332L16 19.1273L5.02701 8.15332Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </button>

                    <AnimatePresence
                      initial={false}
                      mode="wait"
                      onExitComplete={() => null}
                    >
                      {showDropdown && (
                        <Backdrop
                          onClick={onToggleMenuDropdown}
                          showCloseButton={false}
                        >
                          <motion.div
                            className="bg-white h-full w-2/5 px-2.5 py-4 overflow-scroll ml-auto cursor-default flex flex-col justify-between"
                            variants={slideInFromRight}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ul>
                              <li>
                                <NavLink
                                  className="px-8 py-4 block rounded-md hover:bg-blue-800 transition-colors"
                                  to={`/user/${userState._id}`}
                                  onClick={onToggleMenuDropdown}
                                >
                                  Profile
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  className="px-8 py-4 block rounded-md hover:bg-blue-800 transition-colors"
                                  to={`/posts/${userState._id}`}
                                  onClick={onToggleMenuDropdown}
                                >
                                  Posts
                                </NavLink>
                              </li>
                              {userState.hasProducts && (
                                <li>
                                  <NavLink
                                    className="px-8 py-4 block rounded-md hover:bg-blue-800 transition-colors"
                                    to={`/shop/${userState._id}`}
                                    onClick={onToggleMenuDropdown}
                                  >
                                    Shop
                                  </NavLink>
                                </li>
                              )}
                              {userState.hasHiringDetails && (
                                <li>
                                  <NavLink
                                    className="px-8 py-4 block rounded-md hover:bg-blue-800 transition-colors"
                                    to={`/hire/${userState._id}`}
                                    onClick={onToggleMenuDropdown}
                                  >
                                    Hiring page
                                  </NavLink>
                                </li>
                              )}
                            </ul>

                            <ul className="border-t border-black-100/40 py-6 flex flex-col gap-6">
                              {userState?._id && (
                                <li className="block text-center">
                                  <CreateProduct
                                    btnClasses="btn-primary w-full"
                                    onToggleModal={
                                      handleToggleCreateProductModal
                                    }
                                  />
                                </li>
                              )}
                              {userState?._id && (
                                <li className="block text-center">
                                  <CreatePost
                                    btnClasses="btn-primary"
                                    onFileUpload={handleFileUpload}
                                  />
                                </li>
                              )}
                            </ul>
                          </motion.div>
                        </Backdrop>
                      )}
                    </AnimatePresence>
                  </>
                )}
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
      <header className="sticky top-0 z-20 pointer-events-none">
        <div className="max-w-[948px] mx-auto pt-4 pb-6 flex flex-col gap-5 sm:gap-4">
          <div className="flex justify-center items-center gap-2">
            <nav className="bg-white rounded-full shadow-nav p-2 pointer-events-auto">
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
          </div>
        </div>
      </header>

      <main className="py-16">
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
    </div>
  );
}

export default App;
