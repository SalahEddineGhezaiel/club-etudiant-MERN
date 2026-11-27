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
  const [saving, setSaving] = useState(false);

  // One handler for every input, thanks to the "name" attribute
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser from reloading the page
    setError('');
    setSaving(true);
    try {
      const { title, description, date, location } = form;
      await onSubmit({ title, description, date, location });
      if (!initialEvent) setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{initialEvent ? `Edit “${initialEvent.title}”` : 'New event'}</h2>
      {error && <p className="error">{error}</p>}
      <ul className="group">
        <li className="field">
          <label htmlFor="ev-title"><span>Title</span></label>
          <input id="ev-title" name="title" placeholder="Spring hackathon" value={form.title} onChange={handleChange} required />
        </li>
        <li className="field">
          <label htmlFor="ev-date"><span>Date</span></label>
          <input id="ev-date" name="date" type="date" value={form.date} onChange={handleChange} required />
        </li>
        <li className="field">
          <label htmlFor="ev-location"><span>Location</span></label>
          <input id="ev-location" name="location" placeholder="Amphitheatre A" value={form.location} onChange={handleChange} />
        </li>
        <li className="field">
          <label htmlFor="ev-description"><span>Description</span></label>
          <textarea id="ev-description" name="description" placeholder="What will happen?" value={form.description} onChange={handleChange} />
        </li>
      </ul>
      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : initialEvent ? 'Save changes' : 'Create event'}
        </button>
        {onCancel && <button type="button" className="tinted" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
