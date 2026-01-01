import { useNavigate } from 'react-router';

interface SignOutButtonProps {
  className?: string;
  onClick?: () => void;
}

export const SignOutButton = ({ className = '', onClick }: SignOutButtonProps) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    if (onClick) onClick();
    navigate('/auth/sign-in');
  };

  return (
    <button onClick={handleSignOut} className={className}>
      Sign Out
    </button>
  );
};
