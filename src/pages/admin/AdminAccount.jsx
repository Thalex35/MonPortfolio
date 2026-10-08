import { useState } from "react";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { supabase } from "../../lib/supabase";

export default function AdminAccount() {
  const { user } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (password.length < 12) {
      setError("Use a password with at least 12 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setIsSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsSaving(false);
    if (updateError) {
      setError(`Could not update password: ${updateError.message}`);
      return;
    }
    setPassword("");
    setConfirmation("");
    setMessage("Password updated.");
  }

  return (
    <section className="admin_page">
      <p className="admin_kicker">ACCOUNT</p>
      <h1>Settings / Account</h1>
      <p className="admin_page_intro">Manage your authenticated portfolio administrator account.</p>
      <article className="admin_contact_row admin_account_card">
        <p><span>Signed in as</span><strong>{user.email}</strong></p>
        <p><span>Last sign in</span><strong>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Current session"}</strong></p>
      </article>
      <form className="admin_form admin_account_form" onSubmit={handleSubmit}>
        <h2>Change password</h2>
        <label>New password<input type="password" autoComplete="new-password" minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <label>Confirm new password<input type="password" autoComplete="new-password" minLength={12} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required /></label>
        {error ? <p className="admin_notice is_error" role="alert">{error}</p> : null}
        {message ? <p className="admin_notice is_success" role="status">{message}</p> : null}
        <div className="admin_form_actions"><button className="admin_primary_button" disabled={isSaving}>{isSaving ? "Updating…" : "Update password"}</button></div>
      </form>
    </section>
  );
}
