import '../../styles/TutorialContent.css';

export default function TutorialContent({ page, onPrev, onNext, hasPrev, hasNext }) {
  const { content } = page;

  return (
    <div className="tutorial">
      <div className="tutorial-chapter-tag">Chapter {page.chapterNum}</div>
      <h2 className="tutorial-heading">{content.heading}</h2>

      <div className="tutorial-sections">
        {content.sections.map((s, i) => (
          <div key={i}>
            {s.type === 'text' && (
              <div className="tutorial-text-block">
                {s.heading && <h3>{s.heading}</h3>}
                <p>{s.body}</p>
              </div>
            )}
            {s.type === 'code' && (
              <pre className="tutorial-code"><code>{s.body}</code></pre>
            )}
          </div>
        ))}
      </div>

      {content.takeaway && (
        <div className="tutorial-takeaway">
          <span className="takeaway-icon">💡</span>
          <p>{content.takeaway}</p>
        </div>
      )}

      <div className="tutorial-nav">
        <button className="btn-outline" onClick={onPrev} disabled={!hasPrev}>← Prev</button>
        <button className="btn-primary" onClick={onNext} disabled={!hasNext}>
          {hasNext ? 'Next →' : 'Finished'}
        </button>
      </div>
    </div>
  );
}
