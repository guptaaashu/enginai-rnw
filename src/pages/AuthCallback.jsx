import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');

    if (token) {
      login(token);
      // Clear token from URL
      window.history.replaceState({}, '', '/auth/callback');
    }

    const redirectTo = localStorage.getItem('redirect_after_login') || '/welcome';
    localStorage.removeItem('redirect_after_login');
    navigate(redirectTo, { replace: true });
  }, []);

  return <p style={{ color: '#fff', textAlign: 'center', marginTop: '40vh' }}>Signing you in...</p>;
}
