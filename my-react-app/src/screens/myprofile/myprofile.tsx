// src/screens/myprofile/myprofile.tsx
import "./myprofile.css";
import Button from "../../components/button/button";
import { useDispatch, useSelector } from "react-redux";
import { clearSession } from "../../redux/slices/authSlice";
import type { RootState } from "../../redux/store";
import { supabase } from "../../database/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Post } from "../../types/postTypes";

type UserProfile = {
  username: string | null;
  avatar_url: string | null; // 👈 ajusta al nombre real de tu columna
};

const MyProfile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { session } = useSelector((state: RootState) => state.auth);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // 🔹 Cargar datos básicos del usuario desde la tabla "users"
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;

      setLoadingProfile(true);

      const { data, error } = await supabase
        .from("users")
        // 👇 PON aquí los nombres reales de tus columnas
        .select("username, avatar_url")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error obteniendo perfil:", error.message);
        setProfile(null);
      } else {
        setProfile({
          username: (data as any).username ?? null,
          avatar_url: (data as any).avatar_url ?? null,
        });
      }

      setLoadingProfile(false);
    };

    fetchProfile();
  }, [session]);

  // 🔹 Cargar los posts creados por este usuario
  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!session?.user) return;

      setLoadingPosts(true);

      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, created_at, post_name, post_description, post_professions, post_skills, image_url, categories, username, user_post_id"
        )
        .eq("user_post_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error obteniendo posts del usuario:", error.message);
        setMyPosts([]);
      } else {
        setMyPosts((data ?? []) as Post[]);
      }

      setLoadingPosts(false);
    };

    fetchMyPosts();
  }, [session]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      dispatch(clearSession());
      console.log("User logged out successfully");
      navigate("/login", { replace: true });
    }
  };

  const handleAddPost = () => {
    navigate("/upload");
  };

  const displayName =
    profile?.username ?? session?.user.email ?? "Your profile";

  return (
    <div className="myprofile-container">
      {/* Header con avatar + nombre */}
      <div className="myprofile-header">
        {loadingProfile ? (
          <div className="myprofile-avatar skeleton" />
        ) : profile?.avatar_url ? (
          <img
            src={profile.avatar_url || undefined}
            alt={displayName}
            className="myprofile-avatar"
          />
        ) : (
          <div className="myprofile-avatar placeholder">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="myprofile-info">
          <h1 className="myprofile-title">{displayName}</h1>
          {session?.user.email && (
            <p className="myprofile-email">{session.user.email}</p>
          )}
        </div>
      </div>

      {/* Botones principales */}
      <div className="myprofile-actions">
        <Button
          buttonplaceholder="Add Post"
          buttonid="add-button"
          onClick={handleAddPost}
        />

        <Button
          buttonplaceholder="Log out"
          buttonid="logout-button"
          onClick={handleLogout}
        />
      </div>

      {/* Sección de posts del usuario */}
      <section className="myprofile-posts-section">
        <h2 className="myprofile-subtitle">Your posts</h2>

        {loadingPosts ? (
          <p>Loading your posts...</p>
        ) : myPosts.length === 0 ? (
          <p className="myprofile-no-posts">
            You haven't created any posts yet.
          </p>
        ) : (
          <div className="myprofile-posts-grid">
            {myPosts.map((post) => {
              const formattedDate = post.created_at
                ? new Date(post.created_at).toLocaleString()
                : "";

              return (
                <div key={post.id} className="myprofile-post-card">
                  {post.image_url && (
                    <img
                      src={post.image_url || undefined}
                      alt={post.post_name ?? "Post image"}
                      className="myprofile-post-image"
                    />
                  )}

                  <div className="myprofile-post-main">
                    <div className="myprofile-post-header">
                      <h3 className="myprofile-post-title">{post.post_name}</h3>
                      {formattedDate && (
                        <span className="myprofile-post-date">
                          {formattedDate}
                        </span>
                      )}
                    </div>

                    {post.post_description && (
                      <p className="myprofile-post-description">
                        {post.post_description}
                      </p>
                    )}

                    {post.categories && (
                      <p className="myprofile-post-meta">
                        <strong>Category:</strong> {post.categories}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    className="myprofile-edit-button"
                    onClick={() => {
                      // Aquí luego meterás la navegación a /edit-post/:id o modal
                      console.log("Edit post id:", post.id);
                    }}
                  >
                    Edit
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyProfile;
