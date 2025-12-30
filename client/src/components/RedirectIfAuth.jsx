import { Navigate } from 'react-router-dom';

export default function RedirectIfAuth({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return children;
  }

  return <Navigate to="/" replace />;
}
//this is done so that if already logged in users can't access login and signup until token is expired
