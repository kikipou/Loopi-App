// import { usePosts } from "../../../contexts/postsContext";

const PostsList = () => {
  const { posts, loading } = usePosts();

  if (loading) return <p>Loading posts...</p>;

  if (posts.length === 0) {
    return (
      <div className="posts-grid">
        <div className="no-posts">
          <p>No posts avaiable</p>
          <p>Check Supabase connection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          {post.image_url && <img src={post.image_url} alt={post.post_name} />}
          <h3>Description: {post.post_name}</h3>
          <p>{post.post_description}</p>
          <p>{post.post_professions}</p>
          <p>{post.post_skills}</p>
        </div>
      ))}
    </div>
  );
};

export default PostsList;
