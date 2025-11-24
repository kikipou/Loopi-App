import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { supabase } from "../../database/supabaseClient";
import "./nav.css";

type NavUserRow = {
  profile_img_url: string | null;
  username: string | null;
};

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { session } = useSelector((state: RootState) => state.auth);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const loadAvatar = async () => {
      if (!session?.user) {
        setAvatarUrl(null);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("profile_img_url, username")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error cargando avatar en Nav:", error.message);
        setAvatarUrl(null);
      } else if (data) {
        const user = data as NavUserRow;
        setAvatarUrl(user.profile_img_url ?? null);
      }
    };

    loadAvatar();
  }, [session?.user?.id]);

  return (
    <nav className="nav-container">
      <div className="nav-left">
        <div className="nav-logo" onClick={() => handleNavigation("/home")}>
          <img
            className="loopi-logo"
            src="https://github.com/kikipou/Loopi-App/blob/cata/my-react-app/src/assets/imgs/loopi-logo.png?raw=true"
            alt="logo"
          />
        </div>
      </div>

      <div className="nav-center">
        <div className="nav-icon" onClick={() => handleNavigation("/loopi")}>
          <img
            className="loop-icon"
            src="https://github.com/kikipou/Loopi-App/blob/cata/my-react-app/src/assets/imgs/loop.png?raw=true"
            alt="loop-icon"
          />
        </div>
        <div className="nav-links">
          <button
            className={`nav-link ${isActive("/search") ? "active" : ""}`}
            onClick={() => handleNavigation("/search")}
          >
            Search
          </button>
          <button
            className={`nav-link ${isActive("/explore") ? "active" : ""}`}
            onClick={() => handleNavigation("/home")}
          >
            Explore
          </button>
        </div>
      </div>

      <div className="nav-right">
        <div
          className="nav-avatar"
          onClick={() => handleNavigation("/profile")}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="avatar-image" />
          ) : (
            <div className="nav-avatar-placeholder">
              {session?.user?.email
                ? session.user.email.charAt(0).toUpperCase()
                : "?"}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
