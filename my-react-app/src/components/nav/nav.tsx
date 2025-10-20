
import { useNavigate, useLocation } from "react-router-dom";
import "./nav.css";

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };


  return (
    <nav className="nav-container">
      {/* Logo y Branding - Izquierda */}
      <div className="nav-left">
        <div className="nav-logo" onClick={() => handleNavigation("/home")}>
        <img className="loopi-logo" src="https://github.com/kikipou/Loopi-App/blob/cata/my-react-app/src/assets/imgs/loopi-logo.png?raw=true" alt="logo" />
        </div>
      </div>

      {/* Enlaces de Navegación - Centro */}
      <div className="nav-center">
        <div className="nav-icon">
        <img className="loop-icon" src="https://github.com/kikipou/Loopi-App/blob/cata/my-react-app/src/assets/imgs/loop.png?raw=true" alt="loop-icon" />
        </div>
        <div className="nav-links">
          <button 
            className={`nav-link ${isActive('/search') ? 'active' : ''}`}
            onClick={() => handleNavigation('/search')}
          >
            Search
          </button>
          <button 
            className={`nav-link ${isActive('/chats') ? 'active' : ''}`}
            onClick={() => handleNavigation('/chats')}
          >
            Chats
          </button>
          <button 
            className={`nav-link ${isActive('/explore') ? 'active' : ''}`}
            onClick={() => handleNavigation('/explore')}
          >
            Explore
          </button>
        </div>
      </div>

      {/* Avatar de Perfil - Derecha */}
      <div className="nav-right">
        <div 
          className="nav-avatar"
          onClick={() => handleNavigation('/profile')}
        >
          <img 
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop&crop=face" 
            alt="Profile" 
            className="avatar-image"
          />
        </div>
      </div>
    </nav>
  );
};

export default Nav;