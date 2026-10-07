import { additionalProjects, featuredProjects } from "../data/projects";
import "../styles/projects.css";

function ProjectCard({ project }) {
  return (
    <article
      className={`project_card${project.primary ? " is_primary" : ""}`}
      aria-label={`${project.name} project`}
    >
      <div className="project_main">
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
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.name} source code on GitHub`}
        >
          GitHub
        </a>
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
  return (
    <section className="projects" aria-labelledby="projects-title">
      <p className="projects_kicker">SELECTED WORK</p>
      <h1 id="projects-title">Projects</h1>
      <p className="projects_intro">
        A selection of web applications and websites I&apos;ve worked on, with
        each project&apos;s scope and status described as it is.
      </p>

      <section className="project_section" aria-labelledby="featured-title">
        <div className="project_section_heading">
          <p className="projects_kicker">01 / FEATURED</p>
          <h2 id="featured-title">Featured projects</h2>
        </div>
        <div className="projects_featured">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>

      <section className="project_section" aria-labelledby="additional-title">
        <div className="project_section_heading">
          <p className="projects_kicker">02 / MORE WORK</p>
          <h2 id="additional-title">Additional projects</h2>
        </div>
        <div className="projects_additional">
          {additionalProjects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>
    </section>
  );
}
