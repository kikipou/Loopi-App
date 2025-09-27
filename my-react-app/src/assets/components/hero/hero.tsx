import "./hero.css";

const Hero = () => {
  return (
    <div className="hero-container">
      {/* Gradientes laterales */}
      <div className="hero-gradient-left"></div>
      <div className="hero-gradient-right"></div>
      
      {/* Imagen de fondo */}
      <div className="hero-image-container">
        {/* Aquí puedes reemplazar con tu imagen */}
        <div className="hero-image-placeholder">
          <div className="placeholder-text">Tu imagen aquí</div>
        </div>
      </div>
      
      {/* Contenido superpuesto */}
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
    </div>
  );
};

export default Hero;
