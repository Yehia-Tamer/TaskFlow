// src/components/TaskDetailPopup/TaskDetailPopup.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './TaskDetailPopup.css';

function TaskDetailPopup({ taskId, onClose }) {
    const [task, setTask] = useState(null);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        async function fetchTask() {
            try {
                const [taskRes, streakRes] = await Promise.all([
                    axios.get(`http://localhost:8001/tasks/${taskId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`http://localhost:8001/tasks/${taskId}/streak`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setTask(taskRes.data);
                setStreak(streakRes.data.current_streak);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        fetchTask();
    }, [taskId]);

    const date = task ? new Date(task.created_at).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    }) : '';

    return (
        <div className="detail-overlay" onClick={onClose}>
            <div className="detail-card" onClick={e => e.stopPropagation()}>

                {loading ? (
                    <>
                        <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '16px' }}></div>
                        <div className="skeleton" style={{ height: '14px', width: '90%', marginBottom: '8px' }}></div>
                        <div className="skeleton" style={{ height: '14px', width: '75%' }}></div>
                    </>
                ) : (
                    <>
                        {/* Header */}
                        <div className="detail-header">
                            <div className="detail-title">{task.title}</div>
                            <button className="detail-close" onClick={onClose}>✕</button>
                        </div>

                        {/* Description */}
                        <div className="detail-section">
                            <div className="detail-label">Description</div>
                            <div className="detail-desc">
                                {task.description || 'No description provided.'}
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="detail-section">
                            <div className="detail-label">Created</div>
                            <div className="detail-meta">{date}</div>
                        </div>

                        <div className="detail-section">
                            <div className="detail-label">Owner</div>
                            <div className="detail-meta">@{task.owner.username}</div>
                        </div>

                        {/* Streak */}
                        <div className="detail-section">
                            <div className="detail-label">Current Streak</div>
                            <div className="streak-display">
                                <span className="streak-fire">🔥</span>
                                <span className="streak-number">{streak}</span>
                                <span className="streak-text">day{streak !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="streak-bar" style={{ marginTop: '10px' }}>
                                {[...Array(7)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`streak-day ${i < streak ? 'done' : ''}`}
                                        title={`Day ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default TaskDetailPopup;