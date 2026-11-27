import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import { formatDate } from '../utils/formatDate';
import EventCard from '../components/EventCard';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [card, setCard] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Two independent requests, run at the same time
    Promise.all([api.get('/cards/me'), api.get('/events/mine')])
      .then(([cardRes, eventsRes]) => {
        setCard(cardRes.data);
        setMyEvents(eventsRes.data);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h1>My profile</h1>
      {error && <p className="error">{error}</p>}

      <div className="card member-card">
        <h3>{user.name}</h3>
        <p className="muted">{user.email} · {user.role}</p>
        {card && (
          <p>
            Card <strong>{card.cardNumber}</strong> · member since {formatDate(card.joinDate)}
          </p>
        )}
      </div>

      <h2>My events</h2>
      {myEvents.length === 0 && <p className="muted">You haven't joined any event yet.</p>}
      <div className="grid">
        {myEvents.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}
