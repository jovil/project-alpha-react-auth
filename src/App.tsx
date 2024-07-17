import { useContext } from "react";
import { GlobalStateContext } from "./context/Context";
import { useLocation, Routes, Route, Link, NavLink } from "react-router-dom";
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
const cookies = new Cookies();

function App() {
  const { state } = useContext(GlobalStateContext);
  const location = useLocation();
  const token = cookies.get("TOKEN");

  return (
    <div className="container mx-auto px-4">
      <header>
        <div className="py-6 flex flex-col gap-5 sm:gap-4">
          <div className="flex justify-center order-1">
            <div className="flex gap-2 items-center">
              <NavLink
                to="/"
                className={({ isActive }: { isActive: any }) =>
                  isActive
                    ? "nav-button bg-neutral-300 rounded-full text-sm"
                    : "text-sm px-5 py-1.5"
                }
              >
                Discover
              </NavLink>
              <NavLink
                end
                to="/shop"
                className={({ isActive }: { isActive: any }) =>
                  isActive
                    ? "nav-button bg-neutral-300 rounded-full text-sm"
                    : "text-sm px-5 py-1.5"
                }
              >
                Shop
              </NavLink>
              <NavLink
                end
                to="/hirecosplayer"
                className={({ isActive }: { isActive: any }) =>
                  isActive
                    ? "nav-button bg-neutral-300 rounded-full text-sm"
                    : "text-sm px-5 py-1.5"
                }
              >
                Hire cosplayer
              </NavLink>
              {token && (
                <NavLink
                  to="/auth"
                  className={({ isActive }: { isActive: any }) =>
                    isActive
                      ? "nav-button bg-neutral-300 rounded-full text-sm"
                      : "text-sm px-5 py-1.5"
                  }
                >
                  Account
                </NavLink>
              )}
            </div>
          </div>
          <div>
            <div className="flex justify-end gap-4">
              {!token && (
                <>
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
                </>
              )}
            </div>
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
