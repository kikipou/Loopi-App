import "./homepage.css";
import Nav from "../../components/nav/nav";
import Hero from "../../components/hero/hero";
import Nav2 from "../../components/nav2/nav2";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <Nav />
      <Hero />
      <Nav2 />
    </div>
  );
};

export default HomePage;