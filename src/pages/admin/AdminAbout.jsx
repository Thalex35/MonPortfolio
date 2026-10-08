import { useEffect, useState } from "react";
import me from "../../assets/me.jpeg";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { usePortfolio } from "../../hooks/usePortfolio";
import { uploadPortfolioImage } from "../../lib/admin";
import { supabase } from "../../lib/supabase";

export default function AdminAbout() {
  const { about, refresh } = usePortfolio();
  const { user } = useAdminAuth();
  const [form, setForm] = useState(about);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    supabase
      .from("site_content")
      .select("content")
      .eq("id", "about")
      .maybeSingle()
      .then(({ data, error: loadError }) => {
        if (!active) return;
        if (loadError) {
          setError(`Could not load About content: ${loadError.message}`);
        } else {
          const content = data?.content || about;
          setForm({
            ...content,
            paragraphsText: (content.paragraphs || []).join("\n"),
            interestsText: (content.interests || []).join("\n"),
          });
        }
        setIsLoading(false);
      });
    return () => { active = false; };
  }, [about]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateStat(index, field, value) {
    setForm((current) => ({
      ...current,
      stats: current.stats.map((stat, position) =>
        position === index ? { ...stat, [field]: value } : stat,
      ),
    }));
  }

  async function handleImage(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setIsUploading(true);
    try {
      update("image_url", await uploadPortfolioImage(file, "about"));
    } catch (uploadError) {
      setError(`Image upload failed: ${uploadError.message}`);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.headline.trim() || !form.profile_name.trim()) {
      setError("A heading and profile name are required.");
      return;
    }
    const content = {
      ...form,
      headline: form.headline.trim(),
      introduction: form.introduction.trim(),
      profile_name: form.profile_name.trim(),
      image_alt: form.image_alt.trim(),
      paragraphs: paragraphsText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
      interests: interestsText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
      stats: form.stats.map((stat) => ({ value: stat.value.trim(), label: stat.label.trim() })),
    };
    delete content.paragraphsText;
    delete content.interestsText;

    setIsSaving(true);
    setError("");
    setMessage("");
    const { error: saveError } = await supabase
      .from("site_content")
      .upsert({ id: "about", content, updated_by: user.id }, { onConflict: "id" });
    setIsSaving(false);
    if (saveError) {
      setError(`Could not save About content: ${saveError.message}`);
      return;
    }
    setMessage("About content saved.");
    await refresh();
  }

  const paragraphsText = form.paragraphsText ?? (form.paragraphs || []).join("\n");
  const interestsText = form.interestsText ?? (form.interests || []).join("\n");

  return (
    <section className="admin_page">
      <p className="admin_kicker">CONTENT</p>
      <h1>About</h1>
      <p className="admin_page_intro">Update your introduction, profile image, personal details, and interests.</p>
      {message ? <p className="admin_notice is_success" role="status">{message}</p> : null}
      {error ? <p className="admin_notice is_error" role="alert">{error}</p> : null}
      <form className="admin_form admin_content_form" onSubmit={handleSubmit}>
        <label>Page heading<input value={form.headline} onChange={(event) => update("headline", event.target.value)} maxLength={140} required /></label>
        <label>Short introduction<textarea value={form.introduction} onChange={(event) => update("introduction", event.target.value)} rows={2} maxLength={300} /></label>
        <label>Profile name<input value={form.profile_name} onChange={(event) => update("profile_name", event.target.value)} maxLength={120} required /></label>
        <label>Profile image alt text<input value={form.image_alt} onChange={(event) => update("image_alt", event.target.value)} maxLength={180} /></label>
        <label>About paragraphs <span className="admin_field_hint">One paragraph per line.</span>
          <textarea value={paragraphsText} onChange={(event) => update("paragraphsText", event.target.value)} rows={9} />
        </label>
        <fieldset className="admin_stats_editor">
          <legend>Profile stats</legend>
          {(form.stats || []).map((stat, index) => (
            <div className="admin_form_grid" key={`${index}-${stat.label}`}>
              <label>Value<input value={stat.value} onChange={(event) => updateStat(index, "value", event.target.value)} maxLength={30} /></label>
              <label>Label<input value={stat.label} onChange={(event) => updateStat(index, "label", event.target.value)} maxLength={60} /></label>
            </div>
          ))}
        </fieldset>
        <label>Interests &amp; hobbies <span className="admin_field_hint">One interest per line.</span>
          <textarea value={interestsText} onChange={(event) => update("interestsText", event.target.value)} rows={6} />
        </label>
        <div className="admin_upload_field">
          <span>About / profile image</span>
          <div className="admin_about_preview">
            {form.image_url ? <img src={form.image_url} alt="Uploaded profile image preview" /> : <img src={me} alt="Current profile image" />}
          </div>
          <label className="admin_secondary_button admin_file_button">
            {isUploading ? "Uploading…" : form.image_url ? "Replace image" : "Upload image"}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleImage} disabled={isUploading} />
          </label>
          {form.image_url ? <button type="button" className="admin_text_button" onClick={() => update("image_url", "")}>Use portfolio image</button> : null}
          <small>JPG, PNG, WebP, or AVIF · maximum 5 MB</small>
        </div>
        <div className="admin_form_actions">
          <button className="admin_primary_button" type="submit" disabled={isLoading || isSaving || isUploading}>{isLoading ? "Loading…" : isSaving ? "Saving…" : "Save About content"}</button>
        </div>
      </form>
    </section>
  );
}
