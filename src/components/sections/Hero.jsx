import { Link } from "react-router-dom";
import "../../styles/hero.css";
export default function Hero() {
  return (
    <div className="hero">
      <p className="word">available for opportunities</p>
      <h2>Hello, I'm Theodore-</h2>
      <h1>Front-end Developer</h1>
      <p>
        CS student at UoPeople. I build clean, functional web applications with
        modern tools — React, Java — and a strong eye for detail.
      </p>
      <div>
        <Link to="/projects">
          <button className="btn_see">View projects</button>
        </Link>

        <Link to="/contact">
          <button className="btn_getintouch">Get in touch</button>
        </Link>
      </div>
    </div>
  );
}
