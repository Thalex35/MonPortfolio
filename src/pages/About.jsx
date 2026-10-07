import me from "../assets/me.jpeg";
import "../styles/about.css";

export default function About() {
  return (
    <section className="about">
      <p className="about_kicker">ABOUT ME</p>
      <h1>Developer, student &amp; Christian.</h1>
      <p className="about_intro">
        A little about who I am, what I&apos;m learning, and what matters to me.
      </p>

      <div className="about_content">
        <div className="about_photo_card">
          <img
            src={me}
            alt="Portrait of Theodore Louisjuste"
            className="about_photo"
            loading="lazy"
            decoding="async"
          />
          <span className="about_photo_nameplate">Theodore Louisjuste</span>
        </div>

        <div className="about_text">
          <p>
            I&apos;m <strong>Theodore Louisjuste</strong>, also known as Theed.
            I&apos;m a Computer Science student at <strong>UoPeople</strong> and
            a Business Management student at <strong>UEspoir</strong>, based in{" "}
            <strong>Aquin Sud, Haiti</strong>.
          </p>
          <p>
            I enjoy building useful software and turning ideas into{" "}
            <strong>clear, thoughtful interfaces</strong>. Each project gives
            me a chance to solve a problem, learn something new, and improve how
            I build for the people using it.
          </p>
          <p>
            My current focus is <strong>frontend development</strong>. I work
            mainly with <strong>React, JavaScript, HTML, and CSS</strong>, and
            use Vite in my projects. I&apos;m continuing to build experience
            through hands-on work and study.
          </p>
          <p>
            My Christian faith is important to me and guides me to approach
            people and my work with integrity and care. I&apos;m early in my
            journey, learning steadily and building one project at a time.
          </p>
        </div>
      </div>

      <div className="about_extra">
        <div className="about_stats">
          <div className="about_stat">
            <p className="about_stat_value">6</p>
            <p className="about_stat_label">Projects showcased</p>
          </div>
          <div className="about_stat">
            <p className="about_stat_value">2</p>
            <p className="about_stat_label">Degrees in progress</p>
          </div>
          <div className="about_stat">
            <p className="about_stat_value">HTI</p>
            <p className="about_stat_label">Based in Haiti</p>
          </div>
        </div>

        <div className="about_hobbies">
          <h2 className="about_hobbies_title">INTERESTS &amp; HOBBIES</h2>
          <div className="about_hobbies_list">
            <span> Web development</span>
            <span> Anime</span>
            <span> Church services</span>
            <span> Business</span>
            <span> Learning English</span>
            <span> Problem solving</span>
          </div>
        </div>
      </div>
    </section>
  );
}
