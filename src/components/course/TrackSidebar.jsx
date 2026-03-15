import '../../styles/TrackSidebar.css';

export default function TrackSidebar({ pages, currentId, completedIds, onSelect }) {
  const tutorials = pages.filter((p) => p.type === 'tutorial');
  const questions = pages.filter((p) => p.type === 'question');

  function Item({ page }) {
    const isActive    = page.id === currentId;
    const isCompleted = completedIds.includes(page.id);
    return (
      <div
        className={`track-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
        onClick={() => onSelect(page.id)}
      >
        <div className="track-dot">
          {isCompleted ? '✓' : isActive ? '▶' : ''}
        </div>
        <span className="track-label">{page.title}</span>
      </div>
    );
  }

  return (
    <aside className="track-sidebar">
      <p className="track-section-label">CHAPTERS</p>
      {tutorials.map((p) => <Item key={p.id} page={p} />)}

      {questions.length > 0 && (
        <>
          <p className="track-section-label" style={{ marginTop: 20 }}>QUIZZES</p>
          {questions.map((p) => <Item key={p.id} page={p} />)}
        </>
      )}
    </aside>
  );
}
