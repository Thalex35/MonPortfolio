import me from "../assets/me.jpeg";
import "../styles/about.css";

export default function About() {
  return (
    <section className="about">
      <p className="about_kicker">ABOUT ME</p>
      <h1>Developer, student & leader.</h1>
      <p className="about_intro">
        A little about who I am, where I come from, and what drives me.
      </p>

      <div className="about_content">
        <div className="about_photo_card">
          <img src={me} alt="Theodore portrait" className="about_photo" />
          <span className="about_photo_tag">// your photo</span>
        </div>

        <div className="about_text">
          <p>
            I&apos;m <strong>Theodore</strong>, a Computer Science student at{" "}
            <strong>UoPeople</strong> and Business Management student at{" "}
            <strong>UEspoir</strong>, based in <strong>Port-au-Prince, Haiti</strong>.
          </p>
          <p>
            I&apos;m passionate about building things that are{" "}
            <strong>clean, functional, and well-crafted</strong> - from Java
            desktop apps to React web platforms. Every project teaches me
            something new.
          </p>
          <p>
            I&apos;m also a <strong>church leader</strong> - I coordinate the
            children&apos;s ministry at my local church, which taught me that
            leadership, planning, and communication are just as important as
            technical skills.
          </p>
          <p>
            I&apos;m a <strong>Christian</strong>, and my faith shapes how I
            approach work: with integrity, purpose, and care for others.
          </p>
        </div>
      </div>

      <div className="about_extra">
        <div className="about_stats">
          <div className="about_stat">
            <p className="about_stat_value">3+</p>
            <p className="about_stat_label">Projects built</p>
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
          <p className="about_hobbies_title">INTERESTS & HOBBIES</p>
          <div className="about_hobbies_list">
            <span>💻 Web development</span>
            <span>🎮 Anime</span>
            <span>⛪ Church services</span>
            <span>📊 Business</span>
            <span>🌐 Learning English</span>
            <span>🧠 Problem solving</span>
          </div>
        </div>
      </div>
    </section>
  );
}
