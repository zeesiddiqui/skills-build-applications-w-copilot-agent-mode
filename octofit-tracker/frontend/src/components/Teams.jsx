import { useEffect, useState } from 'react';
import { getApiBaseUrl, normalizeResponseData } from '../lib/api.js';

const API_ENDPOINT = '/api/teams/';

function Teams() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTeams() {
      try {
        const response = await fetch(`${getApiBaseUrl()}${API_ENDPOINT}`);
        const payload = await response.json();
        const data = normalizeResponseData(payload);

        if (!response.ok) {
          throw new Error(payload?.message || 'Failed to load teams');
        }

        setItems(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load teams');
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, []);

  if (loading) return <div className="panel-card">Loading teams…</div>;
  if (error) return <div className="panel-card text-danger">{error}</div>;

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h2>Teams</h2>
        <span className="badge text-bg-light">{items.length} groups</span>
      </div>
      <div className="row g-3">
        {items.map((team) => (
          <div className="col-md-6" key={team._id || team.id || team.name}>
            <div className="team-card">
              <div className="d-flex justify-content-between align-items-center">
                <h3>{team.name}</h3>
                <span className="team-dot" style={{ backgroundColor: team.color || '#19a974' }} />
              </div>
              <p className="mb-2 text-muted">Captain: {team.captainId?.name || 'TBD'}</p>
              <div className="small text-muted">
                <span>Team energy</span>
                <div className="progress mt-2" role="progressbar">
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

export default Teams;
