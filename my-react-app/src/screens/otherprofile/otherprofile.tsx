import "./otherprofile.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../../components/nav/nav";
import Button from "../../components/button/button";
import { supabase } from "../../database/supabaseClient";
import type { Post } from "../../types/postTypes";

type UserRow = {
  id: string;
  username: string | null;
  profile_img_url: string | null;
  user_profession: string | null;
  profile_description: string | null;
  profile_cover_url: string | null;
};

const OtherProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [profile, setProfile] = useState<UserRow | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const navigate = useNavigate(); 

  // --- Perfil del usuario ---
  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;

      setLoadingProfile(true);

      const { data, error } = await supabase
        .from("users")
        .select(
          "id, username, profile_img_url, user_profession, profile_description, profile_cover_url"
        )
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error obteniendo perfil de otro usuario:", error);
        setProfile(null);
      } else {
        setProfile(data as UserRow);
      }

      setLoadingProfile(false);
    };

    fetchProfile();
  }, [id]);

  // --- Posts de ese usuario ---
  useEffect(() => {
    const fetchPosts = async () => {
      if (!id) return;

      setLoadingPosts(true);

      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, created_at, post_name, post_description, post_professions, post_skills, image_url, categories, username, user_post_id"
        )
        .eq("user_post_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error obteniendo posts de otro usuario:", error.message);
        setPosts([]);
      } else {
        setPosts((data ?? []) as Post[]);
      }

      setLoadingPosts(false);
    };

    fetchPosts();
  }, [id]);

  const displayName = profile?.username ?? "Profile";
  const avatarUrl = profile?.profile_img_url ?? null;
  const coverUrl = profile?.profile_cover_url ?? null;

  if (loadingProfile) {
    return (
      <div className="otherprofile-container">
        <Nav />
        <div className="otherprofile-loading">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="otherprofile-container">
        <Nav />
        <div className="otherprofile-loading">
          <p>Profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="otherprofile-container">
      <Nav />

      {/* Cover del usuario */}
      <div
        className="otherprofile-cover"
        style={
          coverUrl
            ? { backgroundImage: `url(${coverUrl})` }
            : undefined
        }
      />

      {/* Header: avatar + info, misma estética que myprofile */}
      <div className="otherprofile-header">
        <div className="otherprofile-avatar-wrapper">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="otherprofile-avatar-img"
            />
          ) : (
            <div className="otherprofile-avatar-placeholder">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="otherprofile-info">
          <h1 className="otherprofile-title">{displayName}</h1>

          {profile.user_profession && (
            <p className="otherprofile-profession">
              {profile.user_profession}
            </p>
          )}

          {profile.profile_description && (
            <p className="otherprofile-description">
              {profile.profile_description}
            </p>
          )}
        </div>
      </div>

      {/* Acciones – para otro usuario tiene sentido un CTA tipo "Send request" */}
      <div className="otherprofile-actions">
        <Button
          buttonplaceholder="Send request"
          buttonid="otherprofile-request-button"
          onClick={() => {
            // aquí luego puedes abrir un modal o iniciar chat
            console.log("Send request to", profile.id);
          }}
        />
      </div>

      {/* Posts de este usuario (misma estética que MyProfile) */}
      <section className="otherprofile-posts-section">
        <h2 className="otherprofile-subtitle">
          {displayName}'s posts
        </h2>

        {loadingPosts ? (
          <p className="otherprofile-no-posts">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="otherprofile-no-posts">
            This user has not created any posts yet.
          </p>
        ) : (
          <div className="otherprofile-posts-grid">
            {posts.map((post) => {
              const formattedDate = post.created_at
                ? new Date(post.created_at).toLocaleString()
                : "";

                return (
                  <div
                    key={post.id}
                    className="otherprofile-post-card"
                    onClick={() => navigate(`/post/${post.id}`)}  // 👈 navega al detalle
                    role="button"
                  >
                    {post.image_url && (
                      <img
                        src={post.image_url || undefined}
                        alt={post.post_name ?? "Post image"}
                        className="otherprofile-post-image"
                      />
                    )}
              
                    <div className="otherprofile-post-main">
                      <div className="otherprofile-post-header">
                        <h3 className="otherprofile-post-title">{post.post_name}</h3>
                        {formattedDate && (
                          <span className="otherprofile-post-date">
                            {formattedDate}
                          </span>
                        )}
                      </div>
              
                      {post.post_description && (
                        <p className="otherprofile-post-description">
                          {post.post_description}
                        </p>
                      )}
              
                      {post.categories && (
                        <p className="otherprofile-post-meta">
                          <strong>Category:</strong> {post.categories}
                        </p>
                      )}
                    </div>
                  </div>
                );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default OtherProfile;
