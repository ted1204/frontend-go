import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../src/core/context/AuthContext';

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // While auth state is being determined, still allow rendering the public route
  // so unauthenticated users can access signin/signup without a blank screen.
  if (loading) return <Outlet />;

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
