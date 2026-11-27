import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/authSlice';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Clear an old error (e.g. from the Register page) when this page opens
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // unwrap() returns the payload, or throws if the thunk was rejected
      await dispatch(login(form)).unwrap();
      navigate('/events');
    } catch {
      // nothing to do: the error message is already in the store and shown below
    }
  };

  if (user) return <Navigate to="/events" replace />; // already logged in

  return (
    <form className="auth" onSubmit={handleSubmit}>
      <h1>Welcome back</h1>
      <p className="page-subtitle">Log in to see the club's events.</p>
      {error && <p className="error">{error}</p>}
      <ul className="group">
        <li className="field">
          <label htmlFor="email"><span>Email</span></label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@school.tn" value={form.email} onChange={handleChange} required />
        </li>
        <li className="field">
          <label htmlFor="password"><span>Password</span></label>
          <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Required" value={form.password} onChange={handleChange} required />
        </li>
      </ul>
      <button type="submit" className="block" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</button>
      <p className="auth-switch">Not a member yet? <Link to="/register">Join the club</Link></p>
    </form>
  );
}
