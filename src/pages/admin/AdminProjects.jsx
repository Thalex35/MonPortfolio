import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { usePortfolio } from "../../hooks/usePortfolio";
import { uploadPortfolioImage, validateProject } from "../../lib/admin";
import { supabase } from "../../lib/supabase";

const emptyProject = {
  title: "",
  category: "",
  description: "",
  full_description: "",
  technologies: [],
  github_url: "",
  live_demo_url: "",
  image_url: "",
  status: "published",
  status_label: "",
  featured: false,
  sort_order: 0,
};

function ProjectEditor({ project, defaultOrder, onCancel, onSaved }) {
  const [form, setForm] = useState(() => project ? { ...project } : { ...emptyProject, sort_order: defaultOrder });
  const [technologyInput, setTechnologyInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAdminAuth();

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function addTechnologies(value) {
    const additions = value.split(",").map((item) => item.trim()).filter(Boolean);
    if (additions.length) {
      setForm((current) => ({
        ...current,
        technologies: [...new Set([...current.technologies, ...additions])],
      }));
    }
    setTechnologyInput("");
  }

  async function handleImage(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setIsUploading(true);
    try {
      setField("image_url", await uploadPortfolioImage(file, "projects"));
    } catch (uploadError) {
      setError(`Image upload failed: ${uploadError.message}`);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateProject(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSaving(true);
    const payload = {
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      full_description: form.full_description.trim(),
      technologies: form.technologies,
      github_url: form.github_url.trim(),
      live_demo_url: form.live_demo_url.trim(),
      image_url: form.image_url.trim(),
      status: form.status,
      status_label: form.status_label.trim(),
      featured: form.featured,
      sort_order: Number(form.sort_order) || 0,
      updated_by: user.id,
    };
    const result = project?.id
      ? await supabase.from("projects").update(payload).eq("id", project.id)
      : await supabase.from("projects").insert(payload);

    setIsSaving(false);
    if (result.error) {
      setError(`Could not save project: ${result.error.message}`);
      return;
    }
    onSaved(project ? "Project updated." : "Project added.");
  }

  return (
    <form className="admin_form admin_project_form" onSubmit={handleSubmit}>
      <div className="admin_form_heading">
        <div><p className="admin_kicker">PROJECT EDITOR</p><h2>{project ? "Edit project" : "Add project"}</h2></div>
      </div>
      <div className="admin_form_grid">
        <label>Project title<input value={form.title} onChange={(event) => setField("title", event.target.value)} maxLength={120} required /></label>
        <label>Category<input value={form.category} onChange={(event) => setField("category", event.target.value)} maxLength={120} required /></label>
        <label className="admin_span_all">Short description<textarea value={form.description} onChange={(event) => setField("description", event.target.value)} maxLength={600} rows={3} required /></label>
        <label className="admin_span_all">Full description (optional)<textarea value={form.full_description || ""} onChange={(event) => setField("full_description", event.target.value)} rows={4} /></label>
        <fieldset className="admin_technologies admin_span_all">
          <legend>Technologies / skills</legend>
          <div className="admin_tag_list">
            {form.technologies.map((technology) => (
              <span className="admin_tag" key={technology}>
                {technology}
                <button type="button" aria-label={`Remove ${technology}`} onClick={() => setField("technologies", form.technologies.filter((item) => item !== technology))}>×</button>
              </span>
            ))}
          </div>
          <div className="admin_inline_input">
            <input value={technologyInput} onChange={(event) => setTechnologyInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === ",") { event.preventDefault(); addTechnologies(technologyInput); } }} placeholder="Type a technology and press Enter" />
            <button type="button" className="admin_secondary_button" onClick={() => addTechnologies(technologyInput)}>Add</button>
          </div>
        </fieldset>
        <label>GitHub URL<input type="url" value={form.github_url || ""} onChange={(event) => setField("github_url", event.target.value)} placeholder="https://github.com/…" /></label>
        <label>Live demo URL<input type="url" value={form.live_demo_url || ""} onChange={(event) => setField("live_demo_url", event.target.value)} placeholder="https://…" /></label>
        <label>Status
          <select value={form.status} onChange={(event) => setField("status", event.target.value)}>
            <option value="published">Published</option><option value="in_progress">In progress</option><option value="draft">Draft</option>
          </select>
        </label>
        <label>Status label (optional)<input value={form.status_label || ""} onChange={(event) => setField("status_label", event.target.value)} placeholder="e.g. Current project · active development" maxLength={120} /></label>
        <label>Display order<input type="number" value={form.sort_order} onChange={(event) => setField("sort_order", event.target.value)} step="1" /></label>
        <label className="admin_check_label"><input type="checkbox" checked={Boolean(form.featured)} onChange={(event) => setField("featured", event.target.checked)} /> Featured project</label>
        <div className="admin_upload_field admin_span_all">
          <span>Project image / thumbnail</span>
          <div className="admin_upload_preview">
            {form.image_url ? <img src={form.image_url} alt="Project image preview" /> : <p>No project image selected</p>}
          </div>
          <label className="admin_secondary_button admin_file_button">
            {isUploading ? "Uploading…" : "Upload image"}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleImage} disabled={isUploading} />
          </label>
          {form.image_url ? <button type="button" className="admin_text_button" onClick={() => setField("image_url", "")}>Remove image</button> : null}
          <small>JPG, PNG, WebP, or AVIF · maximum 5 MB</small>
        </div>
      </div>
      {error ? <p className="admin_notice is_error" role="alert">{error}</p> : null}
      <div className="admin_form_actions">
        <button type="button" className="admin_secondary_button" onClick={onCancel}>Cancel</button>
        <button type="submit" className="admin_primary_button" disabled={isSaving || isUploading}>{isSaving ? "Saving…" : "Save project"}</button>
      </div>
    </form>
  );
}

export default function AdminProjects() {
  const { refresh } = usePortfolio();
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const sorted = useMemo(() => [...projects].sort((a, b) => a.sort_order - b.sort_order), [projects]);

  async function loadProjects() {
    setIsLoading(true);
    const { data, error: loadError } = await supabase.from("projects").select("*").order("sort_order");
    setIsLoading(false);
    if (loadError) {
      setError(`Could not load projects: ${loadError.message}`);
      return;
    }
    setError("");
    setProjects(data || []);
  }

  useEffect(() => {
    let active = true;
    supabase
      .from("projects")
      .select("*")
      .order("sort_order")
      .then(({ data, error: loadError }) => {
        if (!active) return;
        setIsLoading(false);
        if (loadError) {
          setError(`Could not load projects: ${loadError.message}`);
          return;
        }
        setError("");
        setProjects(data || []);
      });
    return () => { active = false; };
  }, []);

  async function saved(text) {
    setIsCreating(false);
    setEditing(null);
    setMessage(text);
    await Promise.all([loadProjects(), refresh()]);
  }

  async function deleteProject(project) {
    if (!window.confirm(`Delete “${project.title}”? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase.from("projects").delete().eq("id", project.id);
    if (deleteError) {
      setError(`Could not delete project: ${deleteError.message}`);
      return;
    }
    setMessage("Project deleted.");
    await Promise.all([loadProjects(), refresh()]);
  }

  async function moveProject(index, direction) {
    const otherIndex = index + direction;
    if (otherIndex < 0 || otherIndex >= sorted.length) return;
    const current = sorted[index];
    const other = sorted[otherIndex];
    const [first, second] = await Promise.all([
      supabase.from("projects").update({ sort_order: other.sort_order }).eq("id", current.id),
      supabase.from("projects").update({ sort_order: current.sort_order }).eq("id", other.id),
    ]);
    if (first.error || second.error) {
      setError(`Could not reorder projects: ${first.error?.message || second.error?.message}`);
      return;
    }
    setMessage("Project order updated.");
    await Promise.all([loadProjects(), refresh()]);
  }

  return (
    <section className="admin_page">
      <div className="admin_page_heading">
        <div><p className="admin_kicker">CONTENT</p><h1>Projects</h1><p className="admin_page_intro">Manage public project cards, status, links, and display order.</p></div>
        {!isCreating && !editing ? <button className="admin_primary_button" type="button" onClick={() => { setMessage(""); setIsCreating(true); }}>+ Add project</button> : null}
      </div>
      {message ? <p className="admin_notice is_success" role="status">{message}</p> : null}
      {error ? <p className="admin_notice is_error" role="alert">{error}</p> : null}
      {isCreating || editing ? <ProjectEditor key={editing?.id || "new"} project={editing} defaultOrder={sorted.length ? Math.max(...sorted.map((project) => project.sort_order)) + 1 : 0} onCancel={() => { setEditing(null); setIsCreating(false); }} onSaved={saved} /> : null}
      {isLoading ? <p className="admin_loading_inline">Loading projects…</p> : (
        <div className="admin_project_list">
          {sorted.map((project, index) => (
            <article className="admin_project_row" key={project.id}>
              {project.image_url ? <img className="admin_project_thumb" src={project.image_url} alt="" /> : <div className="admin_project_thumb is_empty" aria-hidden="true">IMG</div>}
              <div className="admin_project_details">
                <div className="admin_project_title_line"><h2>{project.title}</h2><span className={`admin_status status_${project.status}`}>{project.status.replace("_", " ")}</span>{project.featured ? <span className="admin_status status_featured">featured</span> : null}</div>
                <p>{project.category} · {project.description}</p>
                <ul className="admin_project_tech">{(project.technologies || []).map((technology) => <li key={technology}>{technology}</li>)}</ul>
              </div>
              <div className="admin_project_actions">
                <button type="button" className="admin_secondary_button" onClick={() => { setMessage(""); setEditing(project); setIsCreating(false); }}>Edit</button>
                <button type="button" className="admin_secondary_button is_danger" onClick={() => deleteProject(project)}>Delete</button>
                <div className="admin_reorder_buttons">
                  <button type="button" aria-label={`Move ${project.title} up`} disabled={index === 0} onClick={() => moveProject(index, -1)}>↑</button>
                  <button type="button" aria-label={`Move ${project.title} down`} disabled={index === sorted.length - 1} onClick={() => moveProject(index, 1)}>↓</button>
                </div>
              </div>
            </article>
          ))}
          {!sorted.length && !isLoading ? <p className="admin_empty_state">No projects yet. Add your first project above.</p> : null}
        </div>
      )}
    </section>
  );
}
