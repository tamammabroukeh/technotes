import useAuth from "../../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  const { roles } = useAuth();
  const content = roles.some((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
  return content;
};

export default RequireAuth;
