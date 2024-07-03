import { Navigate } from "react-router-dom";
import AuthComponent from "./AuthComponent";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function ProtectedRoutes() {
  const token = cookies.get("TOKEN");

  return token ? <AuthComponent /> : <Navigate to="/" />;
}
