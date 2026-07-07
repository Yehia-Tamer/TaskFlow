import './NavBar.css';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from './SearchContext';

function Navbar({ username }) {
  const navigate = useNavigate();
  const { setSearchQuery } = useContext(SearchContext);
  const [query, setQuery] = useState('');

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  }

  function handleSearchKey(e) {
    if (e.key === 'Enter' && query.trim()) {
      setSearchQuery(query.trim());
      setQuery('');
    }
  }

  function getInitials(name) {
    if (!name) return 'N';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  const initials = getInitials(username);

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/home')}>TaskFlow</div>

      <div className="navbar-nav"></div>

      <div className="navbar-right">
        <div className="search-bar">
          <span>🔍</span>
          <input
            placeholder="Search tasks..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleSearchKey}
          />
        </div>
        <div className="nav-avatar" onClick={() => navigate('/profile')} title="Profile">
          {initials}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;