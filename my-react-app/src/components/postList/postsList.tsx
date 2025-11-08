// src/screens/postslist/postslist.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { setPosts, startLoading } from "../../redux/slices/postSlice";
import { supabase } from "../../database/supabaseClient";
import { Link } from "react-router-dom"; // 👈 IMPORTANTE
import "./postslist.css";

const PostsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, isLoading } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(startLoading());
      const { data, error } = await supabase
        .from("posts")
        .select(
          "created_at, post_name, post_description, post_professions, post_skills, image_url, categories, username, id"
        );

      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }

      dispatch(setPosts(data));
    };

    fetchPosts();
  }, [dispatch]);

  if (isLoading) return <p>Loading posts...</p>;

  if (posts.length === 0) {
    return (
      <div className="posts-grid">
        <div className="no-posts">
          <p>No posts available</p>
          <p>Check Supabase connection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/post/${post.id}`} // 👈 aquí navegamos al detalle
          className="post-card-link"
          style={{ textDecoration: "none", color: "inherit" }} // que no se vea como <a>
        >
          <div className="post-card">
            {post.image_url && (
              <img src={post.image_url} alt={post.post_name || "Post image"} />
            )}
            <h3>{post.post_name}</h3>
            <p>{post.post_description}</p>
            <p>{post.post_professions}</p>
            <p>{post.post_skills}</p>
            {post.username && <p>By: {post.username}</p>}
            <p>{new Date(post.created_at || "").toLocaleString()}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostsList;
