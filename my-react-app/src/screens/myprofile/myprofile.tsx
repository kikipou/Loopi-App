import "./myprofile.css";
import Button from "../../components/button/button";
import { useDispatch } from "react-redux";
import { clearSession } from "../../redux/slices/authSlice";
import { supabase } from "../../database/supabaseClient";

const MyProfile = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      dispatch(clearSession());
      console.log("User logged out successfully");
      // Puedes redirigir al login
      window.location.href = "/login";
    }
  };

  return (
    <div className="myprofile-container">
      <h1 className="myprofile-title">Your profile</h1>
      <Button
        buttonplaceholder="Log out"
        buttonid="logout-button"
        onClick={handleLogout}
      />
    </div>
  );
};

export default MyProfile;
