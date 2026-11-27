import { useState } from 'react';

const emptyForm = { title: '', description: '', date: '', location: '' };

// Reusable for both create and edit.
// initialEvent: the event to edit, or null to create a new one.
export default function EventForm({ initialEvent, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initialEvent
      ? { ...initialEvent, date: initialEvent.date.slice(0, 10) } // "2026-12-10T00:00:00.000Z" -> "2026-12-10" for <input type="date">
      : emptyForm
  );
  const [error, setError] = useState('');

  // One handler for every input, thanks to the "name" attribute
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser from reloading the page
    setError('');
    try {
      const { title, description, date, location } = form;
      await onSubmit({ title, description, date, location });
      if (!initialEvent) setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>{initialEvent ? 'Edit event' : 'New event'}</h3>
      {error && <p className="error">{error}</p>}
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="date" type="date" value={form.date} onChange={handleChange} required />
      <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
      <div className="row">
        <button type="submit">{initialEvent ? 'Save' : 'Create'}</button>
        {onCancel && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
