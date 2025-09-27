import "./homepage.css";
import Nav from "../../components/nav/nav";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <Nav />
      <div className="homepage-content">
        <h1>Home Page</h1>
        <p>Bienvenido a Loopi - Where connections loop</p>
      </div>
    </div>
  );
};

export default HomePage;