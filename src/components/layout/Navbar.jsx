import { Link, NavLink } from "react-router-dom";
import "../../styles/navbar.css";

export default function Navbar() {
  return <nav><div><Link to="/" className="logo" aria-label="Go to home">Theed<span>.dev</span></Link></div><div className="links"><NavLink to="/">home</NavLink><NavLink to="/about">about</NavLink><NavLink to="/skills">skills</NavLink><NavLink to="/projects">projects</NavLink><NavLink to="/contact">contact</NavLink></div><div><Link to="/contact" className="btn">// hire me</Link></div></nav>;
}
