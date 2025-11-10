import "./editprofile.css";
import { useEffect, useState, type ChangeEvent } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { supabase } from "../../database/supabaseClient";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/button";
import BackButton from "../../components/backbutton/backbutton";
import Input from "../../components/input/input";
import Nav from "../../components/nav/nav";

type UserRow = {
  id: string;
  username: string | null;
  user_profession: string  | null;
  profile_description: string | null;
  profile_img_url: string | null;
};

const EditProfile: React.FC = () => {
  const { session } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [profession, setProfession] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

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
        .select("id, username, user_profession, profile_description, profile_img_url")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error obteniendo perfil para editar:", error.message);
        setErrorMsg("Error loading profile");
      } else if (data) {
        const user = data as UserRow;
        setUsername(user.username ?? "");
        setProfession(user.user_profession ?? "");
        setDescription(user.profile_description ?? "");
        setAvatarPreview(user.profile_img_url ?? null);
      }

      setLoadingProfile(false);
    };

    fetchProfile();
  }, [session]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);

    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(null);
    }
  }

  const handleSave = async () => {
    if (!session?.user) return;

    const trimmedUsername = username.trim();
    const trimmedProfession = profession.trim();
    const trimmedDescription = description.trim();

    if (!trimmedUsername) {
      setErrorMsg("Username cannot be empty");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      let profileImgUrl: string | null | undefined = avatarPreview;

      if(avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
        .from("profile_pictures")
        .upload(fileName, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
        .from("profile_pictures")
        .getPublicUrl(fileName);
        
        profileImgUrl = publicData.publicUrl;
      }

      const { error } = await supabase
      .from("users")
      .update({ 
        username: trimmedUsername,
        user_profession: trimmedProfession || null,
        profile_description: trimmedDescription || null,
        profile_img_url: profileImgUrl ?? null,
      })
      .eq("id", session.user.id);

    if (error) {
      console.error("Error actualizando perfil:", error.message);
      setErrorMsg("Error updating profile");
    } else {
      navigate("/profile");
    }
      } catch (err) {
        console.error("Error actualizando perfil:", err);
        setErrorMsg("Error updating profile");
      } finally {
        setSaving(false);
      }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  if (loadingProfile) {
    return (
      <div className="editprofile-container">
        <div className="editprofile-inner">
          <h1 className="editprofile-title">Edit Profile</h1>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="editprofile-container">
        <div className="editprofile-inner">
          <h1 className="editprofile-title">Edit Profile</h1>
          <p>No active session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editprofile-container">
      <Nav />
          <section className="back-button-editprofile">
            <BackButton />
          </section>
          <h1 className="editprofile-title">Edit Profile</h1>
      <div className="editprofile-inner">

          <label className="editprofile-avatar">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Profile preview" />
          ) : (
            <span className="editprofile-avatar-plus">+</span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </label>

          <div className="editprofile-form">
              Username
              <Input
                type="text"
                className="editprofile-input"
                value={username}
                onChange={setUsername}
                placeholder="Username"
              />

              Email
              <Input
                type="email"
                className="editprofile-input editprofile-input--readonly"
                value={session.user.email ?? ""}
                disabled
                placeholder=""
              />

              Profession
              <Input
                type="text"
                className="editprofile-input"
                value={profession}
                onChange={setProfession}
                placeholder="Profession"
              />

              Description about you
              <textarea
                className="editprofile-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />

            {errorMsg && <p className="editprofile-error">{errorMsg}</p>}

            <div className="editprofile-actions">
              <Button
                buttonplaceholder={saving ? "Saving..." : "Edit profile"}
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
        </div>
    </div>
  );
};

export default EditProfile;
