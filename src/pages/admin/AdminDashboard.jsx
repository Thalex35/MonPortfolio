import { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePortfolio } from "../../hooks/usePortfolio";

export default function AdminDashboard() {
  const { projects, refresh } = usePortfolio();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const featured = projects.filter((project) => project.featured).length;
  const published = projects.filter((project) => project.status !== "draft").length;
  const lastUpdated = projects
    .map((project) => project.updated_at)
    .filter(Boolean)
    .sort()
    .at(-1);

  return (
    <section className="admin_page">
      <p className="admin_kicker">OVERVIEW</p>
      <h1>Dashboard</h1>
      <p className="admin_page_intro">Manage the content shown across your public portfolio.</p>

      <div className="admin_stat_grid">
        <article className="admin_stat_card"><span>Total projects</span><strong>{projects.length}</strong></article>
        <article className="admin_stat_card"><span>Featured projects</span><strong>{featured}</strong></article>
        <article className="admin_stat_card"><span>Public projects</span><strong>{published}</strong></article>
        <article className="admin_stat_card">
          <span>Last project update</span>
          <strong className="admin_stat_date">
            {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : "—"}
          </strong>
        </article>
      </div>

      <div className="admin_quick_links">
        <Link to="/admin/projects">Manage projects <span aria-hidden="true">→</span></Link>
        <Link to="/admin/about">Edit About section <span aria-hidden="true">→</span></Link>
        <Link to="/admin/contact">Update contact links <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
