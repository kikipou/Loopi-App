import "./homepage.css";
import { useState } from "react";
import Nav from "../../components/nav/nav";
import Hero from "../../components/hero/hero";
import Nav2 from "../../components/nav2/nav2";
import PostsList from "../../components/postList/postsList";
import Footer from "../../components/footer/footer";

const CATEGORIES = [
  "All",
  "Design",
  "Development",
  "Engineering",
  "Chemistry",
  "Physics",
  "Finances",
];

const HomePage = () => {
  const [currentCategory, setCurrentCategory] = useState<string>("All");

  return (
    <div className="homepage-container">
      <Nav />
      <Hero />
      <Nav2
        categories={CATEGORIES}
        currentCategory={currentCategory}
        onCategoryChange={setCurrentCategory}
      />
      <PostsList currentCategory={currentCategory} />
      <Footer />
    </div>
  );
};

export default HomePage;
