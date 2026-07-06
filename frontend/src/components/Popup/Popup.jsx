import './Popup.css';

function Popup({ title, description, onConfirm, onCancel }) {
  return (
    <div className="popup-overlay" onClick={onCancel}>
      <div className="popup-card" onClick={e => e.stopPropagation()}>
        <div className="popup-icon">🗑️</div>
        <div className="popup-title">{title || 'Are you sure?'}</div>
        <div className="popup-desc">
          {description || 'This action cannot be undone.'}
        </div>
        <div className="popup-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete Task</button>
        </div>
      </div>
    </div>
  );
}

export default Popup;