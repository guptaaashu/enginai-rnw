import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCourse, getPage, completePage } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import CourseTopBar from '../components/course/CourseTopBar';
import TrackSidebar from '../components/course/TrackSidebar';
import TutorialContent from '../components/course/TutorialContent';
import QuestionContent from '../components/course/QuestionContent';
import CourseAI from '../components/course/CourseAI';
import '../styles/CoursePage.css';

export default function CoursePage() {
  const { courseId } = useParams();
  const { loading: authLoading } = useAuth();
  const [course, setCourse] = useState(null);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load course stubs + resume position — wait for auth to restore session first
  useEffect(() => {
    if (authLoading) return;
    setCourseLoading(true);
    getCourse(Number(courseId))
      .then((data) => {
        setCourse(data);
        setCompletedIds(data.completedPageIds || []);
        setCurrentPageId(data.currentPageId || data.pages[0]?.id);
        setCourseLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setCourseLoading(false);
      });
  }, [courseId, authLoading]);

  // Load full page content whenever currentPageId changes
  useEffect(() => {
    if (!currentPageId) return;
    setPageLoading(true);
    getPage(Number(courseId), currentPageId)
      .then((data) => {
        setCurrentPage(data);
        setPageLoading(false);
      })
      .catch(() => setPageLoading(false));
  }, [courseId, currentPageId]);

  if (courseLoading) return (
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

  const pages      = course.pages;
  const currentIdx = pages.findIndex((p) => p.id === currentPageId);
  const isTutorial = currentPage?.type === 'tutorial';

  function goTo(id) {
    setCurrentPageId(id);
    window.scrollTo(0, 0);
  }

  function goNext() {
    if (currentIdx < pages.length - 1) {
      setCompletedIds((prev) => prev.includes(currentPageId) ? prev : [...prev, currentPageId]);
      if (isTutorial) completePage(Number(courseId), currentPageId);
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
          {pageLoading ? (
            <div className="course-loading">
              <div className="loading-spinner" />
            </div>
          ) : currentPage && (
            isTutorial
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
                  isCompleted={completedIds.includes(currentPageId)}
                  onNext={goNext}
                  onPrev={goPrev}
                  hasNext={currentIdx < pages.length - 1}
                  hasPrev={currentIdx > 0}
                  onComplete={() => setCompletedIds((prev) => prev.includes(currentPageId) ? prev : [...prev, currentPageId])}
                />
          )}
        </main>

        {isTutorial && !pageLoading && currentPage && (
          <CourseAI chapterTitle={currentPage.title} />
        )}
      </div>
    </div>
  );
}
