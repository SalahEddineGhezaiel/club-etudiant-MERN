import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../store/eventSlice';
import { formatDate } from '../utils/formatDate';
import EventForm from '../components/EventForm';
import api from '../api/axios';

export default function Admin() {
  const { list } = useSelector((state) => state.events);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(null); // the event being edited, or null
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchEvents());
    api
      .get('/cards')
      .then((res) => setCards(res.data))
      .catch((err) => setError(err.message));
  }, [dispatch]);

  // EventForm catches the error thrown by unwrap() and shows it
  const handleSubmit = async (eventData) => {
    if (editing) {
      await dispatch(updateEvent({ id: editing._id, eventData })).unwrap();
      setEditing(null);
    } else {
      await dispatch(createEvent(eventData)).unwrap();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event, its workshops and its reviews?')) return;
    try {
      await dispatch(deleteEvent(id)).unwrap();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Admin dashboard</h1>
      {error && <p className="error">{error}</p>}

      {/* key forces React to rebuild the form (and reset its state) when we switch event */}
      <EventForm
        key={editing?._id || 'new'}
        initialEvent={editing}
        onSubmit={handleSubmit}
        onCancel={editing ? () => setEditing(null) : null}
      />

      <h2>Events ({list.length})</h2>
      <table>
        <thead>
          <tr><th>Title</th><th>Date</th><th>Participants</th><th></th></tr>
        </thead>
        <tbody>
          {list.map((event) => (
            <tr key={event._id}>
              <td>{event.title}</td>
              <td>{formatDate(event.date)}</td>
              <td>{event.participants.length}</td>
              <td className="row">
                <button className="small secondary" onClick={() => setEditing(event)}>Edit</button>
                <button className="small danger" onClick={() => handleDelete(event._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Members ({cards.length})</h2>
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Card</th><th>Joined</th></tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card._id}>
              <td>{card.user?.name}</td>
              <td>{card.user?.email}</td>
              <td>{card.user?.role}</td>
              <td>{card.cardNumber}</td>
              <td>{formatDate(card.joinDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
