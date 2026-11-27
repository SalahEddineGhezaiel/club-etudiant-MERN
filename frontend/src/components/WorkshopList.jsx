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
      <ul className="group">
        {workshops.length === 0 && <li className="empty">No workshops for this event yet.</li>}
        {workshops.map((w) => (
          <li key={w._id}>
            <div className="row-main">
              <div className="row-title">{w.title}</div>
            </div>
            <span className="row-trailing numeric">{w.capacity} places</span>
            {isAdmin && (
              <button className="destructive" onClick={() => handleDelete(w._id)}>Delete</button>
            )}
          </li>
        ))}
        {isAdmin && (
          <li>
            <form className="inline-form row-main" onSubmit={handleAdd}>
              <input
                aria-label="Workshop title"
                placeholder="New workshop title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <input
                aria-label="Capacity"
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
              <button type="submit" className="tinted">Add</button>
            </form>
          </li>
        )}
      </ul>
    </section>
  );
}
