import { useState } from 'react';
import { submitQuiz } from '../../services/courseService';
import '../../styles/QuestionContent.css';

export default function QuestionContent({ page, courseId, onPrev, onNext, hasPrev, hasNext, onComplete }) {
  const questions = page.content.questions;
  const [answers, setAnswers]   = useState({});
  const [loading, setLoading]   = useState(false);
  const [results, setResults]   = useState(null); // { id, type, correct?, explanation?, modelAnswer? }[]

  function setAnswer(id, value) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  const allAnswered = questions.every((q) => {
    const ans = answers[q.id];
    if (q.type === 'mcq')     return ans !== undefined && ans !== null;
    if (q.type === 'written') return typeof ans === 'string' && ans.trim().length > 0;
    return false;
  });

  async function handleSubmit() {
    if (!allAnswered || loading) return;
    setLoading(true);

    // Build { questionId: answerText } — option text for MCQ, response text for written
    const answersMap = Object.fromEntries(
      questions.map((q) => [
        q.id,
        q.type === 'mcq' ? q.options[answers[q.id]] : answers[q.id],
      ])
    );

    try {
      const res = await submitQuiz(courseId, page.id, answersMap);
      setResults(res);
      onComplete();
    } finally {
      setLoading(false);
    }
  }

  // resultMap keyed by questionId
  const resultMap = results ? Object.fromEntries(results.map((r) => [r.questionId, r])) : {};

  const mcqScore  = results ? results.filter((r) => r.type === 'mcq' && r.correct === true).length : 0;
  const totalMcq  = questions.filter((q) => q.type === 'mcq').length;

  return (
    <div className="question-page">
      <div className="question-tag">Quiz {page.quizNum}</div>
      <h2 className="question-title">{page.title}</h2>

      {results && (
        <div className="quiz-score-banner">
          <span className="score-num">{mcqScore}/{totalMcq}</span>
          <span className="score-label">MCQ score</span>
          <span className="score-divider" />
          <span className="score-written">Written answers reviewed below</span>
        </div>
      )}

      <div className="quiz-questions">
        {questions.map((q, idx) => {
          const res = resultMap[q.id];
          return (
            <div key={q.id} className="quiz-question-block">
              <p className="quiz-q-number">
                Q{idx + 1}
                <span className={`q-type-badge ${q.type}`}>
                  {q.type === 'mcq' ? 'MCQ' : 'Written'}
                </span>
              </p>
              <p className="question-text">{q.question}</p>

              {q.type === 'mcq' && (
                <div className="options">
                  {q.options.map((opt, i) => {
                    let cls = 'option';
                    if (res) {
                      if (opt === res.correctAnswer)  cls += ' correct';
                      else if (i === answers[q.id])   cls += ' wrong';
                    } else if (i === answers[q.id]) {
                      cls += ' selected';
                    }
                    return (
                      <div key={i} className={cls} onClick={() => !results && setAnswer(q.id, i)}>
                        <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                        {opt}
                      </div>
                    );
                  })}
                  {res && (
                    <div className={`result-box ${res.correct ? 'correct' : 'wrong'}`}>
                      <p className="result-title">
                        {res.correct ? '✓ Correct!' : '✗ Incorrect'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {q.type === 'written' && (
                <div className="written">
                  <textarea
                    className="written-input"
                    placeholder="Write your answer here..."
                    value={answers[q.id] || ''}
                    onChange={(e) => !results && setAnswer(q.id, e.target.value)}
                    rows={6}
                    disabled={!!results}
                  />
                  {res && (
                    <>
                      <div className="submitted-answer">
                        <p className="submitted-label">Your Answer</p>
                        <p>{answers[q.id]}</p>
                      </div>
                      <div className="model-answer">
                        <p className="model-label">✦ Model Answer</p>
                        <p>{res.modelAnswer}</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!results ? (
        <button
          className="btn-primary submit-quiz-btn"
          onClick={handleSubmit}
          disabled={!allAnswered || loading}
        >
          {loading ? <span className="submit-spinner" /> : 'Submit Quiz →'}
        </button>
      ) : (
        <div className="question-nav">
          <button className="btn-outline" onClick={onPrev} disabled={!hasPrev}>← Prev</button>
          <button className="btn-primary" onClick={onNext} disabled={!hasNext}>
            {hasNext ? 'Next →' : 'Finished'}
          </button>
        </div>
      )}
    </div>
  );
}
