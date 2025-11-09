import "./editprofile.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { supabase } from "../../database/supabaseClient";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/button";
import BackButton from "../../components/backbutton/backbutton";

type UserRow = {
  id: string;
  username: string | null;
};

const EditProfile: React.FC = () => {
  const { session } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) {
        setLoadingProfile(false);
        return;
      }

      setLoadingProfile(true);

      const { data, error } = await supabase
        .from("users")
        .select("id, username")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error obteniendo perfil para editar:", error.message);
        setErrorMsg("Error loading profile");
      } else if (data) {
        const user = data as UserRow;
        setUsername(user.username ?? "");
      }

      setLoadingProfile(false);
    };

    fetchProfile();
  }, [session]);

  const handleSave = async () => {
    if (!session?.user) return;

    const trimmed = username.trim();
    if (!trimmed) {
      setErrorMsg("Username cannot be empty");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const { error } = await supabase
      .from("users")
      .update({ username: trimmed })
      .eq("id", session.user.id);

    if (error) {
      console.error("Error actualizando perfil:", error.message);
      setErrorMsg("Error updating profile");
    } else {
      navigate("/profile");
    }

    setSaving(false);
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  if (loadingProfile) {
    return (
      <div className="editprofile-container">
        <h1 className="editprofile-title">Edit Profile</h1>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="editprofile-container">
        <h1 className="editprofile-title">Edit Profile</h1>
        <p>No active session.</p>
      </div>
    );
  }

  return (
    <div className="editprofile-container">
      <h1 className="editprofile-title">Edit Profile</h1>

      <div className="editprofile-form">
        <label className="editprofile-label">
          Username
          <input
            type="text"
            className="editprofile-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </label>

        <label className="editprofile-label">
          Email
          <input
            type="email"
            className="editprofile-input editprofile-input--readonly"
            value={session.user.email ?? ""}
            disabled
          />
        </label>

        {errorMsg && <p className="editprofile-error">{errorMsg}</p>}

        <div className="editprofile-actions">
          <Button
            buttonplaceholder={saving ? "Saving..." : "Save changes"}
            buttonid="save-profile-button"
            onClick={handleSave}
            disabled={saving}
          />
          <Button
            buttonplaceholder="Cancel"
            buttonid="cancel-profile-button"
            onClick={handleCancel}
          />
        </div>
      </div>
      <BackButton />
    </div>
  );
};

export default EditProfile;
