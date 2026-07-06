import './TaskCard.css';

function TaskCard({ task, onDelete, onEdit, onComplete, onClick }) {

    const date = new Date(task.created_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    return (
        <div className="task-card" onClick={() => onClick(task)}>
            <div className="task-card-header">
                <div className="task-title">{task.title}</div>
                <span className="badge badge-active">Active</span>
            </div>

            <div className="task-desc">
                {task.description || 'No description.'}
            </div>

            <div className="task-footer">
                <span className="task-date">{date}</span>
                <div className="task-actions" onClick={e => e.stopPropagation()}>
                    <button className="btn btn-sm btn-success" onClick={() => onComplete(task.id)}>✅</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => onEdit(task)}>✏️</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(task.id)}>🗑️</button>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;