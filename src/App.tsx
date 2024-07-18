import { useContext } from "react";
import { useLocation, Routes, Route, Link, NavLink } from "react-router-dom";
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
      <header>
        <div className="max-w-[948px] mx-auto pt-11 pb-6 flex flex-col gap-5 sm:gap-4">
          <div className="grid tablet:grid-cols-12 items-center">
            <div className="col-span-3"></div>
            <div className="col-span-6 flex justify-center gap-2">
              <NavLink
                to="/"
                className={({ isActive }: { isActive: any }) =>
                  isActive
                    ? "nav-button bg-neutral-300 rounded-full text-sm flex items-center"
                    : "text-sm px-5 py-2 flex items-center"
                }
              >
                Discover
              </NavLink>
              <NavLink
                end
                to="/shop"
                className={({ isActive }: { isActive: any }) =>
                  isActive
                    ? "nav-button bg-neutral-300 rounded-full text-sm flex items-center"
                    : "text-sm px-5 py-2 flex items-center"
                }
              >
                Shop
              </NavLink>
              <NavLink
                end
                to="/hirecosplayer"
                className={({ isActive }: { isActive: any }) =>
                  isActive
                    ? "nav-button bg-neutral-300 rounded-full text-sm flex items-center"
                    : "text-sm px-5 py-2 flex items-center"
                }
              >
                Hire cosplayer
              </NavLink>
            </div>
            {token && (
              <div className="col-span-3 flex justify-end gap-4">
                <NavLink
                  to={`/user/${userState._id}`}
                  className={({ isActive }: { isActive: any }) =>
                    isActive
                      ? "btn-primary text-xs font-semibold"
                      : "btn-primary text-xs font-semibold"
                  }
                >
                  @{userState.userName}
                </NavLink>
                <NavLink
                  to="/auth"
                  className={({ isActive }: { isActive: any }) =>
                    isActive
                      ? "btn-outline-dark text-xs font-semibold"
                      : "btn-outline-dark text-xs font-semibold"
                  }
                >
                  Account
                </NavLink>
              </div>
            )}

            {!token && (
              <div className="col-span-3 flex justify-end gap-4">
                {!state.isLoggedIn ? (
                  <>
                    <>
                      {location.pathname !== "/login" && (
                        <Link to="/login">
                          <button className="btn-primary text-xs font-semibold">
                            Login
                          </button>
                        </Link>
                      )}
                    </>
                    {location.pathname !== "/register" && (
                      <Link to="/register">
                        <button className="btn-outline-dark text-xs font-semibold">
                          Register
                        </button>
                      </Link>
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            )}
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
