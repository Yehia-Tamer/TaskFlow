// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskCard from '../components/TaskCard/TaskCard';
import TaskForm from '../components/TaskForm/TaskForm';
import TaskDetailPopup from '../components/TaskDetailPopup/TaskDetailPopup';
import CompletionPopup from '../components/CompletionPopup/CompletionPopup';
import Popup from '../components/Popup/Popup';
import './Home.css';

function lerp(a, b, t) {
    return Math.round(a + (b - a) * t);
}

function getBarColor(pct) {
    // gradient red -> yellow -> green
    const red = { r: 239, g: 68, b: 68 };
    const yellow = { r: 234, g: 179, b: 8 };
    const green = { r: 34, g: 197, b: 94 };

    if (pct <= 0) return `rgb(${red.r}, ${red.g}, ${red.b})`;

    if (pct <= 50) {
        const t = pct / 50;
        return `rgb(${lerp(red.r, yellow.r, t)}, ${lerp(red.g, yellow.g, t)}, ${lerp(red.b, yellow.b, t)})`;
    } else {
        const t = (pct - 50) / 50;
        return `rgb(${lerp(yellow.r, green.r, t)}, ${lerp(yellow.g, green.g, t)}, ${lerp(yellow.b, green.b, t)})`;
    }
}

function Home() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [completionStreak, setCompletionStreak] = useState(null);

    const token = localStorage.getItem('token');

    // redirect to login if no token
    useEffect(() => {
        if (!token) navigate('/login');
    }, []);

    // fetch tasks on load
    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            const response = await axios.get('http://localhost:8001/tasks/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(formData) {
        try {
            await axios.post('http://localhost:8001/tasks/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowForm(false);
            fetchTasks(); // refresh list
        } catch (err) {
            console.log(err);
        }
    }

    async function handleUpdate(formData) {
        try {
            await axios.put(
                `http://localhost:8001/tasks/${selectedTask.id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` }}
            );
            setShowForm(false);
            setSelectedTask(null);
            fetchTasks();
        } catch (err) {
            console.log(err);
        }
    }

    async function handleDelete() {
        try {
            await axios.delete(`http://localhost:8001/tasks/${deleteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowPopup(false);
            setDeleteId(null);
            fetchTasks();
        } catch (err) {
            console.log(err);
        }
    }

    async function handleComplete(id) {
        try {
            await axios.post(
                `http://localhost:8001/tasks/${id}/complete`,
                {},
                { headers: { Authorization: `Bearer ${token}` }}
            );

            const streakRes = await axios.get(
                `http://localhost:8001/tasks/${id}/streak`,
                { headers: { Authorization: `Bearer ${token}` }}
            );

            setCompletionStreak(streakRes.data.current_streak);
            fetchTasks();

        } catch (err) {
            console.log(err);
        }
    }

    function onEdit(task) {
        setSelectedTask(task);
        setShowForm(true);
    }

    function onDelete(id) {
        setDeleteId(id);
        setShowPopup(true);
    }

    function onFormSubmit(formData) {
        if (selectedTask) {
            handleUpdate(formData);
        } else {
            handleCreate(formData);
        }
    }

    const completedToday = tasks.filter(t => t.completed_today).length;
    const percentDone = tasks.length === 0 ? 0 : Math.round((completedToday / tasks.length) * 100);
    const maxStreak = tasks.length === 0 ? 0 : Math.max(...tasks.map(t => t.current_streak || 0));

    return (
        <div className="home-page">

            {/* Header */}
            <div className="home-header">
                <div>
                    <div className="page-title">My Tasks</div>
                    <div className="page-sub">Track your progress and build streaks</div>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => { setSelectedTask(null); setShowForm(true); }}
                >
                    + New Task
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-number">{tasks.length}</div>
                    <div className="stat-label">Total Tasks</div>
                </div>

                <div className="stat-card">
                    <div className="stat-number">{percentDone}%</div>
                    <div className="stat-label">Completed Today</div>
                    <div className="progress-track">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${percentDone}%`,
                                backgroundColor: getBarColor(percentDone)
                            }}
                        />
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-number">🔥 {maxStreak}</div>
                    <div className="stat-label">Day Streak</div>
                </div>
            </div>

            {/* Task List */}
            {loading ? (
                <div className="cards-grid">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="task-card">
                            <div className="skeleton" style={{ height: '14px', width: '55%', marginBottom: '12px' }}></div>
                            <div className="skeleton" style={{ height: '11px', width: '90%', marginBottom: '7px' }}></div>
                            <div className="skeleton" style={{ height: '11px', width: '70%', marginBottom: '18px' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div className="skeleton" style={{ height: '22px', width: '75px' }}></div>
                                <div className="skeleton" style={{ height: '22px', width: '55px' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : tasks.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <div className="empty-title">No tasks yet</div>
                    <div className="empty-sub">Create your first task to get started</div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        + Create Task
                    </button>
                </div>
            ) : (
                <div className="cards-grid">
                    {tasks.map((task, i) => (
                        <div key={task.id} className={`s${(i % 4) + 1}`}>
                            <TaskCard
                                task={task}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onComplete={handleComplete}
                                onClick={(task) => setSelectedDetail(task.id)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Task Form Modal */}
            {showForm && (
                <TaskForm
                    onSubmit={onFormSubmit}
                    onCancel={() => { setShowForm(false); setSelectedTask(null); }}
                    initial={selectedTask || {}}
                />
            )}

            {/* Delete Confirmation */}
            {showPopup && (
                <Popup
                    title="Delete Task?"
                    description="This cannot be undone. The task and all its completion history will be permanently deleted."
                    onConfirm={handleDelete}
                    onCancel={() => { setShowPopup(false); setDeleteId(null); }}
                />
            )}

            {selectedDetail && (
                <TaskDetailPopup
                    taskId={selectedDetail}
                    onClose={() => setSelectedDetail(null)}
                />
            )}

            {completionStreak !== null && (
                <CompletionPopup
                    streak={completionStreak}
                    onClose={() => setCompletionStreak(null)}
                />
            )}

        </div>
    );
}

export default Home;