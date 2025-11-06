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
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { supabase } from "./database/supabaseClient";
import { setSession } from "./redux/slices/authSlice";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userSession = supabase.auth.getSession().then(({ data }) => {
      dispatch(setSession(data.session));
    });
    console.log(userSession);

    // Aqui esta función escucha los cambios del auth
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed", event, session);
      dispatch(setSession(session));
    });

    data.subscription.unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat1"
          element={
            <ProtectedRoute>
              <ChatPage1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <ChatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loopi"
          element={
            <ProtectedRoute>
              <Loopi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/other-profile"
          element={
            <ProtectedRoute>
              <OtherProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
