import { useEffect, useState } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage/Home";
import ProtectedRoutes from "./ProtectedRoutes";
import "./App.css";
import Register from "./pages/RegisterPage/RegisterPage";
import Login from "./pages/LoginPage/Login";
import ShopPage from "./pages/ShopPage/ShopPage";
import SeriesPage from "./pages/SeriesPage/SeriesPage";
import TalentPage from "./pages/TalentPage";
import SeriesListPage from "./pages/SeriesListPage";
import DiscoverPage from "./pages/DiscoverPage";
import User from "./pages/User";
import DesktopHeader from "./components/SiteHeader/desktop";
import MobileHeader from "./components/SiteHeader/mobile";

function App() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile ? <MobileHeader /> : <DesktopHeader />}
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
          <Route path={`/shop/:userName`} element={<User />} />
          <Route path={`/user/:userName`} element={<User />} />
          <Route path={`/posts/:userName`} element={<User />} />
          <Route path={`/talent/:userName`} element={<User />} />
          <Route path={`/series/:seriesTitle`} element={<SeriesPage />} />
          <Route path={`/shop`} element={<ShopPage />} />
          <Route path={`/talent`} element={<TalentPage />} />
          <Route path={`/series`} element={<SeriesListPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
