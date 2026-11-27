import { Link } from 'react-router';
import Icon from './Icon';

// Reusable: one event as a row of a grouped list. Used on the Events page and the Profile page.
// Must be placed inside <ul className="group">.
export default function EventRow({ event }) {
  const date = new Date(event.date);

  return (
    <li className="link-row">
      <Link to={`/events/${event._id}`} className="row-link">
        <div className="date-block">
          <div className="month">{date.toLocaleDateString('en-GB', { month: 'short' })}</div>
          <div className="day">{date.getDate()}</div>
        </div>
        <div className="row-main">
          <div className="row-title">{event.title}</div>
          {event.location && <div className="row-sub">{event.location}</div>}
        </div>
        <div className="row-trailing">
          <span className="numeric" aria-label={`${event.participants.length} participants`}>
            {event.participants.length}
          </span>
          <Icon name="people" />
          <Icon name="chevron" className="chevron" />
        </div>
      </Link>
    </li>
  );
}
