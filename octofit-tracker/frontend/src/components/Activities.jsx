import { useEffect, useState } from 'react';
import { getApiBaseUrl, normalizeResponseData } from '../lib/api.js';

const API_URL = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/';

function Activities() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadActivities() {
      try {
        const response = await fetch(API_URL || `${getApiBaseUrl()}${API_ENDPOINT}`);
        const payload = await response.json();
        const data = normalizeResponseData(payload);

        if (!response.ok) {
          throw new Error(payload?.message || 'Failed to load activities');
        }

        setItems(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load activities');
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);

  if (loading) return <div className="panel-card">Loading activities…</div>;
  if (error) return <div className="panel-card text-danger">{error}</div>;

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h2>Activities</h2>
        <span className="badge text-bg-light">{items.length} entries</span>
      </div>
      <div className="list-group list-group-flush">
        {items.map((activity) => (
          <div className="list-group-item d-flex justify-content-between align-items-center" key={activity._id || activity.id || `${activity.type}-${activity.date}`}>
            <div>
              <strong>{activity.type}</strong>
              <div className="text-muted small">{activity.durationMinutes} min • {activity.calories} cal</div>
            </div>
            <span className="text-muted small">{activity.date ? new Date(activity.date).toLocaleDateString() : '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Activities;
