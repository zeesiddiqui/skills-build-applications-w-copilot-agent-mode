import { useEffect, useState } from 'react';
import { getApiUrl, normalizeResponseData } from '../lib/api.js';

function Workouts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const response = await fetch(getApiUrl('workouts'));
        const payload = await response.json();
        const data = normalizeResponseData(payload);

        if (!response.ok) {
          throw new Error(payload?.message || 'Failed to load workouts');
        }

        setItems(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load workouts');
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();
  }, []);

  if (loading) return <div className="panel-card">Loading workouts…</div>;
  if (error) return <div className="panel-card text-danger">{error}</div>;

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h2>Workouts</h2>
        <span className="badge text-bg-light">{items.length} plans</span>
      </div>
      <div className="d-grid gap-3">
        {items.map((workout) => (
          <div className="mini-card" key={workout._id || workout.id || workout.title}>
            <div className="d-flex justify-content-between align-items-center">
              <strong>{workout.title}</strong>
              <span className="badge text-bg-success-subtle">{workout.difficulty || 'beginner'}</span>
            </div>
            <p className="mb-2 text-muted">{workout.focus}</p>
            <div className="d-flex justify-content-between small text-muted">
              <span>{workout.durationMinutes} min</span>
              <span>{workout.description || 'Personalized fitness circuit'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Workouts;
