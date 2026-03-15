import { useState, useRef, useEffect } from 'react';
import { streamChat } from '../../services/chatService';
import '../../styles/CourseAI.css';

export default function CourseAI({ chapterTitle }) {
  const [messages, setMessages] = useState([
    { id: 0, from: 'bot', text: `I'm here to help with "${chapterTitle}". Ask me anything — concepts, examples, or how this applies in real systems.`, done: true }
  ]);
  const [input, setInput]         = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef(null);
  const cancelRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Cancel stream and reset when chapter changes
  useEffect(() => {
    cancelRef.current?.();
    setIsTyping(false);
    setStreaming(false);
    setMessages([
      { id: 0, from: 'bot', text: `I'm here to help with "${chapterTitle}". Ask me anything — concepts, examples, or how this applies in real systems.`, done: true }
    ]);
  }, [chapterTitle]);

  useEffect(() => () => cancelRef.current?.(), []);

  function send() {
    const text = input.trim();
    if (!text || isTyping || streaming) return;

    cancelRef.current?.();
    setMessages((prev) => [...prev, { id: Date.now(), from: 'user', text }]);
    setInput('');
    setIsTyping(true);

    let botMsgId = null; // closure var — set once on first chunk, never via state

    const cancel = streamChat({
      message: text,
      context: { type: 'course', chapterTitle },
      onChunk: (chunk) => {
        if (botMsgId === null) {
          // First chunk — create the bot message
          botMsgId = Date.now();
          setIsTyping(false);
          setStreaming(true);
          setMessages((msgs) => [...msgs, { id: botMsgId, from: 'bot', text: chunk, done: false }]);
        } else {
          // Subsequent chunks — append
          setMessages((msgs) =>
            msgs.map((m) => m.id === botMsgId ? { ...m, text: m.text + chunk } : m)
          );
        }
      },
      onDone: () => {
        setStreaming(false);
        setMessages((msgs) =>
          msgs.map((m) => m.id === botMsgId ? { ...m, done: true } : m)
        );
      },
    });

    cancelRef.current = cancel;
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
        {messages.map((msg) => (
          <div key={msg.id} className={`ai-msg ${msg.from}`}>
            {msg.text}
            {msg.from === 'bot' && !msg.done && <span className="ai-cursor">|</span>}
          </div>
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
          disabled={streaming}
        />
        <button className="course-ai-send" onClick={send} disabled={!input.trim() || isTyping || streaming}>↑</button>
      </div>
    </aside>
  );
}
