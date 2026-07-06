import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:8001/auth/login',
                new URLSearchParams({
                    username: form.username,
                    password: form.password
                }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}
            );

            localStorage.setItem('token', response.data.access_token);
            navigate('/home');

        } catch (err) {
            setError(err.response?.data?.detail || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="aurora"></div>

            <div className="login-card">
                <div className="login-logo">TaskFlow</div>
                <div className="login-subtitle">Welcome back.</div>

                {error && <div className="login-error">⚠️ {error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            className="form-input"
                            name="username"
                            placeholder="Enter your username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            className="form-input"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In →'}
                    </button>
                </form>

                <div className="login-divider"></div>

                <div className="login-switch">
                    Don't have an account?{' '}
                    <span onClick={() => navigate('/register')}>Sign up</span>
                </div>
            </div>
        </div>
    );
}

export default Login;