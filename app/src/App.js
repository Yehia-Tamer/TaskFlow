import './styles/global.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { SearchContext } from './components/NavBar/SearchContext.jsx'
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Navbar from './components/NavBar/NavBar.jsx';
import Landing from './pages/Landing.jsx';
import Profile from './pages/Profile.jsx'

function Layout() {
  const location = useLocation();
  const hideNavBar = ['/', '/login', '/register','/profile'].includes(location.pathname);
  const [searchQuery, setSearchQuery] = useState(null);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {!hideNavBar && <Navbar username={localStorage.getItem('username')} />}
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile/>} />
      </Routes>
    </SearchContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;