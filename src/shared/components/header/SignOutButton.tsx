import { useNavigate } from 'react-router';
import { logout } from '../../../core/services/authService';
import { useAuth } from '../../../core/context/AuthContext';

interface SignOutButtonProps {
  className?: string;
  onClick?: () => void;
}

export const SignOutButton = ({ className = '', onClick }: SignOutButtonProps) => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      if (onClick) onClick();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.clear();
      sessionStorage.clear();
      setIsAuthenticated(false);
      if (onClick) onClick();
      navigate('/signin');
    }
  };

  return (
    <button onClick={handleSignOut} className={className}>
      Sign Out
    </button>
  );
};
