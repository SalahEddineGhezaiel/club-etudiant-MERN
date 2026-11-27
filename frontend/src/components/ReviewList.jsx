import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axios';

// Reviews of one event: list, add (participants only, once), delete (author or admin)
export default function ReviewList({ eventId, isParticipant }) {
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/reviews?event=${eventId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => setError(err.message));
  }, [eventId]);

  const alreadyReviewed = reviews.some((r) => r.user._id === user._id);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/reviews', { ...form, event: eventId });
      // The API returns the user as an id only, so we add the name ourselves for display
      setReviews([{ ...data, user: { _id: user._id, name: user.name } }, ...reviews]);
      setForm({ rating: 5, comment: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h2>Reviews</h2>
      {error && <p className="error">{error}</p>}
      {reviews.length === 0 && <p className="muted">No reviews yet.</p>}
      <ul className="list">
        {reviews.map((r) => (
          <li key={r._id}>
            <strong>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</strong> {r.comment}
            <span className="muted"> · {r.user.name}</span>
            {(r.user._id === user._id || user.role === 'admin') && (
              <button className="danger small" onClick={() => handleDelete(r._id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>

      {isParticipant && !alreadyReviewed && (
        <form className="row" onSubmit={handleAdd}>
          <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} ★</option>
            ))}
          </select>
          <input
            placeholder="Your feedback"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />
          <button type="submit">Post review</button>
        </form>
      )}
    </section>
  );
}
