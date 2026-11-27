import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import { Stars } from './Icon';

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
      <ul className="group">
        {reviews.length === 0 && <li className="empty">No reviews yet.</li>}
        {reviews.map((r) => (
          <li key={r._id}>
            <div className="row-main">
              <Stars rating={r.rating} />
              {r.comment && <div>{r.comment}</div>}
              <div className="row-sub">{r.user.name}</div>
            </div>
            {(r.user._id === user._id || user.role === 'admin') && (
              <button className="destructive" onClick={() => handleDelete(r._id)}>Delete</button>
            )}
          </li>
        ))}
        {isParticipant && !alreadyReviewed && (
          <li>
            <form className="inline-form row-main" onSubmit={handleAdd}>
              <select
                aria-label="Rating"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} / 5</option>
                ))}
              </select>
              <input
                aria-label="Your feedback"
                placeholder="How was it?"
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
              />
              <button type="submit" className="tinted">Post</button>
            </form>
          </li>
        )}
      </ul>
      {!isParticipant && <p className="hint">Join the event to leave a review.</p>}
    </section>
  );
}
