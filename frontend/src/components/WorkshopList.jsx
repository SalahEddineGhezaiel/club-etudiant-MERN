import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axios';

// Workshops of one event. They are only shown here, so they live in local state, not in Redux.
export default function WorkshopList({ eventId }) {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user.role === 'admin';
  const [workshops, setWorkshops] = useState([]);
  const [form, setForm] = useState({ title: '', capacity: 20 });
  const [error, setError] = useState('');

  // Runs after the first render, and again if eventId changes
  useEffect(() => {
    api
      .get(`/workshops?event=${eventId}`)
      .then((res) => setWorkshops(res.data))
      .catch((err) => setError(err.message));
  }, [eventId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/workshops', { ...form, event: eventId });
      setWorkshops([...workshops, data]);
      setForm({ title: '', capacity: 20 });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workshop?')) return;
    try {
      await api.delete(`/workshops/${id}`);
      setWorkshops(workshops.filter((w) => w._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h2>Workshops</h2>
      {error && <p className="error">{error}</p>}
      {workshops.length === 0 && <p className="muted">No workshops yet.</p>}
      <ul className="list">
        {workshops.map((w) => (
          <li key={w._id}>
            <strong>{w.title}</strong> <span className="muted">· {w.capacity} places</span>
            {isAdmin && (
              <button className="danger small" onClick={() => handleDelete(w._id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>

      {isAdmin && (
        <form className="row" onSubmit={handleAdd}>
          <input
            placeholder="Workshop title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="number"
            min="1"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
          />
          <button type="submit">Add workshop</button>
        </form>
      )}
    </section>
  );
}
