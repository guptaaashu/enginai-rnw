import { useNavigate } from 'react-router-dom';
import '../styles/OngoingCourses.css';

const ongoing = [
  {
    id: 1,
    icon: 'KFK',
    color: 'purple',
    title: 'Kafka Architecture',
    progress: 42,
    lastModule: 'Consumer Groups & Offsets',
  },
  {
    id: 2,
    icon: 'RDS',
    color: 'red',
    title: 'Advanced Redis',
    progress: 71,
    lastModule: 'Pub/Sub Patterns',
  },
];

export default function OngoingCourses() {
  const navigate = useNavigate();
  return (
    <section className="ongoing">
      <h2>Continue Learning</h2>
      <div className="ongoing-grid">
        {ongoing.map((course) => (
          <div key={course.id} className="ongoing-card">
            <div className="ongoing-card-top">
              <div className={`course-icon ${course.color}`}>{course.icon}</div>
              <div>
                <h3>{course.title}</h3>
                <p className="last-module">Last: {course.lastModule}</p>
              </div>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${course.progress}%` }} />
            </div>
            <div className="ongoing-card-footer">
              <span className="progress-label">{course.progress}% complete</span>
              <button className="btn-primary" onClick={() => navigate(`/course/${course.id}`)}>Continue →</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
