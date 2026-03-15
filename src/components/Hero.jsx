import '../styles/Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Learn with AI.<br />Master Engineering.</h1>
        <p className="hero-subtitle">
          The smartest way to level up your engineering skills — powered by an AI instructor that adapts to you.
        </p>
        <button className="btn-primary btn-large">Start Learning Free →</button>

        <div className="chat-bubble">
          <div className="chat-avatar">AI</div>
          <div className="chat-text">
            <p>Hey! Ready to master Kafka Architecture?</p>
            <p className="chat-sub">I'll guide you step by step 🎯</p>
          </div>
        </div>

        <div className="trusted">
          <span className="trusted-label">Trusted by engineers from</span>
          <div className="trusted-logos">
            <span>AWS</span>
            <span>Google</span>
            <span>Microsoft</span>
            <span>Meta</span>
          </div>
        </div>
      </div>
    </section>
  );
}
