import { Link } from "react-router-dom";
import "../../styles/hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero_content">
        <p className="word">Open to freelance &amp; frontend opportunities</p>
        <p className="hero_greeting">Hi, I&apos;m Theodore Louisjuste.</p>
        <h1>
          Frontend
          <span>Developer.</span>
        </h1>
        <p className="para">
          I&apos;m a Computer Science student at UoPeople, building useful web
          experiences with React, JavaScript, HTML, CSS, and Vite.
        </p>

        <div className="hero_actions">
          <Link to="/projects" className="btn_see">
            Explore projects
          </Link>
          <Link to="/contact" className="btn_getintouch">
            Contact me
          </Link>
        </div>
      </div>
    </section>
  );
}
