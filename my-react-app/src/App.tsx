import "./App.css";
import Welcome from "./screens/welcome/welcome";
import Register from "./screens/register/register";
import PostDetail from "./screens/postdetail/postdetail";
import UploadPost from "./screens/uploadpost/uploadpost";
import MyProfile from "./screens/myprofile/myprofile";
import HomePage from "./screens/homepage/homepage";
import ChatPage1 from "./screens/chatpage1/chatpage1";
import ChatsPage from "./screens/chatspage/chatspage";
import EditProfile from "./screens/editprofile/editprofile";
import Loopi from "./screens/loopi/loopi";
import OtherProfile from "./screens/otherprofile/otherprofile";
import Login from "./screens/login/login";
import SearchPage from "./screens/searchpage/searchpage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
