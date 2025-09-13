import {NavLink } from "react-router-dom";
import { HEADER_MENU_LINKS } from "../consts";

export const Nav:React.FC = () => {
  return (
    <nav className="header-nav">
        <ul className="header-menu">
          {HEADER_MENU_LINKS.map((link) => {
            return (
              <li key={link.id} className="header-menu-item">
                <NavLink to={link.href}> {link.literal} </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
  )
}
