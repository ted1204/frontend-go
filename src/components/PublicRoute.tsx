import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const username = localStorage.getItem("username");

  if (username) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;