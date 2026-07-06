import './styles/global.css';
import {BrowserRouter as Router,Route,Routes,useLocation} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx'
import Navbar from './components/NavBar/NavBar.jsx';
import Landing from './pages/Landing.jsx';

function Layout(){
  const location=useLocation();

  const hideNavBar=['/','/login','/register'].includes(location.pathname);

  return (
    <>
      {!hideNavBar && <Navbar />}
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout/>
    </Router>
  );
}

export default App;
