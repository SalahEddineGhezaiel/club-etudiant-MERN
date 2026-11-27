import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';

// Wraps a page: <ProtectedRoute><Profile /></ProtectedRoute>
// adminOnly: <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/events" replace />;
  return children;
}
