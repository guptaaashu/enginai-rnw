import { useState, useRef, useEffect } from 'react';
import { streamChat } from '../services/chatService';
import '../styles/ChatBot.css';

const CAPABILITIES = [
  { icon: '🗺️', label: 'Career Roadmap',    desc: 'Get a personalized path to your dream role' },
  { icon: '🎯', label: 'Course Match',        desc: 'Find the perfect course for your goals' },
  { icon: '⚡', label: 'Interview Prep',      desc: 'Ace your next system design round' },
  { icon: '📈', label: 'Skill Gap Analysis',  desc: 'Know exactly what to learn next' },
];

const QUICK_PROMPTS = [
  'What should I learn to become a Senior Engineer?',
  'Build me a 3-month learning roadmap',
  'Best courses for FAANG interviews',
  'How do I get into AI engineering?',
];

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
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const [streamingId, setStreamingId] = useState(null);
  const [started, setStarted]     = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const cancelRef  = useRef(null);  // holds the SSE cancel function

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (open && !started) {
      setStarted(true);
      startStream("Hey! I'm your AI Instructor — not just a chatbot. I analyze your goals, match you with courses, and build you a real learning roadmap. What are you working towards right now?", null);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  // Cancel any in-progress stream on unmount
  useEffect(() => () => cancelRef.current?.(), []);

  function startStream(greeting, course) {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, from: 'bot', text: '', course: null, done: false }]);
    setStreamingId(id);

    // For the greeting we pass text directly as a single chunk sequence
    const words = greeting.split(' ');
    let i = 0;
    let cancelled = false;
    function next() {
      if (cancelled) return;
      if (i >= words.length) {
        setMessages((prev) => prev.map((m) => m.id === id ? { ...m, course, done: true } : m));
        setStreamingId(null);
        return;
      }
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, text: m.text + (i === 0 ? '' : ' ') + words[i] } : m));
      i++;
      setTimeout(next, 30 + Math.random() * 40);
    }
    setTimeout(next, 400);
    cancelRef.current = () => { cancelled = true; };
  }

  function send(text) {
    const msg = (text || input).trim();
    if (!msg || isTyping || streamingId) return;

    cancelRef.current?.();
    setMessages((prev) => [...prev, { id: Date.now(), from: 'user', text: msg }]);
    setInput('');
    setIsTyping(true);

    let botMsgId = null; // closure var — set once on first chunk, never via state

    const cancel = streamChat({
      message: msg,
      context: null,
      onChunk: (chunk) => {
        if (botMsgId === null) {
          // First chunk — create the bot message
          botMsgId = Date.now();
          setIsTyping(false);
          setStreamingId(botMsgId);
          setMessages((msgs) => [...msgs, { id: botMsgId, from: 'bot', text: chunk, course: null, done: false }]);
        } else {
          // Subsequent chunks — append to existing bot message
          setMessages((msgs) =>
            msgs.map((m) => m.id === botMsgId ? { ...m, text: m.text + chunk } : m)
          );
        }
      },
      onDone: ({ course }) => {
        setStreamingId(null);
        setMessages((msgs) =>
          msgs.map((m) => m.id === botMsgId ? { ...m, course, done: true } : m)
        );
      },
    });

    cancelRef.current = cancel;
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
