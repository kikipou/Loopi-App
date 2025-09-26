import './App.css'
import Welcome from './assets/screens/welcome/welcome'
import Register from './assets/screens/register/register'
import PostDetail from './assets/screens/postdetail/postdetail'
import UploadPost from './assets/screens/uploadpost/uploadpost' 
import MyProfile from './assets/screens/myprofile/myprofile'
import HomePage from './assets/screens/homepage/homepage'
import ChatPage1 from './assets/screens/chatpage1/chatpage1'
import ChatsPage from './assets/screens/chatspage/chatspage'
import EditProfile from './assets/screens/editprofile/editprofile'
import Loopi from './assets/screens/loopi/loopi'
import OtherProfile from './assets/screens/otherprofile/otherprofile'
import Login from './assets/screens/login/login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  

  return (
    
    <Router>
      <Routes>
       <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/upload" element={<UploadPost />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/chat1" element={<ChatPage1 />} />
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/loopi" element={<Loopi />} />
        <Route path="/other-profile" element={<OtherProfile />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    
  );
}

export default App
