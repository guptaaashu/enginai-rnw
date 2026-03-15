import '../styles/Courses.css';

const courses = [
  {
    id: 1,
    icon: 'MCP',
    color: 'blue',
    title: 'Mastering MCP',
    description: 'Deep dive into the Model Context Protocol and build production-ready AI integrations.',
    hours: 13,
  },
  {
    id: 2,
    icon: 'RDS',
    color: 'red',
    title: 'Advanced Redis',
    description: 'Master Redis for caching, pub/sub, and real-time data processing at scale.',
    hours: 15,
  },
  {
    id: 3,
    icon: 'KFK',
    color: 'purple',
    title: 'Kafka Architecture',
    description: 'Build event-driven systems with Apache Kafka from fundamentals to advanced patterns.',
    hours: 16,
  },
];

export default function Courses({ onLoginClick }) {
  return (
    <section className="courses">
      <h2>Available Courses</h2>
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className={`course-icon ${course.color}`}>{course.icon}</div>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <div className="course-footer">
              <span className="hours">⏱ {course.hours} hrs</span>
              <a href="#" className="view-link" onClick={(e) => { e.preventDefault(); onLoginClick(); }}>View Course →</a>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-outline" onClick={onLoginClick}>View All Courses →</button>
    </section>
  );
}
