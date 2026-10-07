import { Link, NavLink } from "react-router-dom";
import "../../styles/navbar.css";

export default function Navbar() {
  return (
    <header className="site_header">
      <nav className="site_nav" aria-label="Primary">
        <Link to="/" className="logo" aria-label="Theed.dev home">
          Theed<span>.dev</span>
        </Link>
        <div className="site_nav_links">
          <NavLink to="/" end>home</NavLink>
          <NavLink to="/about">about</NavLink>
          <NavLink to="/skills">skills</NavLink>
          <NavLink to="/projects">projects</NavLink>
          <NavLink to="/contact">contact</NavLink>
        </div>
        <Link to="/contact" className="hire_link">// hire me</Link>
      </nav>
    </header>
  );
}
