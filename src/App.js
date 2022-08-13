import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminNotification from "./pages/AdminNotification";
import UserNotification from "./pages/UserNotification";
import Audio from "./pages/Audio";
import Video from "./pages/Video";
import NewAudio from "./pages/NewAudio";

function App() {
  return (
    <BrowserRouter>
    <div style={{"backgroundColor": "black"}}>
        <Navbar />
        <Routes>
            <Route 
                path="/" exact
                element={<NewAudio />} />
            <Route 
                path="/pages/notification/admin" exact 
                element={<AdminNotification />} />
            <Route 
                path="/pages/notification/user" exact 
                element={<UserNotification />} />
            <Route
                path="/pages/audio/:id" exact
                element={<Audio />} />
            <Route
                path="/pages/video/:id" exact
                element={<Video />} />
            <Route
                path="/pages/newaudio" exact
                element={<NewAudio />} />
        </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;