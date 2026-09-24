import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Wraps any page that requires login. While checkingAuth is true (the
// silent token check on app open), we show nothing/a loader rather than
// flashing the login screen. Only redirect to /login once we're sure
// there's truly no valid session.
export default function ProtectedRoute({ children }) {
  const { user, checkingAuth } = useAuth();

  if (checkingAuth) return <div style={{ color: "#fff", padding: 24 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
