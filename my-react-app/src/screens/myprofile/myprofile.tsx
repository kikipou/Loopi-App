import "./myprofile.css";
import Button from "../../components/button/button";
import { useDispatch } from "react-redux";
import { clearSession } from "../../redux/slices/authSlice";
import { supabase } from "../../database/supabaseClient";
import { useNavigate } from "react-router-dom"; // 👈 Importamos el hook

const MyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 👈 Creamos el hook de navegación

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      dispatch(clearSession());
      console.log("User logged out successfully");
      window.location.href = "/login";
    }
  };

  const handleAddPost = () => {
    navigate("/upload"); // 👈 Te lleva a la página para agregar un post
  };

  return (
    <div className="myprofile-container">
      <h1 className="myprofile-title">Your profile</h1>

      <Button
        buttonplaceholder="Log out"
        buttonid="logout-button"
        onClick={handleLogout}
      />

      <Button
        buttonplaceholder="Add Post"
        buttonid="add-button"
        onClick={handleAddPost} // 👈 Le pasamos el evento
      />
    </div>
  );
};

export default MyProfile;
