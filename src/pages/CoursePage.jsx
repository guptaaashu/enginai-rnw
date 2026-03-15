import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCourse } from '../services/courseService';
import CourseTopBar from '../components/course/CourseTopBar';
import TrackSidebar from '../components/course/TrackSidebar';
import TutorialContent from '../components/course/TutorialContent';
import QuestionContent from '../components/course/QuestionContent';
import CourseAI from '../components/course/CourseAI';
import '../styles/CoursePage.css';

export default function CoursePage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);

  useEffect(() => {
    setLoading(true);
    getCourse(Number(courseId))
      .then((data) => {
        setCourse(data);
        setCurrentPageId(data.pages[0].id);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [courseId]);

  if (loading) return (
    <div className="course-loading">
      <div className="loading-spinner" />
      <p>Loading course...</p>
    </div>
  );

  if (error) return (
    <div className="course-loading">
      <p>Course not found.</p>
    </div>
  );

  const pages       = course.pages;
  const currentPage = pages.find((p) => p.id === currentPageId);
  const currentIdx  = pages.findIndex((p) => p.id === currentPageId);
  const isTutorial  = currentPage.type === 'tutorial';

  function goTo(id) {
    setCurrentPageId(id);
    window.scrollTo(0, 0);
  }

  function goNext() {
    if (currentIdx < pages.length - 1) {
      setCompletedIds((prev) => prev.includes(currentPageId) ? prev : [...prev, currentPageId]);
      goTo(pages[currentIdx + 1].id);
    }
  }

  function goPrev() {
    if (currentIdx > 0) goTo(pages[currentIdx - 1].id);
  }

  return (
    <div className="course-page">
      <CourseTopBar
        title={course.title}
        currentPage={completedIds.length}
        totalPages={pages.length}
      />

      <div className="course-body">
        <TrackSidebar
          pages={pages}
          currentId={currentPageId}
          completedIds={completedIds}
          onSelect={goTo}
        />

        <main className="course-main">
          {isTutorial
            ? <TutorialContent
                page={currentPage}
                onNext={goNext}
                onPrev={goPrev}
                hasNext={currentIdx < pages.length - 1}
                hasPrev={currentIdx > 0}
              />
            : <QuestionContent
                page={currentPage}
                courseId={course.id}
                onNext={goNext}
                onPrev={goPrev}
                hasNext={currentIdx < pages.length - 1}
                hasPrev={currentIdx > 0}
                onComplete={() => setCompletedIds((prev) => prev.includes(currentPageId) ? prev : [...prev, currentPageId])}
              />
          }
        </main>

        {isTutorial && <CourseAI chapterTitle={currentPage.title} />}
      </div>
    </div>
  );
}
