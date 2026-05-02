import "../styles/skills.css";

const skillGroups = [
  {
    title: "FRONTEND DEVELOPMENT",
    items: [
      { name: "React.js", level: "Intermediate" },
      { name: "JavaScript", level: "Intermediate" },
      { name: "HTML5", level: "Comfortable" },
      { name: "CSS3", level: "Comfortable" },
      { name: "Vite", level: "Learning" },
      { name: "React Router", level: "Learning" },
    ],
  },
  {
    title: "BACKEND & DATA",
    items: [
      { name: "Java", level: "Intermediate" },
      { name: "SQLite", level: "Comfortable" },
      { name: "REST API", level: "Comfortable" },
    ],
  },
  {
    title: "TOOLS & ENVIRONMENT",
    items: [
      { name: "Git", level: "Comfortable" },
      { name: "GitHub", level: "Comfortable" },
      { name: "VS Code", level: "Daily use" },
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
                  className={`skill_card ${item.level === "Learning" ? "is_learning" : "is_accent"}`}
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
