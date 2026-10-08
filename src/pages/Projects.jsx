import { usePortfolio } from "../hooks/usePortfolio";
import { projectToCard } from "../lib/portfolio";
import "../styles/projects.css";

function ProjectCard({ project }) {
  return (
    <article
      className={`project_card${project.primary ? " is_primary" : ""}`}
      aria-label={`${project.name} project`}
    >
      <div className="project_main">
        {project.image_url ? (
          <img className="project_image" src={project.image_url} alt="" loading="lazy" />
        ) : null}
        <p className="project_type">{project.type}</p>
        <h3>{project.name}</h3>
        {project.status ? (
          <p className="project_status">{project.status}</p>
        ) : null}
        <p className="project_desc">{project.description}</p>
        <ul className="project_tech" aria-label="Technologies used">
          {project.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      </div>
      <div className="project_links">
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} source code on GitHub`}
          >
            GitHub
          </a>
        ) : null}
        {project.demo ? (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} live demo`}
          >
            Live demo
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function Projects() {
  const { projects, error, isLoading } = usePortfolio();
  const visibleProjects = projects
    .filter((project) => project.status !== "draft")
    .sort((left, right) => left.sort_order - right.sort_order);
  const featuredProjects = visibleProjects
    .filter((project) => project.featured)
    .map((project, index) => ({ ...projectToCard(project), primary: index === 0 }));
  const additionalProjects = visibleProjects
    .filter((project) => !project.featured)
    .map(projectToCard);

  return (
    <section className="projects" aria-labelledby="projects-title">
      <p className="projects_kicker">SELECTED WORK</p>
      <h1 id="projects-title">Projects</h1>
      <p className="projects_intro">
        A selection of web applications and websites I&apos;ve worked on, with
        each project&apos;s scope and status described as it is.
      </p>
      {error ? <p className="portfolio_content_notice" role="status">{error} Showing saved portfolio content.</p> : null}
      {isLoading ? <p className="portfolio_content_notice" role="status">Loading projects…</p> : null}

      {featuredProjects.length ? (
        <section className="project_section" aria-labelledby="featured-title">
          <div className="project_section_heading">
            <p className="projects_kicker">01 / FEATURED</p>
            <h2 id="featured-title">Featured projects</h2>
          </div>
          <div className="projects_featured">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id || project.name} project={project} />
            ))}
          </div>
        </section>
      ) : null}

      {additionalProjects.length ? (
        <section className="project_section" aria-labelledby="additional-title">
          <div className="project_section_heading">
            <p className="projects_kicker">02 / MORE WORK</p>
            <h2 id="additional-title">Additional projects</h2>
          </div>
          <div className="projects_additional">
            {additionalProjects.map((project) => (
              <ProjectCard key={project.id || project.name} project={project} />
            ))}
          </div>
        </section>
      ) : null}
      {!visibleProjects.length && !isLoading ? <p className="portfolio_content_notice">Projects will appear here soon.</p> : null}
    </section>
  );
}
