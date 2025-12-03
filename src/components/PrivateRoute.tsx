import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const PrivateRoute = () => {
  const location = useLocation();

  // Check if the user is authenticated
  // If not, redirect to the sign-in page and preserve the current location
  return isAuthenticated() ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default PrivateRoute;