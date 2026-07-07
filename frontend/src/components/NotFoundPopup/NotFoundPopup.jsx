// src/components/NotFoundPopup/NotFoundPopup.jsx
import './NotFoundPopup.css';

function NotFoundPopup({ query, onClose }) {
    return (
        <div className="notfound-overlay" onClick={onClose}>
            <div className="notfound-card" onClick={e => e.stopPropagation()}>
                <button className="notfound-close" onClick={onClose}>✕</button>

                <div className="notfound-icon">🔍</div>
                <div className="notfound-title">No task found</div>
                <div className="notfound-message">
                    We couldn't find a task matching{' '}
                    <span className="notfound-query">"{query}"</span>
                </div>

                <button className="btn btn-primary notfound-btn" onClick={onClose}>
                    Got it
                </button>
            </div>
        </div>
    );
}

export default NotFoundPopup;