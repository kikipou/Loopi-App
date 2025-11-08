import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../database/supabaseClient";
import type { Post } from "../../types/postTypes";
import "./postdetail.css";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, created_at, post_name, post_description, post_professions, post_skills, image_url, categories, username"
        )
        .eq("id", Number(id))
        .single();

      if (error) {
        console.error("Error al obtener el post:", error);
        setPost(null);
      } else {
        setPost(data as Post);
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

  return (
    <div className="post-detail-container">
      <Link to="/home" className="post-detail-back">
        ← Volver
      </Link>

      <div className="post-detail-card">
        {post.image_url && (
          <img
            src={post.image_url || undefined}
            alt={post.post_name ?? "Post image"}
            className="post-detail-image"
          />
        )}

        <div className="post-detail-content">
          <h1 className="post-detail-title">{post.post_name}</h1>

          {post.username && (
            <p className="post-detail-author">
              Publicado por <strong>{post.username}</strong>
            </p>
          )}

          {createdAt && (
            <p className="post-detail-date">{createdAt.toLocaleString()}</p>
          )}

          {post.post_description && (
            <p className="post-detail-description">{post.post_description}</p>
          )}

          {post.post_professions && (
            <p className="post-detail-meta">
              <strong>Professions:</strong> {post.post_professions}
            </p>
          )}

          {post.post_skills && (
            <p className="post-detail-meta">
              <strong>Skills:</strong> {post.post_skills}
            </p>
          )}

          {post.categories && (
            <p className="post-detail-meta">
              <strong>Categories:</strong> {post.categories}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
