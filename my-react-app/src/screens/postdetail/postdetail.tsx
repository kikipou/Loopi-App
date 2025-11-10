import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../database/supabaseClient";
import type { Post } from "../../types/postTypes";
import "./postdetail.css";
import Nav from "../../components/nav/nav";
import BackButton from "../../components/backbutton/backbutton";

type AuthorProfile = {
  id: string;
  username: string | null;
  profile_img_url: string | null;
};

type PostWithAuthor = Post & {
  user_post_id?: string | null;
};

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostWithAuthor | null>(null);
  const [author, setAuthor] = useState<AuthorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, created_at, post_name, post_description, post_professions, post_skills, image_url, categories, username, user_post_id"
        )
        .eq("id", Number(id))
        .single();

      if (error || !data) {
        console.error("Error al obtener el post:", error);
        setPost(null);
        setAuthor(null);
        setLoading(false);
        return;
      }

      const typedPost = data as PostWithAuthor;
      setPost(typedPost);

      if (typedPost.user_post_id) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, username, profile_img_url")
          .eq("id", typedPost.user_post_id)
          .single();

        if (userError) {
          console.error("Error obteniendo autor:", userError.message);
          setAuthor(null);
        } else if (userData) {
          setAuthor(userData as AuthorProfile);
        }
      }

      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="post-detail-loading">Cargando post...</div>;
  }

  if (!post) {
    return (
      <div className="post-detail-not-found">
        <p>No se encontró el post</p>
        <Link to="/home">Volver al inicio</Link>
      </div>
    );
  }

  const createdAt = post.created_at ? new Date(post.created_at) : null;
  const authorName = author?.username ?? post.username ?? "Usuario";
  const authorAvatar = author?.profile_img_url ?? null;

  return (
    <div className="post-detail-container">
      <Nav />
      <section className="back-button-postdetail">
            <BackButton />
          </section>

      <div className="post-detail-card">
        {post.image_url && (
          <img
            src={post.image_url || undefined}
            alt={post.post_name ?? "Post image"}
            className="post-detail-image"
          />
        )}

        <div className="post-detail-content">
          <div className="post-detail-header-row">
            <div className="post-detail-avatar">
              {authorAvatar ? (
                <img src={authorAvatar} alt={authorName} />
              ) : (
                <span>{authorName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="post-detail-header-text">
              <h1 className="post-detail-title">{post.post_name}</h1>

              <p className="post-detail-author">
                Publicado por{" "}
                <Link
                  to={`/user/${post.user_post_id}`}
                  className="post-detail-author-link"
                >
                  {authorName}
                </Link>
              </p>

              {createdAt && (
                <p className="post-detail-date">
                  {createdAt.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {post.post_description && (
            <p className="post-detail-description">
              {post.post_description}
            </p>
          )}

          <div className="post-detail-meta-row">
            {post.post_professions && (
              <div className="post-detail-meta-block">
                <p className="post-detail-meta">
                  <span className="post-detail-meta-label">Professions:</span>{" "}
                  {post.post_professions}
                </p>
              </div>
            )}

            {post.post_skills && (
              <div className="post-detail-meta-block">
                <p className="post-detail-meta">
                  <span className="post-detail-meta-label">Skills:</span>{" "}
                  {post.post_skills}
                </p>
              </div>
            )}

            {post.categories && (
              <div className="post-detail-meta-block">
                <p className="post-detail-meta">
                  <span className="post-detail-meta-label">Categories:</span>{" "}
                  {post.categories}
                </p>
              </div>
            )}
          </div>

          <div className="post-detail-cta">
            <button className="post-detail-button">Send request</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
