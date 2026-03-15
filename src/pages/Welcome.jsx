import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Welcome.css';

export default function Welcome() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="welcome">
      <div className="welcome-card">
        <div className="welcome-logo">Engin<span>AI</span></div>
        <h1>Welcome aboard! 🎉</h1>
        <p>You're now logged in. Your learning journey starts here.</p>
        <button className="btn-primary" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
