import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvent, joinEvent, leaveEvent } from '../store/eventSlice';
import { formatDate } from '../utils/formatDate';
import WorkshopList from '../components/WorkshopList';
import ReviewList from '../components/ReviewList';

export default function EventDetail() {
  const { id } = useParams(); // the :id part of /events/:id
  const { current: event, loading, error } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    dispatch(fetchEvent(id));
  }, [dispatch, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!event || event._id !== id) return null; // the store still holds the previous event

  const isParticipant = event.participants.some((p) => p._id === user._id);

  const handleJoinLeave = async () => {
    setActionError('');
    try {
      await dispatch(isParticipant ? leaveEvent(id) : joinEvent(id)).unwrap();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div>
      <h1>{event.title}</h1>
      <p className="muted">
        {formatDate(event.date)}
        {event.location && ` · ${event.location}`}
        {event.createdBy && ` · organised by ${event.createdBy.name}`}
      </p>
      {event.description && <p>{event.description}</p>}

      {actionError && <p className="error">{actionError}</p>}
      <button className={isParticipant ? 'secondary' : ''} onClick={handleJoinLeave}>
        {isParticipant ? 'Leave event' : 'Join event'}
      </button>

      <section>
        <h2>Participants ({event.participants.length})</h2>
        {event.participants.length === 0 ? (
          <p className="muted">Nobody yet. Be the first!</p>
        ) : (
          <ul className="list">
            {event.participants.map((p) => (
              <li key={p._id}>{p.name}</li>
            ))}
          </ul>
        )}
      </section>

      <WorkshopList eventId={id} />
      <ReviewList eventId={id} isParticipant={isParticipant} />
    </div>
  );
}
