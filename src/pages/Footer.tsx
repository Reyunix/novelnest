import { FOOTER_MENU_LINKS } from "../consts";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <nav className="footer-nav">
        <ul className="footer-menu">
          {FOOTER_MENU_LINKS.map((link) => {
            return (
              <li key={link.id} className="footer-menu-item">
                <Link to="/"> {link.literal} </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
};
