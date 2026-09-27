import { useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function fetchJson(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload.data || [];
}

function formatDate(value) {
  if (!value) return '—';

  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function StatCard({ label, value, accent }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <strong className={`stat-value ${accent}`}>{value}</strong>
    </div>
  );
}

function DashboardPage({ users, activities, leaderboard, workouts }) {
  const totalPoints = users.reduce((sum, user) => sum + Number(user.points || 0), 0);
  const averageMinutes =
    activities.length > 0
      ? Math.round(
          activities.reduce((sum, item) => sum + Number(item.durationMinutes || 0), 0) /
            activities.length,
        )
      : 0;

  return (
    <>
      <div className="hero-banner mb-4">
        <div>
          <p className="eyebrow">Mergington High School</p>
          <h1>OctoFit Tracker</h1>
          <p className="lead">
            Track movement, build motivation, and turn activity into friendly competition.
          </p>
        </div>
        <button type="button" className="btn btn-primary rounded-pill px-4">
          Log new activity
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <StatCard label="Active students" value={users.length} accent="teal" />
        </div>
        <div className="col-md-3">
          <StatCard label="Workout logs" value={activities.length} accent="purple" />
        </div>
        <div className="col-md-3">
          <StatCard label="Points earned" value={totalPoints} accent="green" />
        </div>
        <div className="col-md-3">
          <StatCard label="Avg. duration" value={`${averageMinutes} min`} accent="orange" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="panel-card h-100">
            <div className="panel-header">
              <h2>Leaderboard</h2>
              <span className="badge text-bg-light">This week</span>
            </div>
            <div className="list-group list-group-flush">
              {leaderboard.map((entry, index) => (
                <div className="list-group-item d-flex align-items-center justify-content-between" key={entry.email || index}>
                  <div className="d-flex align-items-center gap-3">
                    <span className="rank-badge">#{index + 1}</span>
                    <div>
                      <strong>{entry.name}</strong>
                      <div className="text-muted small">{entry.role}</div>
                    </div>
                  </div>
                  <span className="points-pill">{entry.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="panel-card h-100">
            <div className="panel-header">
              <h2>Recommended workouts</h2>
            </div>
            <div className="d-grid gap-3">
              {workouts.map((workout) => (
                <div className="mini-card" key={workout._id || workout.title}>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{workout.title}</strong>
                    <span className="badge text-bg-success-subtle">{workout.difficulty}</span>
                  </div>
                  <p className="mb-2 text-muted">{workout.focus}</p>
                  <div className="d-flex justify-content-between small text-muted">
                    <span>{workout.durationMinutes} min</span>
                    <span>{workout.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TeamsPage({ teams }) {
  return (
    <div className="panel-card">
      <div className="panel-header">
        <h2>Teams</h2>
        <span className="badge text-bg-light">{teams.length} active groups</span>
      </div>
      <div className="row g-3">
        {teams.map((team) => (
          <div className="col-md-6" key={team._id || team.name}>
            <div className="team-card">
              <div className="d-flex justify-content-between align-items-center">
                <h3>{team.name}</h3>
                <span className="team-dot" style={{ backgroundColor: team.color || '#19a974' }} />
              </div>
              <p className="mb-2 text-muted">Captain: {team.captainId?.name || 'TBD'}</p>
              <div className="small text-muted">
                <span>Team energy</span>
                <div className="progress mt-2" role="progressbar" aria-label={`${team.name} progress`}>
                  <div className="progress-bar" style={{ width: '82%' }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityPage({ activities }) {
  return (
    <div className="panel-card">
      <div className="panel-header">
        <h2>Recent activity</h2>
      </div>
      <div className="list-group list-group-flush">
        {activities.map((item) => (
          <div className="list-group-item d-flex justify-content-between align-items-center" key={item._id || `${item.userId?.name}-${item.date}`}>
            <div>
              <strong>{item.type}</strong>
              <div className="text-muted small">
                {item.userId?.name || 'Student'} • {item.durationMinutes} min • {item.calories} cal
              </div>
            </div>
            <span className="text-muted small">{formatDate(item.date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [teams, setTeams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, activityData, teamData, leaderboardData, workoutData] = await Promise.all([
          fetchJson('/api/users'),
          fetchJson('/api/activities'),
          fetchJson('/api/teams'),
          fetchJson('/api/leaderboard'),
          fetchJson('/api/workouts'),
        ]);

        setUsers(userData);
        setActivities(activityData);
        setTeams(teamData);
        setLeaderboard(leaderboardData);
        setWorkouts(workoutData);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load OctoFit data.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

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
            <NavLink to="/activity" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Activity
            </NavLink>
          </div>
        </nav>

        <main className="content-area">
          {loading ? (
            <div className="loading-state">Loading OctoFit data…</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <DashboardPage
                    users={users}
                    activities={activities}
                    leaderboard={leaderboard}
                    workouts={workouts}
                  />
                }
              />
              <Route path="/teams" element={<TeamsPage teams={teams} />} />
              <Route path="/activity" element={<ActivityPage activities={activities} />} />
            </Routes>
          )}
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
