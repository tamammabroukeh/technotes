import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let status = "Employee";
  let isManager = false;
  let isAdmin = false;
  if (token) {
    const decode = jwtDecode(token);
    const { username, roles } = decode.UserInfo;
    isManager = roles.includes("Manager");
    isAdmin = roles.includes("Admin");

    if (isManager) status = "Manager";
    if (isAdmin) status = "Admin";

    return { username, roles, status, isAdmin, isManager };
  }
  return { username: "", roles: [], status, isManager, isAdmin };
};

export default useAuth;
