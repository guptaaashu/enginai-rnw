import { useState, useRef, useEffect } from 'react';
import '../styles/ChatBot.css';

const CAPABILITIES = [
  { icon: '🗺️', label: 'Career Roadmap',       desc: 'Get a personalized path to your dream role' },
  { icon: '🎯', label: 'Course Match',           desc: 'Find the perfect course for your goals' },
  { icon: '⚡', label: 'Interview Prep',         desc: 'Ace your next system design round' },
  { icon: '📈', label: 'Skill Gap Analysis',     desc: 'Know exactly what to learn next' },
];

const QUICK_PROMPTS = [
  'What should I learn to become a Senior Engineer?',
  'Build me a 3-month learning roadmap',
  'Best courses for FAANG interviews',
  'How do I get into AI engineering?',
];

const RESPONSES = [
  {
    text: "Based on your profile, Kafka Architecture is your highest-leverage next step. Event-driven systems appear in 78% of senior engineering interviews at top companies. Engineers who complete this course report a 2.4x increase in system design confidence.",
    course: { icon: 'KFK', color: 'purple', title: 'Kafka Architecture', hours: 16, match: 98 },
  },
  {
    text: "For FAANG prep, the winning combo is System Design + Redis. Together they cover ~80% of L5/L6 interview content. I've seen this pair help engineers go from mid-level to senior offers at Google and Meta.",
    course: { icon: 'SYS', color: 'red', title: 'System Design', hours: 20, match: 95 },
  },
  {
    text: "Your 3-month roadmap: Month 1 → Kafka Architecture (event systems). Month 2 → Kubernetes Mastery (infra ownership). Month 3 → System Design (interview readiness). This path mirrors what senior engineers at Uber and Airbnb actually use.",
    course: { icon: 'K8S', color: 'blue', title: 'Kubernetes Mastery', hours: 18, match: 92 },
  },
  {
    text: "MCP (Model Context Protocol) is the most underrated skill in 2026. Companies are paying 30–40% premiums for engineers who can integrate AI into production systems. Early movers on this course are already getting inbound recruiter interest.",
    course: { icon: 'MCP', color: 'blue', title: 'Mastering MCP', hours: 13, match: 96 },
  },
  {
    text: "Redis expertise is a superpower for backend roles. It's in the stack at Airbnb, Twitter, Uber, and every high-scale fintech. Knowing Redis deeply signals senior-level thinking about performance and architecture.",
    course: { icon: 'RDS', color: 'red', title: 'Advanced Redis', hours: 15, match: 91 },
  },
  {
    text: "GraphQL is the standard for API design at product-led companies. If you're targeting fullstack or platform engineering roles at Series B+ startups, this is a must-have on your resume.",
    course: { icon: 'GQL', color: 'purple', title: 'GraphQL in Depth', hours: 12, match: 89 },
  },
];

function getResponse() {
  return RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
}

function TypingIndicator() {
  return (
    <div className="chat-bubble bot">
      <div className="bubble-avatar" />
      <div className="bubble-body typing">
        <span /><span /><span />
      </div>
    </div>
  );
}

function CourseRecommendation({ course }) {
  return (
    <div className="rec-card">
      <div className="rec-match">{course.match}% match for you</div>
      <div className="rec-body">
        <div className={`rec-icon ${course.color}`}>{course.icon}</div>
        <div className="rec-info">
          <p className="rec-title">{course.title}</p>
          <p className="rec-meta">⏱ {course.hours} hrs · Recommended for you</p>
        </div>
        <button className="rec-enroll">Enroll Free →</button>
      </div>
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingId, setStreamingId] = useState(null);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (open && !started) {
      setStarted(true);
      setTimeout(() => {
        streamBotMessage(
          "Hey! I'm your AI Instructor — not just a chatbot. I analyze your goals, match you with courses, and build you a real learning roadmap. What are you working towards right now?",
          null
        );
      }, 400);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  function streamBotMessage(text, course) {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, from: 'bot', text: '', course, done: false }]);
    setStreamingId(id);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, text: text.slice(0, i) } : m))
      );
      if (i >= text.length) {
        clearInterval(iv);
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, done: true } : m)));
        setStreamingId(null);
      }
    }, 14);
  }

  function send(text) {
    const msg = (text || input).trim();
    if (!msg || isTyping || streamingId) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: 'user', text: msg }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const r = getResponse();
      streamBotMessage(r.text, r.course);
    }, 900 + Math.random() * 500);
  }

  return (
    <>
      {/* Full-screen overlay */}
      {open && (
        <div className="ai-overlay">
          <div className="ai-modal">

            {/* Left panel */}
            <div className="ai-left">
              <div className="ai-brand">
                <div className="ai-brand-avatar">
                  <span>AI</span>
                  <div className="brand-pulse" />
                </div>
                <div>
                  <h2>AI Instructor</h2>
                  <p>Powered by EnginAI</p>
                </div>
                <span className="ai-live-badge">● LIVE</span>
              </div>

              <p className="ai-tagline">
                Not just answers — personalized roadmaps, course matches, and career intelligence.
              </p>

              <div className="ai-capabilities">
                {CAPABILITIES.map((c) => (
                  <div key={c.label} className="capability-item" onClick={() => send(c.label)}>
                    <span className="cap-icon">{c.icon}</span>
                    <div>
                      <p className="cap-label">{c.label}</p>
                      <p className="cap-desc">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ai-stats">
                <div className="stat"><p className="stat-num">10k+</p><p className="stat-label">Engineers helped</p></div>
                <div className="stat"><p className="stat-num">94%</p><p className="stat-label">Goal achievement</p></div>
                <div className="stat"><p className="stat-num">2.4x</p><p className="stat-label">Faster learning</p></div>
              </div>
            </div>

            {/* Right panel — chat */}
            <div className="ai-right">
              <button className="ai-close" onClick={() => setOpen(false)}>✕</button>

              <div className="ai-messages">
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-bubble ${msg.from}`}>
                    {msg.from === 'bot' && <div className="bubble-avatar" />}
                    <div className="bubble-col">
                      <div className="bubble-body">
                        {msg.text}
                        {msg.from === 'bot' && !msg.done && <span className="cursor">|</span>}
                      </div>
                      {msg.course && msg.done && <CourseRecommendation course={msg.course} />}
                    </div>
                  </div>
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>

              {/* Quick prompts — shown before user sends first message */}
              {messages.length <= 1 && !isTyping && (
                <div className="ai-prompts">
                  {QUICK_PROMPTS.map((p) => (
                    <button key={p} className="prompt-pill" onClick={() => send(p)}>{p}</button>
                  ))}
                </div>
              )}

              <div className="ai-input-row">
                <input
                  ref={inputRef}
                  className="ai-input"
                  placeholder="Ask about your career, courses, or roadmap..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  disabled={!!streamingId}
                />
                <button
                  className="ai-send"
                  onClick={() => send()}
                  disabled={!input.trim() || !!streamingId || isTyping}
                >↑</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAB bar */}
      <div className="ai-fab-bar">
        <button className="ai-fab-btn" onClick={() => setOpen(true)}>
          <div className="fab-glow" />
          <span className="fab-sparkle">✦</span>
          <div className="fab-text">
            <span className="fab-main">Ask your AI Instructor</span>
            <span className="fab-sub">Career advice · Course picks · Roadmaps · Interview prep</span>
          </div>
          <span className="fab-arrow">→</span>
        </button>
      </div>
    </>
  );
}
