import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from './hooks/useAuthContext';

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserNotification from "./pages/UserNotification";
import Audio from "./pages/Audio";
import Video from "./pages/Video";
import NewAudio from "./pages/NewAudio";
import Users from "./pages/Users";
import Recordings from './pages/Recordings';

function App() {
  const { user } = useAuthContext()
  return (
    <BrowserRouter>
    <div style={{"backgroundColor": "black"}}>
        <Navbar />
        <Routes>
            <Route 
                path="/" exact
                element={user ? <Home /> : <Navigate to="/login" />} />
            <Route 
                path="/pages/users" exact 
                element={user && user.role === 'admin'? <Users /> : <Navigate to="/" />} />
            <Route 
                path="/pages/notification/user" exact 
                element={ user ? <UserNotification /> : <Navigate to="/" />} />
            <Route
                path="/pages/audio/:id" exact
                element={ user ? <Audio /> : <Navigate to="/" />} />
            <Route
                path="/pages/video/:id" exact
                element={user && user.role === 'admin'? <Video /> : <Navigate to="/" />} />
            <Route
                path="/pages/newaudio" exact
                element={<NewAudio />} />
            <Route
                path="/pages/recordings/:id" exact
                element={<Recordings />} />
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <Signup /> : <Navigate to="/" />} 
            />
        </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;