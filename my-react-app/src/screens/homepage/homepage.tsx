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
      <Footer />
    </div>
  );
};

export default HomePage;
