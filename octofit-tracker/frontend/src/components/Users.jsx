import { useEffect, useState } from 'react';
import { getApiBaseUrl, normalizeResponseData } from '../lib/api.js';

const API_ENDPOINT = '/api/users/';

function Users() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch(`${getApiBaseUrl()}${API_ENDPOINT}`);
        const payload = await response.json();
        const data = normalizeResponseData(payload);

        if (!response.ok) {
          throw new Error(payload?.message || 'Failed to load users');
        }

        setItems(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load users');
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading) return <div className="panel-card">Loading users…</div>;
  if (error) return <div className="panel-card text-danger">{error}</div>;

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h2>Users</h2>
        <span className="badge text-bg-light">{items.length} profiles</span>
      </div>
      <div className="list-group list-group-flush">
        {items.map((user) => (
          <div className="list-group-item d-flex justify-content-between align-items-center" key={user._id || user.id || user.email}>
            <div>
              <strong>{user.name}</strong>
              <div className="text-muted small">{user.email}</div>
            </div>
            <span className="badge text-bg-primary-subtle">{user.role || 'member'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;
