import "./hero.css";

const Hero = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Find your <span className="hero-title-accent">loopi</span>
          </h1>
          <p className="hero-quote">
            "Connections don't always start with words — sometimes they start with what you build."
          </p>
        </div>
      </div>
      <div className="hero-image-container"></div>
    </div>
  );
};

export default Hero;
