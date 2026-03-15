// ─── Chat streaming service ───────────────────────────────────────────────────
import { apiFetch } from './apiClient';

// REAL (uncomment when Spring Boot is ready):
//
//   const controller = new AbortController();
//   apiFetch('/api/chat/stream', {
//     method: 'POST',
//     body: JSON.stringify({ message, context }),
//     signal: controller.signal,
//   }).then(async (res) => {
//     const reader  = res.body.getReader();
//     const decoder = new TextDecoder();
//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;
//       onChunk(decoder.decode(value));          // each SSE chunk → onChunk
//     }
//     onDone({ course: null });                  // stream ended
//   }).catch(() => {});
//   return () => controller.abort();             // cancel on unmount
//
// ─────────────────────────────────────────────────────────────────────────────

const CHATBOT_RESPONSES = [
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

const COURSE_RESPONSES = [
  (ch) => `Great question about "${ch}"! This concept is foundational — everything in later chapters builds on it. The key insight is understanding why it was designed this way, not just how it works.`,
  (ch) => `In the context of "${ch}", this is exactly what senior engineers get asked in system design interviews. The answer usually comes down to trade-offs between consistency, availability, and partition tolerance.`,
  ()   => `Think of it this way: in production systems, this is one of the most common sources of bugs and outages. Understanding it deeply will save you hours of debugging and prevent incidents.`,
  ()   => `That's a nuanced question. The short answer is: it depends on your consistency vs availability trade-off. In most real-world high-scale systems, you'd lean towards eventual consistency here.`,
  ()   => `This is also covered in the next chapter, but the core idea is: always design for failure. Assume any component can go down at any time — your system should degrade gracefully, not crash.`,
  (ch) => `The reason "${ch}" matters at scale is because naive implementations break under load. The patterns you're learning here are how companies like Stripe, Airbnb, and Uber solved the same problems.`,
];

function pickResponse(context) {
  if (context?.type === 'course') {
    const fn = COURSE_RESPONSES[Math.floor(Math.random() * COURSE_RESPONSES.length)];
    return { text: fn(context.chapterTitle), course: null };
  }
  return CHATBOT_RESPONSES[Math.floor(Math.random() * CHATBOT_RESPONSES.length)];
}

/**
 * streamChat — streams a chat response word by word (mock) or via SSE (real).
 *
 * @param {object}   opts
 * @param {string}   opts.message       — user message
 * @param {object}   opts.context       — { type: 'course', chapterTitle } | null
 * @param {function} opts.onChunk       — called with each text chunk as it arrives
 * @param {function} opts.onDone        — called when stream ends: ({ course }) => void
 *
 * @returns {function} cancel — call to abort the stream (e.g. on unmount)
 */
export function streamChat({ message, context = null, onChunk, onDone }) {
  const { text, course } = pickResponse(context);
  const words = text.split(' ');
  let i = 0;
  let cancelled = false;
  let timerId;

  function streamNextWord() {
    if (cancelled) return;
    if (i >= words.length) {
      onDone({ course });
      return;
    }
    // Each word is one "chunk" — mirrors how real SSE delivers tokens
    onChunk((i === 0 ? '' : ' ') + words[i]);
    i++;
    timerId = setTimeout(streamNextWord, 30 + Math.random() * 50);
  }

  // Initial delay — simulates server receiving request and LLM starting to respond
  timerId = setTimeout(streamNextWord, 500 + Math.random() * 400);

  return () => {
    cancelled = true;
    clearTimeout(timerId);
  };
}
