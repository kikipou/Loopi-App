
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img className="loopi-logo" src="https://github.com/kikipou/Loopi-App/blob/cata/my-react-app/src/assets/imgs/loopi-logo.png?raw=true" alt="logo" />
        </div>

        <div className="footer-content">
          <div className="footer-column">
            <h3 className="column-title">Home</h3>
            <ul className="column-list">
              <li><a href="/">Loopi</a></li>
              <li><a href="/search">Search</a></li>
              <li><a href="/chats">Chats</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="column-title">Contact</h3>
            <ul className="column-list">
              <li>555-555-555</li>
              <li>loopi@loopi.lo.com</li>
              <li>@loopiapp</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="column-title">Socials</h3>
            <ul className="column-list">
              <li>@loopi.lop</li>
              <li>@loppiapp</li>
              <li>@loopiagency</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="column-title">Legal</h3>
            <ul className="column-list">
              <li>Terms & Policy</li>
              <li>Privacy Policy</li>
              <li>Cookies Policy</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;