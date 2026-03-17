// Mock course service — replace fetch() calls when backend is ready
import { apiFetch } from './apiClient';

// ─── Course pages (NO answers here — they come from submitQuiz) ───────────────

const MOCK_COURSES = {
  3: {
    id: 3, title: 'Kafka Architecture', icon: 'KFK', color: 'purple',
    pages: [
      {
        id: 1, type: 'tutorial', chapterNum: 1, title: 'Introduction to Kafka',
        content: {
          heading: 'What is Apache Kafka?',
          sections: [
            { type: 'text', heading: 'Overview', body: 'Apache Kafka is a distributed event streaming platform capable of handling trillions of events a day. Originally developed at LinkedIn, it was open-sourced in 2011 and has since become the backbone of modern data pipelines.' },
            { type: 'code', body: '// Basic Kafka producer example\nProducer<String, String> producer = new KafkaProducer<>(props);\nproducer.send(new ProducerRecord<>("my-topic", "key", "value"));' },
            { type: 'text', heading: 'Why Kafka?', body: 'Traditional messaging systems struggle at scale. Kafka solves this with a distributed, partitioned, and replicated commit log. It decouples producers from consumers and guarantees high throughput with low latency.' },
          ],
          takeaway: 'Kafka is not a message queue — it is a distributed commit log that enables real-time, high-throughput, fault-tolerant data streaming.'
        }
      },
      {
        id: 2, type: 'tutorial', chapterNum: 2, title: 'Topics & Partitions',
        content: {
          heading: 'How Kafka Organizes Data',
          sections: [
            { type: 'text', heading: 'Topics', body: 'A topic is a category or feed name to which records are published. Topics in Kafka are multi-subscriber — a topic can have zero, one, or many consumers that subscribe to the data written to it.' },
            { type: 'text', heading: 'Partitions', body: 'Each topic is split into partitions. Partitions allow Kafka to scale horizontally. Each partition is an ordered, immutable sequence of records. A partition can only be consumed by one consumer within a consumer group at a time.' },
            { type: 'code', body: '# Create a topic with 3 partitions\nkafka-topics.sh --create \\\n  --topic orders \\\n  --partitions 3 \\\n  --replication-factor 2 \\\n  --bootstrap-server localhost:9092' },
          ],
          takeaway: 'Partitions are the unit of parallelism in Kafka. More partitions = more throughput, but also more overhead. Choose wisely.'
        }
      },
      {
        id: 3, type: 'tutorial', chapterNum: 3, title: 'Producers & Consumers',
        content: {
          heading: 'Sending and Reading Messages',
          sections: [
            { type: 'text', heading: 'Producers', body: 'Producers publish records to topics. By default, Kafka uses round-robin partitioning, but you can provide a key to control which partition a record goes to. Records with the same key always go to the same partition — this is critical for ordering guarantees.' },
            { type: 'text', heading: 'Consumers', body: 'Consumers read records from topics. Every consumer belongs to a consumer group. Within a group, each partition is consumed by exactly one consumer. This is how Kafka achieves parallel consumption without duplicate processing.' },
            { type: 'code', body: '// Consumer poll loop\nwhile (true) {\n  ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));\n  for (ConsumerRecord<String, String> record : records) {\n    System.out.printf("offset=%d key=%s value=%s%n",\n      record.offset(), record.key(), record.value());\n  }\n}' },
          ],
          takeaway: 'The producer key determines partition assignment. Consumer groups enable horizontal scaling of consumption without message duplication.'
        }
      },
      {
        id: 4, type: 'tutorial', chapterNum: 4, title: 'Consumer Groups & Offsets',
        content: {
          heading: 'Scaling Consumption & Tracking Progress',
          sections: [
            { type: 'text', heading: 'Consumer Groups', body: 'Consumer groups allow multiple consumers to share the work of reading from a topic. Kafka automatically rebalances partition assignments when consumers join or leave a group. This is called a rebalance.' },
            { type: 'text', heading: 'Offsets', body: 'An offset is a unique identifier for a record within a partition. Consumers commit offsets to track their progress. If a consumer crashes, it can resume from the last committed offset — this enables at-least-once delivery guarantees.' },
            { type: 'code', body: '# Check consumer group lag\nkafka-consumer-groups.sh --bootstrap-server localhost:9092 \\\n  --group my-group \\\n  --describe' },
          ],
          takeaway: 'Offsets are the foundation of Kafka\'s delivery guarantees. Commit too early = data loss. Commit too late = duplicate processing. Balance is key.'
        }
      },
      {
        id: 5, type: 'tutorial', chapterNum: 5, title: 'Brokers & Replication',
        content: {
          heading: 'Fault Tolerance in Kafka',
          sections: [
            { type: 'text', heading: 'Brokers', body: 'A Kafka cluster is made up of multiple brokers (servers). Each broker holds a subset of partitions. One broker is elected as the leader for each partition — all reads and writes for that partition go through the leader.' },
            { type: 'text', heading: 'Replication', body: 'Kafka replicates each partition across multiple brokers. The replication factor controls how many copies exist. Followers replicate the leader. If the leader fails, a follower is elected as the new leader automatically.' },
            { type: 'code', body: '# Replication factor of 3 means 3 copies across brokers\nkafka-topics.sh --describe --topic orders \\\n  --bootstrap-server localhost:9092\n# Shows: Leader, Replicas, Isr' },
          ],
          takeaway: 'Replication factor >= 3 is the production standard. Never set it to 1 in production — a single broker failure will cause data loss.'
        }
      },
      {
        id: 6, type: 'question', quizNum: 1, title: 'Quiz 1',
        content: {
          questions: [
            {
              id: 1, type: 'mcq',
              question: 'In Kafka, which component is responsible for tracking how far a consumer has read in a partition?',
              options: [
                'The Kafka broker stores this in ZooKeeper automatically',
                'The producer tracks delivery confirmations per consumer',
                'The consumer commits an offset to mark its read position',
                'Kafka uses timestamps to determine what each consumer has seen',
              ],
            },
            {
              id: 2, type: 'mcq',
              question: 'You have a topic with 6 partitions and a consumer group with 8 consumers. How many consumers will be actively consuming?',
              options: [
                'All 8 consumers will each consume from at least one partition',
                '6 consumers will be active, 2 will be idle',
                '8 consumers will share each partition equally',
                'Only 1 consumer will be active as Kafka serializes reads',
              ],
            },
            {
              id: 3, type: 'written',
              question: 'Explain what happens during a Kafka consumer group rebalance. Why can it be problematic in a high-throughput system, and what strategies can minimize its impact?',
            },
          ]
        }
      },
    ]
  }
};

// ─── Answer key (lives on the server, never sent with getCourse) ──────────────

const MOCK_ANSWER_KEYS = {
  '3_6': [
    {
      id: 1, type: 'mcq', correct: 2,
      explanation: 'Consumers commit offsets to Kafka (stored in an internal topic __consumer_offsets) to track their position. This allows consumers to resume from exactly where they left off after a restart or crash.'
    },
    {
      id: 2, type: 'mcq', correct: 1,
      explanation: 'Each partition is assigned to exactly one consumer within a group. With 6 partitions and 8 consumers, only 6 consumers get a partition. The remaining 2 sit idle until an active consumer leaves the group.'
    },
    {
      id: 3, type: 'written',
      modelAnswer: 'A rebalance occurs when the membership of a consumer group changes — a consumer joins, leaves, or crashes. During a rebalance, all consumers stop consuming (stop-the-world) while Kafka\'s group coordinator reassigns partitions.\n\nProblems in high-throughput systems:\n- Rebalances cause processing pauses, increasing latency\n- Uncommitted offsets may be reprocessed, causing duplicates\n- Frequent rebalances can cause cascading failures\n\nStrategies to minimize impact:\n- Use static group membership (group.instance.id) — Kafka skips rebalance for known members on rejoin\n- Tune session.timeout.ms and heartbeat.interval.ms appropriately\n- Use incremental cooperative rebalancing — only reassigns partitions that need to move\n- Commit offsets frequently to minimize reprocessing on rebalance'
    },
  ],
};

function genericAnswerKey(questions) {
  return questions.map((q) => {
    if (q.type === 'mcq') return { id: q.id, type: 'mcq', correct: 1, explanation: 'Option B is correct. Understanding the primary purpose of each tool is essential for making good architectural decisions.' };
    return { id: q.id, type: 'written', modelAnswer: 'A strong answer identifies a specific scaling or architectural challenge, explains why this tool is the ideal solution, and contrasts it with a naive approach. The best answers include concrete numbers or constraints.' };
  });
}

// ─── Generic courses ──────────────────────────────────────────────────────────

function generateGenericCourse(id, title, icon, color) {
  return {
    id, title, icon, color,
    pages: [
      {
        id: 1, type: 'tutorial', chapterNum: 1, title: 'Introduction',
        content: {
          heading: `Welcome to ${title}`,
          sections: [
            { type: 'text', heading: 'Overview', body: `This course covers ${title} from fundamentals to advanced production patterns. You'll build real-world knowledge through guided chapters and hands-on quizzes.` },
            { type: 'text', heading: 'What you will learn', body: 'By the end of this course, you will be able to architect, deploy, and optimize systems using the concepts covered. Each chapter builds on the previous one, so follow the track in order for best results.' },
          ],
          takeaway: `${title} is a foundational skill for modern engineering. Master it to unlock senior-level system design conversations.`
        }
      },
      {
        id: 2, type: 'tutorial', chapterNum: 2, title: 'Core Concepts',
        content: {
          heading: 'Building the Foundation',
          sections: [
            { type: 'text', heading: 'Key Principles', body: 'Understanding the core principles is essential before diving into advanced topics. This chapter establishes the mental models you will use throughout the course.' },
            { type: 'code', body: '// Core concept example\n// More detailed examples will follow in later chapters' },
          ],
          takeaway: 'Strong fundamentals prevent 90% of production bugs. Never skip the basics.'
        }
      },
      {
        id: 3, type: 'question', quizNum: 1, title: 'Quiz 1',
        content: {
          questions: [
            {
              id: 1, type: 'mcq',
              question: `Which of the following best describes the primary use case for ${title}?`,
              options: [
                'Replacing traditional relational databases entirely',
                'Solving specific architectural challenges at scale',
                'Serving as a general-purpose programming framework',
                'Automating developer workflows and CI/CD pipelines',
              ],
            },
            {
              id: 2, type: 'written',
              question: `Describe a real-world scenario where ${title} would be the right tool to use. What problem does it solve, and what would the alternative be without it?`,
            },
          ]
        }
      },
    ]
  };
}

const GENERIC_COURSES = {
  1: generateGenericCourse(1, 'Mastering MCP', 'MCP', 'blue'),
  2: generateGenericCourse(2, 'Advanced Redis', 'RDS', 'red'),
  4: generateGenericCourse(4, 'Kubernetes Mastery', 'K8S', 'blue'),
  5: generateGenericCourse(5, 'GraphQL in Depth', 'GQL', 'purple'),
  6: generateGenericCourse(6, 'System Design', 'SYS', 'red'),
};

// ─── Public API ───────────────────────────────────────────────────────────────

export function getAllCourses() {
  // ── REAL ──
  return apiFetch('/api/courses').then((r) => r.json());

  // ── MOCK ──
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve([
  //       { id: 1, title: 'DSA in Java',        description: 'Master Data Structures and Algorithms using Java from scratch.', thumbnailUrl: null, level: 'BEGINNER',      category: 'DSA'           },
  //       { id: 2, title: 'System Design',       description: 'Learn to design scalable systems like a senior engineer.',       thumbnailUrl: null, level: 'ADVANCED',      category: 'System Design' },
  //       { id: 3, title: 'Spring Boot Mastery', description: 'Build production-ready REST APIs with Spring Boot 3.',           thumbnailUrl: null, level: 'INTERMEDIATE',  category: 'Backend'       },
  //     ]);
  //   }, 700);
  // });
}

export function getCourse(courseId) {
  // ── REAL ──
  // return apiFetch(`/api/courses/${courseId}/pages`).then((r) => r.json());

  // ── MOCK ──
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const course = MOCK_COURSES[courseId] || GENERIC_COURSES[courseId];
      if (course) resolve(course);
      else reject(new Error('Course not found'));
    }, 700);
  });
}

export function submitQuiz(courseId, pageId, answers) {
  // answers: [{ id, type, selected? (mcq index), text? (written) }]

  // ── REAL ──
  // return apiFetch(`/api/courses/${courseId}/quiz/${pageId}/submit`, {
  //   method: 'POST',
  //   body: JSON.stringify({ answers }),
  // }).then((r) => r.json());

  // ── MOCK ──
  return new Promise((resolve) => {
    setTimeout(() => {
      const key = `${courseId}_${pageId}`;
      const course = MOCK_COURSES[courseId] || GENERIC_COURSES[courseId];
      const page   = course?.pages.find((p) => p.id === pageId);
      const results = MOCK_ANSWER_KEYS[key] || genericAnswerKey(page?.content.questions || []);
      resolve({ results });
    }, 900);
  });
}
