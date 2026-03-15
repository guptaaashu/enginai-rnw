import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/HomeNavbar.css';

export default function HomeNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="home-navbar">
      <div className="logo">Engin<span className="logo-accent">AI</span></div>
      <div className="nav-links">
        <a href="#">Courses</a>
        <a href="#">Learning Paths</a>
        <a href="#">AI Instructor</a>
      </div>
      <button className="btn-logout" onClick={handleLogout}>Logout</button>
    </nav>
  );
}
