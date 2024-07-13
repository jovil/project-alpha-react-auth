import { Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage/AuthPage";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function ProtectedRoutes() {
  const token = cookies.get("TOKEN");

  return token ? <AuthPage /> : <Navigate to="/" />;
}
