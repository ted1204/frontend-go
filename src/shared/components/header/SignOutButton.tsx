import { useNavigate } from 'react-router';
import { logout } from '../../../core/services/authService';
import { useAuth } from '../../../core/context/AuthContext';
import { useTranslation } from '../../../../packages/utils/src/hooks/useTranslation';

interface SignOutButtonProps {
  className?: string;
  onClick?: () => void;
}

export const SignOutButton = ({ className = '', onClick }: SignOutButtonProps) => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      if (onClick) onClick();
      navigate('/signin');
    } catch (error: unknown) {
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
      {t('auth.signOut')}
    </button>
  );
};
