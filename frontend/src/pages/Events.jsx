import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../store/eventSlice';
import EventRow from '../components/EventRow';

export default function Events() {
  const { list, loading, error } = useSelector((state) => state.events);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div>
      <h1>Events</h1>
      <p className="page-subtitle">Pick an event to see its workshops and join it.</p>
      {error && <p className="error">{error}</p>}
      {loading && list.length === 0 && <p className="loading">Loading events…</p>}
      {!loading && !error && list.length === 0 && (
        <p className="secondary-text">No events planned yet. Check back soon.</p>
      )}
      {list.length > 0 && (
        <ul className="group">
          {list.map((event) => (
            <EventRow key={event._id} event={event} />
          ))}
        </ul>
      )}
    </div>
  );
}
