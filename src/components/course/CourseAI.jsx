import { useState, useRef, useEffect } from 'react';
import '../../styles/CourseAI.css';

const RESPONSES = [
  (ch) => `Great question about ${ch}! The key thing to understand is that this concept is foundational — everything in later chapters builds on it.`,
  () => `Think of it this way: in production systems, this is one of the most common sources of bugs. Understanding it deeply will save you hours of debugging.`,
  (ch) => `In the context of ${ch}, this is exactly what senior engineers get asked in system design interviews. Let me know if you want me to break it down further.`,
  () => `That's a nuanced question. The short answer is: it depends on your consistency vs availability trade-off. In most real-world systems, you'd choose eventual consistency here.`,
  () => `This is covered in the next chapter too, but the core idea is: always design for failure. Assume any component can go down at any time.`,
];

export default function CourseAI({ chapterTitle }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: `I'm here to help with "${chapterTitle}". Ask me anything — concepts, examples, or how this applies in real systems.` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Reset when chapter changes
  useEffect(() => {
    setMessages([
      { from: 'bot', text: `I'm here to help with "${chapterTitle}". Ask me anything — concepts, examples, or how this applies in real systems.` }
    ]);
  }, [chapterTitle]);

  function send() {
    const text = input.trim();
    if (!text || isTyping) return;
    setMessages((prev) => [...prev, { from: 'user', text }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const fn = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
      setMessages((prev) => [...prev, { from: 'bot', text: fn(chapterTitle) }]);
    }, 800 + Math.random() * 400);
  }

  return (
    <aside className="course-ai">
      <div className="course-ai-header">
        <div className="course-ai-avatar">AI</div>
        <div>
          <p className="course-ai-name">AI Instructor</p>
          <p className="course-ai-context">{chapterTitle}</p>
        </div>
      </div>

      <div className="course-ai-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`ai-msg ${msg.from}`}>{msg.text}</div>
        ))}
        {isTyping && (
          <div className="ai-msg bot typing">
            <span /><span /><span />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="course-ai-input-row">
        <input
          className="course-ai-input"
          placeholder="Ask a doubt..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button className="course-ai-send" onClick={send} disabled={!input.trim() || isTyping}>↑</button>
      </div>
    </aside>
  );
}
