import "../styles/projects.css";

export default function Projects() {
  const projects = [
    {
      title: "TaskMate",
      meta: "PROJECT_01 - GROUP PROJECT - 2025",
      description:
        "A homework and deadline manager for university students. Built with my team as part of the Web Design Bootcamp - full React + supabase",
      tech: ["React.js", "localStorage", "supabase"],
      featured: true,
      links: [
        { label: "github", url: "https://github.com/Thalex35/Taskmate-app" },
        { label: "demo", url: "#" },
      ],
    },
    {
      title: "Anime Watchlist",
      meta: "PROJECT_02 - LEARNING PROJECT - 2025",
      description:
        "React app built as a deep dive into the useContext hook. Features a ThemeContext for dark/light mode toggle and an AnimeContext for managing a personal anime watchlist.",
      tech: ["React.js", "useContext", "useState", "CSS Modules"],
      featured: true,
      links: [
        { label: "github", url: "https://github.com/Thalex35/Manage-Movies" },
        { label: "demo", url: "#" },
      ],
    },
  ];

  return (
    <section className="projects">
      <p className="projects_kicker">PROJECTS</p>
      <h1>Things I've built.</h1>
      <p className="projects_intro">
        Real projects - each one representing a lesson learned and a skill
        gained.
      </p>

      <div className="projects_list">
        {projects.map((project) => {
          return (
            <article className="project_card" key={project.title}>
              <div className="project_main">
                <p className="project_meta">{project.meta}</p>
                <h2>{project.title}</h2>
                <p className="project_desc">{project.description}</p>
                <div className="project_tech">
                  {project.tech.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className="project_side">
                {project.featured ? (
                  <p className="project_badge">featured</p>
                ) : null}
                <div className="project_links">
                  {project.links.map((link) => (
                    <a key={link.label} target="_blank" href={link.url}>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
