import "../styles/skills.css";

const skillGroups = [
  {
    title: "FRONTEND DEVELOPMENT",
    items: [
      { name: "React.js", level: "Intermediate", tone: "accent" },
      { name: "JavaScript", level: "Intermediate", tone: "accent" },
      { name: "HTML5", level: "Comfortable", tone: "accent" },
      { name: "CSS3", level: "Comfortable", tone: "accent" },
      { name: "Vite", level: "Learning", tone: "neutral" },
      { name: "React Router", level: "Learning", tone: "neutral" },
    ],
  },
  {
    title: "BACKEND & DATA",
    items: [
      { name: "Java", level: "Intermediate", tone: "accent" },
      { name: "SQLite", level: "Comfortable", tone: "accent" },
      { name: "REST API", level: "Comfortable", tone: "neutral" },
    ],
  },
  {
    title: "TOOLS & ENVIRONMENT",
    items: [
      { name: "Git", level: "Comfortable", tone: "neutral" },
      { name: "GitHub", level: "Comfortable", tone: "neutral" },
      { name: "VS Code", level: "Daily use", tone: "neutral" },
    ],
  },
];

export default function Skills() {
  return (
    <section className="skills">
      <p className="skills_kicker">SKILLS</p>
      <h1>What I work with.</h1>
      <p className="skills_intro">
        Tools and technologies I use daily - built through coursework, personal
        projects, and a lot of practice.
      </p>

      <div className="skills_groups">
        {skillGroups.map((group) => (
          <section className="skills_group" key={group.title}>
            <p className="skills_group_title">{group.title}</p>
            <div className="skills_cards">
              {group.items.map((item) => (
                <article
                  key={item.name}
                  className={`skill_card ${item.tone === "accent" ? "is_accent" : ""}`}
                >
                  <p className="skill_name">{item.name}</p>
                  <p className="skill_level">{item.level}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
