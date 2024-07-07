import { useContext } from "react";
import { GlobalStateContext } from "./context";
import { useLocation, Routes, Route, Link, NavLink } from "react-router-dom";
import Home from "./Home";
import ProtectedRoutes from "./ProtectedRoutes";
import "./App.css";
import Register from "./Register";
import Login from "./Login";
import Cookies from "universal-cookie";
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
                    : "text-sm px-5 py-2"
                }
              >
                Home
              </NavLink>
              {token && (
                <NavLink
                  to="/auth"
                  className={({ isActive }: { isActive: any }) =>
                    isActive
                      ? "nav-button bg-neutral-300 rounded-full text-sm"
                      : "text-sm px-5 py-2"
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
