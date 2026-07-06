import './NavBar.css';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ username }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const initials = username ? username.slice(0, 2).toUpperCase() : 'N';

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>TaskFlow</div>

      <div className="navbar-nav">
      </div>

      <div className="navbar-right">
        <div className="search-bar">
          <span>🔍</span>
          <input placeholder="Search tasks..." />
        </div>
        <div className="nav-avatar" onClick={logout} title="Logout">
          {initials}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;