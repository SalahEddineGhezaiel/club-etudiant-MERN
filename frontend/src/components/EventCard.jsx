import { Link } from 'react-router';
import { formatDate } from '../utils/formatDate';

// Reusable: used on the Events page and on the Profile page
export default function EventCard({ event }) {
  return (
    <div className="card">
      <h3>{event.title}</h3>
      <p className="muted">
        {formatDate(event.date)}
        {event.location && ` · ${event.location}`}
      </p>
      <p>{event.participants.length} participant(s)</p>
      <Link to={`/events/${event._id}`}>View details →</Link>
    </div>
  );
}
