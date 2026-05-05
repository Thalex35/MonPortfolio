import me from "../assets/me.jpeg";
import "../styles/about.css";

export default function About() {
  return (
    <section className="about">
      <p className="about_kicker">ABOUT ME</p>
      <h1>Developer, student & christian.</h1>
      <p className="about_intro">
        A little about who I am, where I come from, and what drives me.
      </p>

      <div className="about_content">
        <div className="about_photo_card">
          <img src={me} alt="Theodore portrait" className="about_photo" />
          <span className="about_photo_nameplate">Theodore Louisjuste</span>
        </div>

        <div className="about_text">
          <p>
            I&apos;m <strong>Theodore</strong>, a Computer Science student at{" "}
            <strong>UoPeople</strong> and Business Management student at{" "}
            <strong>UEspoir</strong>, based in <strong>Aquin Sud, Haiti</strong>
            .
          </p>
          <p>
            I&apos;m passionate about building things that are{" "}
            <strong>clean, functional, and well-crafted</strong> - whether it's
            a Java desktop application or a full React web platform. For me,
            every project is more than just code — it's a chance to solve a real
            problem, learn something new, and grow as a developer. I pay close
            attention to detail, and I believe that good software should not
            only work well, but also feel good to use.
          </p>
          <p>
            I&apos;m urrently focused on <strong>front-end development</strong>{" "}
            , where I enjoy turning ideas into smooth, intuitive user
            interfaces. I work mainly with{" "}
            <strong>React.js, JavaScript, HTML, and CSS</strong>, always pushing
            myself to write cleaner, more efficient code.
          </p>
          <p>
            I&apos;m a <strong>Christian</strong>, and my faith shapes how I
            approach work: with integrity, purpose, and care for others.
            <br></br> I'm at the beginning of my journey, but I'm building every
            day — one project, one line of code, one lesson at a time.
          </p>
        </div>
      </div>

      <div className="about_extra">
        <div className="about_stats">
          <div className="about_stat">
            <p className="about_stat_value">2+</p>
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
