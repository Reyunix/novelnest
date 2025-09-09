import { HEADER_MENU_LINKS } from "../consts";
import { Link } from "react-router-dom";
export const Header: React.FC = () => {
  return (
    <header className="header">
      <h1>NovelNest</h1>
      <nav className="header-nav">
        <ul className="header-menu">
          {HEADER_MENU_LINKS.map((link) => {
            return (
              <li key={link.id} className="header-menu-item">
                <Link to="/"> {link.literal} </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};
