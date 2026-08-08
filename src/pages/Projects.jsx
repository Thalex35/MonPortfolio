import "../styles/projects.css";

export default function Projects() {
  const projects = [
    {
      title: "TaskMate",
      meta: "PROJECT_01 - GROUP PROJECT - 2025",
      description: "A homework and deadline manager for university students. Built with my team during the Web Design Bootcamp.",
      tech: ["React.js", "localStorage", "Supabase"],
      featured: true,
      links: [{ label: "github", url: "https://github.com/Thalex35/Taskmate-app" }, { label: "demo", url: "https://taskmate-app.vercel.app/login" }],
    },
    {
      title: "Manage Movies",
      meta: "PROJECT_02 - PERSONAL PROJECT - 2026",
      description: "A polished anime and movie watchlist dashboard for tracking titles, genres, episodes, and viewing status. Includes filters, editing, deletion confirmation, image upload, and local persistence.",
      tech: ["React.js", "useState", "localStorage", "CSS"],
      featured: true,
      links: [{ label: "github", url: "https://github.com/Thalex35/Manage-Movies" }, { label: "demo", url: "https://manage-movies.vercel.app/" }],
    },
  ];

  return <section className="projects"><p className="projects_kicker">PROJECTS</p><h1>Things I've built.</h1><p className="projects_intro">Real projects - each one representing a lesson learned and a skill gained.</p><div className="projects_list">{projects.map((project) => <article className="project_card" key={project.title}><div className="project_main"><p className="project_meta">{project.meta}</p><h2>{project.title}</h2><p className="project_desc">{project.description}</p><div className="project_tech">{project.tech.map((tag) => <span key={tag}>{tag}</span>)}</div></div><div className="project_side">{project.featured && <p className="project_badge">featured</p>}<div className="project_links">{project.links.map((link) => <a key={link.label} target="_blank" rel="noreferrer" href={link.url}>{link.label}</a>)}</div></div></article>)}</div></section>;
}
