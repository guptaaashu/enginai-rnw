import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnrolledCourses } from '../services/courseService';
import '../styles/OngoingCourses.css';

const LEVEL_COLOR = { BEGINNER: 'blue', INTERMEDIATE: 'purple', ADVANCED: 'red' };

export default function OngoingCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getEnrolledCourses().then(setCourses);
  }, []);

  if (courses.length === 0) return null;

  return (
    <section className="ongoing">
      <h2>Continue Learning</h2>
      <div className="ongoing-grid">
        {courses.map((course) => {
          const progress = course.totalPages > 0
            ? Math.round((course.completedPages / course.totalPages) * 100)
            : 0;
          return (
            <div key={course.id} className="ongoing-card">
              <div className="ongoing-card-top">
                <div className={`course-icon ${LEVEL_COLOR[course.level] || 'blue'}`}>
                  {course.category?.slice(0, 3).toUpperCase()}
                </div>
                <div>
                  <h3>{course.title}</h3>
                  <p className="last-module">{course.level}</p>
                </div>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="ongoing-card-footer">
                <span className="progress-label">{progress}% complete</span>
                <button className="btn-primary" onClick={() => navigate(`/course/${course.id}`)}>Continue →</button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
