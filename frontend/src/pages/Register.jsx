import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/authSlice';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(register(form)).unwrap();
      navigate('/events');
    } catch {
      // the error message is shown from the store
    }
  };

  if (user) return <Navigate to="/events" replace />;

  return (
    <form className="auth" onSubmit={handleSubmit}>
      <h1>Join the club</h1>
      <p className="page-subtitle">You'll get your member card right away.</p>
      {error && <p className="error">{error}</p>}
      <ul className="group">
        <li className="field">
          <label htmlFor="name"><span>Name</span></label>
          <input id="name" name="name" autoComplete="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
        </li>
        <li className="field">
          <label htmlFor="email"><span>Email</span></label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@school.tn" value={form.email} onChange={handleChange} required />
        </li>
        <li className="field">
          <label htmlFor="password"><span>Password</span></label>
          <input id="password" name="password" type="password" autoComplete="new-password" placeholder="6 characters minimum" minLength={6} value={form.password} onChange={handleChange} required />
        </li>
      </ul>
      <button type="submit" className="block" disabled={loading}>{loading ? 'Creating your account…' : 'Create account'}</button>
      <p className="auth-switch">Already a member? <Link to="/login">Log in</Link></p>
    </form>
  );
}
