import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import { formatDate } from '../utils/formatDate';
import EventRow from '../components/EventRow';

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
      <h1>Profile</h1>
      <p className="page-subtitle">{user.email} · {user.role === 'admin' ? 'Administrator' : 'Member'}</p>
      {error && <p className="error">{error}</p>}

      {card && (
        <div className="member-card">
          <div className="club">Student Club</div>
          <div>
            <div className="holder">{user.name}</div>
            <div className="card-number">{card.cardNumber}</div>
          </div>
          <div className="since">Member since {formatDate(card.joinDate)}</div>
        </div>
      )}

      <h2>My events</h2>
      {myEvents.length === 0 ? (
        <p className="secondary-text">You haven't joined any event yet.</p>
      ) : (
        <ul className="group">
          {myEvents.map((event) => (
            <EventRow key={event._id} event={event} />
          ))}
        </ul>
      )}
    </div>
  );
}
