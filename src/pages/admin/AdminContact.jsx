import { useEffect, useState } from "react";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { usePortfolio } from "../../hooks/usePortfolio";
import { validateContactLink } from "../../lib/admin";
import { supabase } from "../../lib/supabase";

export default function AdminContact() {
  const { contactLinks, refresh } = usePortfolio();
  const { user } = useAdminAuth();
  const [links, setLinks] = useState(contactLinks);
  const [newLink, setNewLink] = useState({ label: "", value: "", kind: "url", enabled: true, sort_order: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let active = true;
    supabase
      .from("contact_links")
      .select("*")
      .order("sort_order")
      .then(({ data, error: loadError }) => {
        if (!active) return;
        if (loadError) setError(`Could not load contact links: ${loadError.message}`);
        else setLinks(data || []);
        setIsLoading(false);
      })
      .catch((loadError) => {
        if (!active) return;
        setError(`Could not load contact links: ${loadError.message}`);
        setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  function updateLink(id, field, value) {
    setLinks((current) => current.map((link) => link.id === id ? { ...link, [field]: value } : link));
  }

  async function saveLink(link) {
    const validationError = validateContactLink(link);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setMessage("");
    setBusyId(link.id || "new");
    const payload = {
      label: link.label.trim(),
      value: link.value.trim(),
      kind: link.kind,
      enabled: link.enabled,
      sort_order: Number(link.sort_order) || 0,
      updated_by: user.id,
    };
    const result = link.id
      ? await supabase.from("contact_links").update(payload).eq("id", link.id).select("*").single()
      : await supabase.from("contact_links").insert(payload).select("*").single();
    setBusyId("");
    if (result.error) {
      setError(`Could not save contact link: ${result.error.message}`);
      return;
    }
    setLinks((current) => link.id
      ? current.map((currentLink) => currentLink.id === link.id ? result.data : currentLink)
      : [...current, result.data]);
    setMessage("Contact link saved.");
    setIsAdding(false);
    await refresh();
  }

  async function deleteLink(link) {
    if (!window.confirm(`Delete the ${link.label} contact link?`)) return;
    const { error: deleteError } = await supabase.from("contact_links").delete().eq("id", link.id);
    if (deleteError) {
      setError(`Could not delete link: ${deleteError.message}`);
      return;
    }
    setLinks((current) => current.filter((currentLink) => currentLink.id !== link.id));
    setMessage("Contact link deleted.");
    await refresh();
  }

  return (
    <section className="admin_page">
      <div className="admin_page_heading">
        <div><p className="admin_kicker">CONTENT</p><h1>Contact / Social Links</h1><p className="admin_page_intro">These links appear on the public Contact page and footer.</p></div>
        {!isAdding ? <button className="admin_primary_button" type="button" onClick={() => { setError(""); setIsAdding(true); }}>+ Add link</button> : null}
      </div>
      {message ? <p className="admin_notice is_success" role="status">{message}</p> : null}
      {error ? <p className="admin_notice is_error" role="alert">{error}</p> : null}
      {isLoading ? <p className="admin_loading_inline">Loading contact links…</p> : null}
      <div className="admin_contact_list">
        {links.map((link) => (
          <article className={`admin_contact_row${link.enabled ? "" : " is_disabled"}`} key={link.id}>
            <div className="admin_form_grid">
              <label>Label<input value={link.label} onChange={(event) => updateLink(link.id, "label", event.target.value)} maxLength={60} /></label>
              <label>Type<select value={link.kind} onChange={(event) => updateLink(link.id, "kind", event.target.value)}><option value="url">Website / social URL</option><option value="email">Email</option></select></label>
              <label className="admin_span_all">{link.kind === "email" ? "Email address" : "URL"}
                <input type={link.kind === "email" ? "email" : "url"} value={link.value} onChange={(event) => updateLink(link.id, "value", event.target.value)} placeholder={link.kind === "email" ? "name@example.com" : "https://…"} />
              </label>
              <label>Display order<input type="number" value={link.sort_order} onChange={(event) => updateLink(link.id, "sort_order", event.target.value)} /></label>
              <label className="admin_check_label"><input type="checkbox" checked={link.enabled} onChange={(event) => updateLink(link.id, "enabled", event.target.checked)} /> Show publicly</label>
            </div>
            <div className="admin_form_actions">
              <button className="admin_secondary_button is_danger" type="button" onClick={() => deleteLink(link)}>Delete</button>
              <button className="admin_primary_button" type="button" disabled={busyId === link.id} onClick={() => saveLink(link)}>{busyId === link.id ? "Saving…" : "Save link"}</button>
            </div>
          </article>
        ))}
        {!links.length && !isLoading ? <p className="admin_empty_state">No contact links are set up yet.</p> : null}
      </div>
      {isAdding ? (
        <form className="admin_form admin_new_link" onSubmit={(event) => { event.preventDefault(); saveLink(newLink); }}>
          <h2>Add contact link</h2>
          <div className="admin_form_grid">
            <label>Label<input value={newLink.label} onChange={(event) => setNewLink({ ...newLink, label: event.target.value })} maxLength={60} required /></label>
            <label>Type<select value={newLink.kind} onChange={(event) => setNewLink({ ...newLink, kind: event.target.value })}><option value="url">Website / social URL</option><option value="email">Email</option></select></label>
            <label className="admin_span_all">{newLink.kind === "email" ? "Email address" : "URL"}
              <input type={newLink.kind === "email" ? "email" : "url"} value={newLink.value} onChange={(event) => setNewLink({ ...newLink, value: event.target.value })} required />
            </label>
          </div>
          <div className="admin_form_actions">
            <button type="button" className="admin_secondary_button" onClick={() => setIsAdding(false)}>Cancel</button>
            <button className="admin_primary_button" type="submit" disabled={busyId === "new"}>{busyId === "new" ? "Saving…" : "Add link"}</button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
