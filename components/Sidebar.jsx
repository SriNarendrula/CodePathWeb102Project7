// components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>🌌 Space Explorer</h2>
        <p>NASA APOD Dashboard</p>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">📊</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/about" className="nav-link">
          <span className="nav-icon">ℹ️</span>
          <span>About</span>
        </NavLink>
      </nav>

      <div className="sidebar-info">
        <h4>✨ Did You Know?</h4>
        <p>The Astronomy Picture of the Day (APOD) has been running since June 16, 1995, making it one of NASA's longest-running online services!</p>
      </div>

      <div className="sidebar-stats">
        <h4>📈 Quick Stats</h4>
        <div className="stat-item">
          <span>Images:</span>
          <span>~85%</span>
        </div>
        <div className="stat-item">
          <span>Videos:</span>
          <span>~15%</span>
        </div>
        <div className="stat-item">
          <span>Daily Updates:</span>
          <span>✓</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;