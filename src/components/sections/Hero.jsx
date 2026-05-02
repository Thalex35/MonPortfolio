import { Link } from "react-router-dom";
import "../../styles/hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero_text">
        <p className="word">available for opportunities</p>
        <h2>Hello, I'm Theodore -</h2>
        <h1>
          Front-end
          <span>Developer.</span>
        </h1>
        <p className="para">
          CS student at UoPeople. I build clean, functional web applications
          with modern tools - React, Node.js, Java - and a strong eye for
          detail.
        </p>
      </div>

      <div className="hero_actions">
        <Link to="/projects">
          <button className="btn_see">View projects</button>
        </Link>

        <Link to="/contact">
          <button className="btn_getintouch">Get in touch</button>
        </Link>
      </div>
    </section>
  );
}
