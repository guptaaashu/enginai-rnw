import '../styles/Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Engin<span className="logo-accent">AI</span></div>
      <div className="nav-links">
        <a href="#">Courses</a>
        <a href="#">Learning Paths</a>
        <a href="#">AI Instructor</a>
        <a href="#">Pricing</a>
      </div>
      <button className="btn-primary">Get Started</button>
    </nav>
  );
}
