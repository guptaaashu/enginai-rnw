import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="logo">Engin<span className="logo-accent">AI</span></div>
          <p>Learn smarter. Build faster.</p>
          <div className="social-icons">
            <a href="#">𝕏</a>
            <a href="#">GitHub</a>
            <a href="#">in</a>
          </div>
        </div>
        <div className="footer-links">
          <div>
            <h4>Platform</h4>
            <a href="#">Courses</a>
            <a href="#">Learning Paths</a>
            <a href="#">AI Instructor</a>
            <a href="#">Pricing</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 EnginAI. All rights reserved.</p>
      </div>
    </footer>
  );
}
