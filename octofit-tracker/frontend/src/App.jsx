import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Teams from './components/Teams.jsx';
import Users from './components/Users.jsx';
import Workouts from './components/Workouts.jsx';
import './App.css';

function Dashboard() {
  return (
    <div className="dashboard-grid">
      <div className="row g-4">
        <div className="col-lg-7">
          <Leaderboard />
        </div>
        <div className="col-lg-5">
          <Workouts />
        </div>
      </div>
      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <Users />
        </div>
        <div className="col-lg-6">
          <Activities />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="topbar">
          <div className="brand-wrap">
            <div className="brand-mark">O</div>
            <div>
              <div className="brand-name">OctoFit</div>
              <small>Fitness tracker</small>
            </div>
          </div>

          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Dashboard
            </NavLink>
            <NavLink to="/teams" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Teams
            </NavLink>
            <NavLink to="/activities" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Activities
            </NavLink>
            <NavLink to="/leaderboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Leaderboard
            </NavLink>
            <NavLink to="/workouts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Workouts
            </NavLink>
          </div>
        </nav>

        <main className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
