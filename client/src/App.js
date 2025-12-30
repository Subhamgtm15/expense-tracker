import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Main from "./components/main";
import Signup from "./components/signup";
import Login from "./components/login";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className=" p-8 rounded-lg shadow-lg">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={token ? <Main onLogout={logout}/> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}


export default App;