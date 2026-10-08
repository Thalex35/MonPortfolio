import me from "../assets/me.jpeg";
import { usePortfolio } from "../hooks/usePortfolio";
import "../styles/about.css";

export default function About() {
  const { about, error } = usePortfolio();

  return (
    <section className="about">
      <p className="about_kicker">ABOUT ME</p>
      <h1>{about.headline}</h1>
      <p className="about_intro">{about.introduction}</p>
      {error ? <p className="portfolio_content_notice" role="status">{error} Showing saved portfolio content.</p> : null}

      <div className="about_content">
        <div className="about_photo_card">
          <img
            src={about.image_url || me}
            alt={about.image_alt || `Portrait of ${about.profile_name}`}
            className="about_photo"
            loading="lazy"
            decoding="async"
          />
          <span className="about_photo_nameplate">{about.profile_name}</span>
        </div>

        <div className="about_text">
          {(about.paragraphs || []).map((paragraph, index) => (
            <p key={`${index}-${paragraph}`}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="about_extra">
        <div className="about_stats">
          {(about.stats || []).map((stat, index) => (
            <div className="about_stat" key={`${index}-${stat.label}`}>
              <p className="about_stat_value">{stat.value}</p>
              <p className="about_stat_label">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="about_hobbies">
          <h2 className="about_hobbies_title">INTERESTS &amp; HOBBIES</h2>
          <div className="about_hobbies_list">
            {(about.interests || []).map((interest) => (
              <span key={interest}>{interest}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
