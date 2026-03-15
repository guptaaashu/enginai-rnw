import '../styles/Navbar.css';

export default function Navbar({ onLoginClick }) {
  return (
    <nav className="navbar">
      <div className="logo">Engin<span className="logo-accent">AI</span></div>
      <div className="nav-links">
        <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }}>Courses</a>
        <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }}>Learning Paths</a>
        <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }}>AI Instructor</a>
        <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }}>Pricing</a>
      </div>
      <button className="btn-primary" onClick={onLoginClick}>Get Started</button>
    </nav>
  );
}
