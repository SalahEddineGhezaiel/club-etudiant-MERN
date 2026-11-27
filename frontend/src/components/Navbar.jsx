import { Link, NavLink, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // NavLink adds the "active" class to the link of the current page
  return (
    <nav className="navbar">
      <Link to="/" className="brand">Student Club</Link>
      <div className="nav-links">
        {user ? (
          <>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
            <span className="nav-user">{user.name}</span>
            <button className="plain" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/register">Join the club</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
