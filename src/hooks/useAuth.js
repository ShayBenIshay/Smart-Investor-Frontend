import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isAdmin = false;
  let status = "Customer";

  if (token) {
    const decoded = jwtDecode(token);
    const { username, roles, lastLogin } = decoded.UserInfo;

    isAdmin = roles.includes("Admin");

    if (isAdmin) status = "Admin";

    return { username, roles, status, isAdmin, lastLogin };
  }

  return { username: "", roles: [], isAdmin, status, lastLogin: "" };
};
export default useAuth;
