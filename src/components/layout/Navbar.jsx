import { Link } from "react-router-dom";
import "../../styles/navbar.css";

export default function Navbar() {
  return (
    <nav>
      <div>
        <p className="logo">
          Theo<span>.dev</span>
        </p>
      </div>
      <div className="links">
        <Link to="/">home</Link>
        <Link to="/about">about</Link>
        <Link to="/projects">projects</Link>
        <Link to="/skills">skills</Link>
        <Link to="/contact">contact</Link>
      </div>
      <div>
        <button className="btn">// hire me</button>
      </div>
    </nav>
  );
}
