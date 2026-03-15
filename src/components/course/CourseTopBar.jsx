import { useNavigate } from 'react-router-dom';
import '../../styles/CourseTopBar.css';

export default function CourseTopBar({ title, currentPage, totalPages }) {
  const navigate = useNavigate();
  const progress = Math.round((currentPage / totalPages) * 100);

  return (
    <div className="course-topbar">
      <button className="back-btn" onClick={() => navigate('/home')}>← Home</button>
      <h1 className="course-topbar-title">{title}</h1>
      <div className="topbar-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-text">{currentPage}/{totalPages} completed</span>
      </div>
    </div>
  );
}
