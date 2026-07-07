// src/pages/Landing.jsx
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="aurora"></div>
      
      <div className="landing-card">
        <div className="landing-logo">TaskFlow</div>
        <div className="landing-tagline">Your productivity, supercharged.</div>
        
        <div className="landing-divider"></div>

        <div className="landing-option" onClick={() => navigate('/login')}>
          <div className="option-icon">👋</div>
          <div className="option-text">
            <div className="option-title">I have an account</div>
            <div className="option-sub">Sign in to continue</div>
          </div>
          <div className="option-arrow">→</div>
        </div>

        <div className="landing-option" onClick={() => navigate('/register')}>
          <div className="option-icon">🚀</div>
          <div className="option-text">
            <div className="option-title">I'm new here</div>
            <div className="option-sub">Create a free account</div>
          </div>
          <div className="option-arrow">→</div>
        </div>
      </div>
    </div>
  );
}

export default Landing;