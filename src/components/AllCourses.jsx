import { useNavigate } from 'react-router-dom';
import '../styles/AllCourses.css';

const courses = [
  { id: 1, icon: 'MCP', color: 'blue',   title: 'Mastering MCP',       description: 'Build production-ready AI integrations with the Model Context Protocol.', hours: 13 },
  { id: 2, icon: 'RDS', color: 'red',    title: 'Advanced Redis',       description: 'Master Redis for caching, pub/sub, and real-time data processing at scale.', hours: 15 },
  { id: 3, icon: 'KFK', color: 'purple', title: 'Kafka Architecture',   description: 'Build event-driven systems with Apache Kafka from fundamentals to advanced patterns.', hours: 16 },
  { id: 4, icon: 'K8S', color: 'blue',   title: 'Kubernetes Mastery',   description: 'Deploy, scale, and manage containerized applications with Kubernetes.', hours: 18 },
  { id: 5, icon: 'GQL', color: 'purple', title: 'GraphQL in Depth',     description: 'Design flexible and efficient APIs using GraphQL from schema to production.', hours: 12 },
  { id: 6, icon: 'SYS', color: 'red',    title: 'System Design',        description: 'Learn to architect large-scale distributed systems used at top tech companies.', hours: 20 },
];

export default function AllCourses() {
  const navigate = useNavigate();
  return (
    <section className="all-courses">
      <h2>All Courses</h2>
      <div className="all-courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className={`course-icon ${course.color}`}>{course.icon}</div>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <div className="course-footer">
              <span className="hours">⏱ {course.hours} hrs</span>
              <button className="btn-primary" onClick={() => navigate(`/course/${course.id}`)}>Start Course</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
