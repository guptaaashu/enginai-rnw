import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCourses } from '../services/courseService';
import '../styles/AllCourses.css';

const LEVEL_COLOR = { BEGINNER: 'blue', INTERMEDIATE: 'purple', ADVANCED: 'red' };

export default function AllCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getAllCourses().then(setCourses);
  }, []);

  return (
    <section className="all-courses">
      <h2>All Courses</h2>
      <div className="all-courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className={`course-icon ${LEVEL_COLOR[course.level] || 'blue'}`}>
              {course.category?.slice(0, 3).toUpperCase()}
            </div>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <div className="course-footer">
              <span className="hours">{course.level}</span>
              <button className="btn-primary" onClick={() => navigate(`/course/${course.id}`)}>Start Course</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
