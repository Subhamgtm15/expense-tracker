import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
//this is needed so that only authenticated users can access the dashboard 
//not everyone can access the dashboard
