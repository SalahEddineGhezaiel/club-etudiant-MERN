import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvent, joinEvent, leaveEvent } from '../store/eventSlice';
import { formatDate } from '../utils/formatDate';
import WorkshopList from '../components/WorkshopList';
import ReviewList from '../components/ReviewList';
import Icon from '../components/Icon';

export default function EventDetail() {
  const { id } = useParams(); // the :id part of /events/:id
  const { current: event, loading, error } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    dispatch(fetchEvent(id));
  }, [dispatch, id]);

  if (error) return <p className="error">{error}</p>;
  if (loading || !event || event._id !== id) return <p className="loading">Loading event…</p>; // the store may still hold the previous event

  const isParticipant = event.participants.some((p) => p._id === user._id);

  const handleJoinLeave = async () => {
    setActionError('');
    setBusy(true);
    try {
      await dispatch(isParticipant ? leaveEvent(id) : joinEvent(id)).unwrap();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Link to="/events" className="back-link">
        <Icon name="chevron" className="icon flip" /> All events
      </Link>
      <h1>{event.title}</h1>
      <p className="event-meta">
        {formatDate(event.date)}
        {event.location && ` · ${event.location}`}
        {event.createdBy && ` · organised by ${event.createdBy.name}`}
      </p>
      {event.description && <p>{event.description}</p>}

      {actionError && <p className="error">{actionError}</p>}
      <div className="event-actions">
        <button className={isParticipant ? 'tinted' : ''} onClick={handleJoinLeave} disabled={busy}>
          {isParticipant ? 'Leave event' : 'Join event'}
        </button>
      </div>

      <h2>Participants <span className="secondary-text numeric">{event.participants.length}</span></h2>
      <ul className="group">
        {event.participants.length === 0 ? (
          <li className="empty">Nobody has joined yet.</li>
        ) : (
          event.participants.map((p) => (
            <li key={p._id}>
              {p.name}
              {p._id === user._id && <span className="secondary-text">(you)</span>}
            </li>
          ))
        )}
      </ul>

      <WorkshopList eventId={id} />
      <ReviewList eventId={id} isParticipant={isParticipant} />
    </div>
  );
}
