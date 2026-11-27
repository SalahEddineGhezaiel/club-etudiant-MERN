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
    <form className="form narrow" onSubmit={handleSubmit}>
      <h1>Register</h1>
      {error && <p className="error">{error}</p>}
      <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input
        name="password"
        type="password"
        placeholder="Password (6 characters min)"
        minLength={6}
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
      <p className="muted">Already a member? <Link to="/login">Login</Link></p>
    </form>
  );
}
