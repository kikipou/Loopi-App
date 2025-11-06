import "./homepage.css";
import Nav from "../../components/nav/nav";
import Hero from "../../components/hero/hero";
import PostsList from "../../components/postList/postsList";
import Footer from "../../components/footer/footer";

const HomePage = () => {
  // const { posts, loading } = usePosts();

  return (
    <div className="homepage-container">
      <Nav />
      <Hero />
      <PostsList />
      {/* <Nav2 /> */}

      {/* <div className="posts-container">
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts avaiable</p>
            <p>Check Supabase connection</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              {post.image_url && (
                <div className="post-image-container">
                  <img
                    src={post.image_url}
                    alt={post.post_name}
                    className="post-image"
                    onError={(e) => {
                      console.log(
                        `Error cargando imagen para post ${post.id}:`,
                        post.image_url
                      );
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="post-content">
                <h3>{post.post_name}</h3>
                <h4>Description</h4>
                <p> {post.post_description}</p>
                <h4>Profession Interested</h4>
                <p>{post.post_professions}</p>
                <h4>Skills required</h4>
                <p>{post.post_skills}</p>
              </div>
            </div>
          ))
        )}
      </div> */}

      <Footer />
    </div>
  );
};

export default HomePage;
