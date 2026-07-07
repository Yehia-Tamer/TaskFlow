import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        async function fetchUser() {
            try {
                const res = await axios.get('http://localhost:8001/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    }

    function getInitials(name) {
        if (!name) return 'N';
        const parts = name.trim().split(' ').filter(Boolean);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-card">
                    <div className="skeleton" style={{ height: '80px', width: '80px', borderRadius: '50%', margin: '0 auto 20px' }}></div>
                    <div className="skeleton" style={{ height: '20px', width: '50%', margin: '0 auto 12px' }}></div>
                    <div className="skeleton" style={{ height: '14px', width: '70%', margin: '0 auto' }}></div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <button className="profile-back" onClick={() => navigate('/home')}>
                ← Back
            </button>
            <div className="profile-card">
                <div className="profile-avatar">{getInitials(user?.username)}</div>
                <div className="profile-name">{user?.username}</div>
                <div className="profile-email">{user?.email}</div>

                <div className="profile-info">
                    <div className="profile-row">
                        <span className="profile-label">Username</span>
                        <span className="profile-value">{user?.username}</span>
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">Email</span>
                        <span className="profile-value">{user?.email}</span>
                    </div>
                    {user?.created_at && (
                        <div className="profile-row">
                            <span className="profile-label">Joined</span>
                            <span className="profile-value">
                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                    month: 'long', day: 'numeric', year: 'numeric'
                                })}
                            </span>
                        </div>
                    )}
                </div>

                <button className="btn btn-danger profile-logout" onClick={logout}>
                    Log Out
                </button>
            </div>
        </div>
    );
}

export default Profile;