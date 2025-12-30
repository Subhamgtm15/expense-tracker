import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Main from "./components/main";
import Signup from "./components/signup";
import Login from "./components/login";
import RequireAuth from './components/RequireAuth';
import RedirectIfAuth from './components/RedirectIfAuth';

function App() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className=" p-8 rounded-lg shadow-lg">
        <Routes>
          <Route path="/login" element={<RedirectIfAuth> <Login /> </RedirectIfAuth>} />
          <Route path="/signup" element={<RedirectIfAuth> <Signup /> </RedirectIfAuth> } />
          <Route path="/" element={<RequireAuth><Main onLogout={logout}/></RequireAuth>} />
        </Routes>
      </div>
    </div>
  );
}


export default App;