import { useState, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { GlobalStateContext } from "../../context/Context";
import { useUser } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import Backdrop from "../Backdrop";
import { slideInFromRight } from "../../utils/animations";
import Cookies from "universal-cookie";
import SearchModal from "../SearchModal";
import useSearch from "../../hooks/useSearch";
import CreatePost from "../../components/CreatePost";
import CreateProduct from "../../components/CreateProduct";
import useFileUpload from "../../hooks/useFileUpload";
import useCreateProduct from "../../hooks/useCreateProduct";
import CreatePostModal from "../../components/CreatePost/modal";
import CreateProductModal from "../../components/CreateProduct/modal";
const cookies = new Cookies();

const MobileHeader = () => {
  const token = cookies.get("TOKEN");
  const location = useLocation();
  const { state, setState } = useContext(GlobalStateContext);
  const { userState } = useUser();
  const { showSearchModal, onToggleSearchModal, onShowSearchModal } =
    useSearch();
  const {
    handleFileUpload,
    showModal,
    postImage,
    imageBase64,
    handleTogglePostModal,
  } = useFileUpload();
  const { isShowModal, handleToggleCreateProductModal } = useCreateProduct();
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const handleMenu = () => {
    setState((prevState: Record<string, any>) => ({
      ...prevState,
      mobileMenuOpen: !prevState.mobileMenuOpen,
    }));
  };

  const handleCreateMenu = () => {
    setShowCreateMenu((prevState: boolean) => !prevState);
  };

  return (
    <>
      <header className="bg-white sticky top-0 z-20 py-4 transition">
        <div className="container flex justify-between items-center">
          <NavLink to="/">Home</NavLink>

          <div className="flex items-center gap-6">
            {!token && (
              <>
                {!state.isLoggedIn && (
                  <>
                    {location.pathname !== "/login" && (
                      <NavLink
                        to="/login"
                        className={({ isActive }: { isActive: any }) =>
                          isActive ? "btn-chunky text-sm" : "btn-chunky text-sm"
                        }
                      >
                        Login
                      </NavLink>
                    )}
                  </>
                )}
              </>
            )}

            <button onClick={handleMenu}>
              <span
                className={`h-0.5 w-8 bg-black block my-1.5 transition-all ${
                  state.mobileMenuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              ></span>
              <span
                className={`h-0.5 w-8 bg-black block my-1.5 transition-all ${
                  state.mobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`h-0.5 w-8 bg-black block my-1.5 transition-all ${
                  state.mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              ></span>
            </button>
          </div>
        </div>

        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => null}
        >
          {state.mobileMenuOpen && (
            <Backdrop onClick={handleMenu} showCloseButton={false}>
              <motion.div
                className="h-full w-4/5 overflow-scroll ml-auto cursor-default"
                variants={slideInFromRight}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white h-full">
                  <header className="p-4 flex justify-end">
                    <button onClick={handleMenu}>
                      <span
                        className={`h-0.5 w-8 bg-black block my-1.5 transition-all ${
                          state.mobileMenuOpen ? "translate-y-2 rotate-45" : ""
                        }`}
                      ></span>
                      <span
                        className={`h-0.5 w-8 bg-black block my-1.5 transition-all ${
                          state.mobileMenuOpen ? "opacity-0" : ""
                        }`}
                      ></span>
                      <span
                        className={`h-0.5 w-8 bg-black block my-1.5 transition-all ${
                          state.mobileMenuOpen
                            ? "-translate-y-2 -rotate-45"
                            : ""
                        }`}
                      ></span>
                    </button>
                  </header>
                  <div className="py-4">
                    {!token && (
                      <div className="px-6 flex items-center gap-4">
                        {!state.isLoggedIn && (
                          <>
                            <NavLink
                              to="/register"
                              className={({ isActive }: { isActive: any }) =>
                                `w-full text-center ${
                                  isActive
                                    ? "btn-chunky-primary text-sm font-bold"
                                    : "btn-chunky-primary text-sm font-bold bg-blue-100 text-white hover:bg-blue-300"
                                }
                                `
                              }
                              onClick={handleMenu}
                            >
                              Register
                            </NavLink>

                            <button
                              className="btn-chunky text-blue"
                              onClick={onToggleSearchModal}
                            >
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
                          </>
                        )}
                      </div>
                    )}

                    {token && (
                      <>
                        <div className="px-6 flex items-center gap-4">
                          <div className="relative w-full">
                            <button
                              className="btn-chunky-primary flex justify-center items-center w-full h-10"
                              onClick={handleCreateMenu}
                            >
                              <svg
                                className={`text-white h-4 w-4 transition-transform ${
                                  showCreateMenu ? "rotate-45" : ""
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

                            {showCreateMenu && (
                              <ul className="bg-white border-2 border-[#444] rounded-md absolute top-full right-0 left-0 translate-y-3 flex flex-col overflow-hidden">
                                {userState?._id && (
                                  <li>
                                    <CreatePost
                                      btnClasses="font-bold px-5 py-5 hover:bg-blue-900 whitespace-nowrap w-full"
                                      onFileUpload={handleFileUpload}
                                    />
                                  </li>
                                )}
                                {userState?._id && (
                                  <li>
                                    <CreateProduct
                                      btnClasses="text-left font-bold px-5 py-5 hover:bg-blue-900 whitespace-nowrap w-full"
                                      onToggleModal={
                                        handleToggleCreateProductModal
                                      }
                                    />
                                  </li>
                                )}
                              </ul>
                            )}
                          </div>

                          <button
                            className="btn-chunky text-blue"
                            onClick={onToggleSearchModal}
                          >
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
                        </div>
                      </>
                    )}
                    <div className="py-6">
                      <div className="text-grey px-6 pt-4 pb-1">
                        <p className="subtitle">pages</p>
                      </div>
                      <nav>
                        <ul>
                          <li>
                            <NavLink
                              className="font-bold px-6 py-5 hover:bg-blue-900 transition-colors block"
                              to="/discover"
                              onClick={handleMenu}
                            >
                              Discover
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              className="font-bold px-6 py-5 hover:bg-blue-900 transition-colors block"
                              to="/shop"
                              onClick={handleMenu}
                            >
                              Shop
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              className="font-bold px-6 py-5 hover:bg-blue-900 transition-colors block"
                              to="/talent"
                              onClick={handleMenu}
                            >
                              Talent
                            </NavLink>
                          </li>
                        </ul>
                      </nav>
                    </div>

                    {token && (
                      <div className="pb-6">
                        <div className="text-grey px-6 pt-4 pb-1">
                          <p className="subtitle">@{userState.userName}</p>
                        </div>
                        <ul>
                          <li>
                            <NavLink
                              className={({ isActive }: { isActive: any }) =>
                                `font-bold px-6 py-5 hover:bg-blue-900 transition-colors block ${
                                  isActive ? "text-blue-100 bg-blue-900" : ""
                                }`
                              }
                              to={`/user/${userState.userName}`}
                              state={{ userId: userState._id }}
                              onClick={handleMenu}
                            >
                              Profile
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              className={({ isActive }: { isActive: any }) =>
                                `font-bold px-6 py-5 hover:bg-blue-900 transition-colors block ${
                                  isActive ? "text-blue-100 bg-blue-900" : ""
                                }`
                              }
                              to={`/posts/${userState.userName}`}
                              state={{ userId: userState._id }}
                              onClick={handleMenu}
                            >
                              Posts
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              className={({ isActive }: { isActive: any }) =>
                                `font-bold px-6 py-5 hover:bg-blue-900 transition-colors block ${
                                  isActive ? "text-blue-100 bg-blue-900" : ""
                                }`
                              }
                              to={`/shop/${userState.userName}`}
                              state={{ userId: userState._id }}
                              onClick={handleMenu}
                            >
                              Shop
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              className={({ isActive }: { isActive: any }) =>
                                `font-bold px-6 py-5 hover:bg-blue-900 transition-colors block ${
                                  isActive ? "text-blue-100 bg-blue-900" : ""
                                }`
                              }
                              to={`/talent/${userState.userName}`}
                              state={{ userId: userState._id }}
                              onClick={handleMenu}
                            >
                              Talent
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              className={({ isActive }: { isActive: any }) =>
                                `font-bold px-6 py-5 hover:bg-blue-900 transition-colors block ${
                                  isActive ? "text-blue-100 bg-blue-900" : ""
                                }`
                              }
                              to="/auth"
                              onClick={handleMenu}
                            >
                              Account
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Backdrop>
          )}
        </AnimatePresence>
        <SearchModal
          onToggleSearchModal={onToggleSearchModal}
          onShowSearchModal={onShowSearchModal}
          isShowSearchModal={showSearchModal}
        />
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
      </header>
    </>
  );
};

export default MobileHeader;
