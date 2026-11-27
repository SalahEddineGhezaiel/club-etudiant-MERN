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
    <form className="form narrow" onSubmit={handleSubmit}>
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
      <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      <p className="muted">No account? <Link to="/register">Register</Link></p>
    </form>
  );
}
