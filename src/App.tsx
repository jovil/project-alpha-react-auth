import { useContext } from "react";
import { useLocation, Routes, Route, NavLink } from "react-router-dom";
import { GlobalStateContext } from "./context/Context";
import { useUser } from "./context/UserContext";
import Home from "./pages/HomePage/Home";
import ProtectedRoutes from "./ProtectedRoutes";
import "./App.css";
import Register from "./pages/RegisterPage/RegisterPage";
import Login from "./pages/LoginPage/Login";
import Cookies from "universal-cookie";
import UserShopPage from "./pages/UserShopPage/UserShopPage";
import ShopPage from "./pages/ShopPage/ShopPage";
import UserPage from "./pages/UserPage/UserPage";
import SeriesPage from "./pages/SeriesPage/SeriesPage";
import HiringPage from "./pages/HiringPage/HiringPage";
import SeriesListPage from "./pages/SeriesListPage";

function App() {
  const cookies = new Cookies();
  const { state } = useContext(GlobalStateContext);
  const { userState } = useUser();
  const location = useLocation();
  const token = cookies.get("TOKEN");

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-[948px] py-6 mx-auto">
        {token && (
          <div className="flex justify-end gap-4">
            <NavLink
              to="/auth"
              className={({ isActive }: { isActive: any }) =>
                isActive
                  ? "btn-outline-dark text-xs font-semibold border-[#dadce0] text-[#1a73e8] hover:text-[#1a73e8] hover:bg-[#f2f7fe] shadow-none"
                  : "btn-outline-dark text-xs font-semibold border-[#dadce0] text-[#1a73e8] hover:text-[#1a73e8] hover:bg-[#f2f7fe] shadow-none"
              }
            >
              Account
            </NavLink>
            <NavLink
              to={`/user/${userState._id}`}
              className={({ isActive }: { isActive: any }) =>
                isActive
                  ? "btn-primary bg-[#1a73e8] border-[#1a73e8] text-white shadow-none hover:bg-[#185abc] hover:border-[#185abc] text-xs font-semibold"
                  : "btn-primary bg-[#1a73e8] border-[#1a73e8] text-white shadow-none hover:bg-[#185abc] hover:border-[#185abc] text-xs font-semibold"
              }
            >
              @{userState.userName}
            </NavLink>
          </div>
        )}

        {!token && (
          <div className="flex justify-end gap-4">
            {!state.isLoggedIn ? (
              <>
                <>
                  {location.pathname !== "/login" && (
                    <NavLink
                      to="/login"
                      className={({ isActive }: { isActive: any }) =>
                        isActive
                          ? "btn-outline-dark text-xs font-semibold border-[#dadce0] text-[#1a73e8] hover:text-[#1a73e8] hover:bg-[#f2f7fe] shadow-none"
                          : "btn-outline-dark text-xs font-semibold border-[#dadce0] text-[#1a73e8] hover:text-[#1a73e8] hover:bg-[#f2f7fe] shadow-none"
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
                        ? "btn-primary bg-[#1a73e8] border-[#1a73e8] text-white shadow-none hover:bg-[#185abc] hover:border-[#185abc] text-xs font-semibold"
                        : "btn-primary bg-[#1a73e8] border-[#1a73e8] text-white shadow-none hover:bg-[#185abc] hover:border-[#185abc] text-xs font-semibold"
                    }
                  >
                    Register
                  </NavLink>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
      <header className="sticky top-0 z-20 pointer-events-none">
        <div className="max-w-[948px] mx-auto pt-8 pb-6 flex flex-col gap-5 sm:gap-4">
          <div className="flex justify-center items-center gap-2">
            <nav className="bg-white rounded-full shadow-nav p-2 pointer-events-auto">
              <ul className="flex items-center">
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
          <Route path={`/shop/:profileId`} element={<UserShopPage />} />
          <Route path={`/user/:userId`} element={<UserPage />} />
          <Route path={`/series/:seriesTitle`} element={<SeriesPage />} />
          <Route path={`/shop`} element={<ShopPage />} />
          <Route path={`/hirecosplayer`} element={<HiringPage />} />
          <Route path={`/series`} element={<SeriesListPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
