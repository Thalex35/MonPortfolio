import "../styles/skills.css";

const skillGroups = [
  {
    title: "FRONTEND",
    items: [
      { name: "React", level: "Used in projects" },
      { name: "JavaScript", level: "Used in projects" },
      { name: "HTML", level: "Frontend foundation" },
      { name: "CSS", level: "Frontend foundation" },
      { name: "Vite", level: "Build tooling" },
    ],
  },
  {
    title: "TOOLS & VERSION CONTROL",
    items: [
      { name: "Git", level: "Used for version control" },
      { name: "GitHub", level: "Code hosting & collaboration" },
    ],
  },
  {
    title: "PROJECT EXPERIENCE",
    items: [{ name: "Supabase", level: "Used in TaskMate" }],
  },
];

export default function Skills() {
  return (
    <section className="skills">
      <p className="skills_kicker">SKILLS</p>
      <h1>What I work with.</h1>
      <p className="skills_intro">
        My current frontend stack, plus tools I&apos;ve used in coursework and
        projects. The labels describe experience, not proficiency ratings.
      </p>

      <div className="skills_groups">
        {skillGroups.map((group) => (
          <section className="skills_group" key={group.title}>
            <h2 className="skills_group_title">{group.title}</h2>
            <div className="skills_cards">
              {group.items.map((item) => (
                <article
                  key={item.name}
                  className="skill_card is_accent"
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
