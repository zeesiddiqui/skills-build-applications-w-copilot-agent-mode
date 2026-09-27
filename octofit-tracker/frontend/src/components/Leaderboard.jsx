import { useEffect, useState } from 'react';
import { getApiBaseUrl, normalizeResponseData } from '../lib/api.js';

const API_ENDPOINT = '/api/leaderboard/';

function Leaderboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const response = await fetch(`${getApiBaseUrl()}${API_ENDPOINT}`);
        const payload = await response.json();
        const data = normalizeResponseData(payload);

        if (!response.ok) {
          throw new Error(payload?.message || 'Failed to load leaderboard');
        }

        setItems(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load leaderboard');
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  if (loading) return <div className="panel-card">Loading leaderboard…</div>;
  if (error) return <div className="panel-card text-danger">{error}</div>;

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h2>Leaderboard</h2>
        <span className="badge text-bg-light">Top performers</span>
      </div>
      <div className="list-group list-group-flush">
        {items.map((entry, index) => (
          <div className="list-group-item d-flex justify-content-between align-items-center" key={entry._id || entry.id || entry.email || index}>
            <div className="d-flex align-items-center gap-3">
              <span className="rank-badge">#{index + 1}</span>
              <div>
                <strong>{entry.name}</strong>
                <div className="text-muted small">{entry.role || 'member'}</div>
              </div>
            </div>
            <span className="points-pill">{entry.points ?? 0} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;
