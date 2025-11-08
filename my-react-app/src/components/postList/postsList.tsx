import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { setPosts, startLoading } from "../../redux/slices/postSlice";
import { supabase } from "../../database/supabaseClient";
import { Link } from "react-router-dom";
import "./postslist.css";

interface PostsListProps {
  currentCategory: string;
}

const PostsList: React.FC<PostsListProps> = ({ currentCategory }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, isLoading } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(startLoading());

      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, created_at, post_name, post_description, post_professions, post_skills, image_url, categories, username"
        );

      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }

      dispatch(setPosts(data ?? []));
    };

    fetchPosts();
  }, [dispatch]);

  if (isLoading) return <p>Loading posts...</p>;

  const visiblePosts =
    currentCategory === "All"
      ? posts
      : posts.filter(
          (post) =>
            (post.categories ?? "").toLowerCase() ===
            currentCategory.toLowerCase()
        );

  if (!visiblePosts || visiblePosts.length === 0) {
    return (
      <div className="posts-grid">
        <div className="no-posts">
          <p>No posts available</p>
          <p>
            {currentCategory === "All"
              ? "Check Supabase connection"
              : `No posts in category "${currentCategory}"`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="posts-grid">
      {visiblePosts.map((post) => {
        const formattedDate = post.created_at
          ? new Date(post.created_at).toLocaleString()
          : "";

        return (
          <Link
            key={post.id}
            to={`/post/${post.id}`}
            className="post-card-link"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="post-card">
              {post.image_url && (
                <img
                  src={post.image_url || undefined}
                  alt={post.post_name ?? "Post image"}
                />
              )}

              <h3>{post.post_name}</h3>

              {post.post_description && <p>{post.post_description}</p>}
              {post.post_professions && <p>{post.post_professions}</p>}
              {post.post_skills && <p>{post.post_skills}</p>}
              {post.username && <p>By: {post.username}</p>}
              {formattedDate && <p>{formattedDate}</p>}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PostsList;
