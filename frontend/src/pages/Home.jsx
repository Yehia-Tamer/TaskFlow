// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskCard from '../components/TaskCard/TaskCard';
import TaskForm from '../components/TaskForm/TaskForm';
import TaskDetailPopup from '../components/TaskDetailPopup/TaskDetailPopup';
import Popup from '../components/Popup/Popup';
import './Home.css';

function Home() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [selectedDetail, setSelectedDetail] = useState(null);

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
                    <div className="stat-number">
                        {tasks.filter(t => t.completed).length}
                    </div>
                    <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">🔥 0</div>
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
        </div>

        
    );
}

export default Home;