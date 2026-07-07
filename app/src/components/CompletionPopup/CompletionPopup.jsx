// src/components/CompletionPopup/CompletionPopup.jsx
import { useEffect } from 'react';
import './CompletionPopup.css';

function CompletionPopup({ streak, onClose }) {

    // auto close after 3 seconds
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="completion-overlay" onClick={onClose}>
            <div className="completion-card" onClick={e => e.stopPropagation()}>

                <div className="completion-emoji">🎉</div>

                <div className="completion-title">Task Completed!</div>

                <div className="completion-streak">
                    <span className="completion-fire">🔥</span>
                    <span className="completion-streak-number">{streak}</span>
                    <span className="completion-streak-label">
                        day streak{streak > 1 ? '!' : ' — keep it up!'}
                    </span>
                </div>

                <div className="completion-bar">
                    {[...Array(7)].map((_, i) => (
                        <div
                            key={i}
                            className={`completion-day ${i < streak ? 'done' : ''}`}
                            style={{ animationDelay: `${i * 0.08}s` }}
                        />
                    ))}
                </div>

                <div className="completion-sub">Keep building your streak!</div>

                <button className="btn btn-primary" onClick={onClose}>
                    Continue →
                </button>

                {/* progress bar that empties over 3 seconds */}
                <div className="completion-timer">
                    <div className="completion-timer-bar"></div>
                </div>
            </div>
        </div>
    );
}

export default CompletionPopup;