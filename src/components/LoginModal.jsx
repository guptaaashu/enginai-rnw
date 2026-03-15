import { login } from '../services/authService';
import '../styles/LoginModal.css';

export default function LoginModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-logo">Engin<span>AI</span></div>
        <h2>Welcome back</h2>
        <p className="modal-sub">Join 10,000+ engineers leveling up with AI</p>

        <button className="btn-google" onClick={login}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
          Continue with Google
        </button>

        <p className="modal-terms">
          By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
