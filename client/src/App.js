import { useState } from "react";
import Main from "./components/main";
import Signup from "./components/signup";
import Login from "./components/login";
function App() {
  const token = localStorage.getItem("token");

  const [screenState, setScreenState] = useState(token?'main':'login')
  function gotoLogin() {
    setScreenState('login')
  }

  function gotoSignUp() {
    setScreenState('signup')
  }
  function gotoMain() {
    setScreenState('main')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className=" p-8 rounded-lg shadow-lg">
        {(screenState === 'login') && <Login gotoSignUp={gotoSignUp} gotoMain={gotoMain} />}
        {(screenState === 'signup') && <Signup gotoLogin={gotoLogin} />}
        {(screenState === 'main') && <Main />}
      </div>
    </div>
  );
}

export default App;