import { useState } from 'react';
import './TaskForm.css';

function TaskForm({ onSubmit, onCancel, initial = {} }) {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ title, description });
  }

  return (
    <div className="task-form-overlay" onClick={onCancel}>
      <div className="task-form-card" onClick={e => e.stopPropagation()}>
        <div className="task-form-title">
          {initial.id ? 'Edit Task' : 'New Task'}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              placeholder="What do you need to do?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              placeholder="Add more details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {initial.id ? 'Save Changes' : 'Create Task →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;