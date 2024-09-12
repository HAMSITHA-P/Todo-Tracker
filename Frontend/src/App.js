import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Todo from "./pages/Todo";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
      setUsername(user.username);
    }
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);
    setUsername(user.username);
  };

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} setSidebarOpen={setSidebarOpen}  username={username} />
      <div className="app">
        <Routes>
          <Route path="/" element={isLoggedIn ? <Todo /> : <Home isLoggedIn={isLoggedIn} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/todo" element={isLoggedIn ? <Todo sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} username={username}/> : <Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
