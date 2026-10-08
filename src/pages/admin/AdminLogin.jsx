import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { supabase, supabaseConfigured } from "../../lib/supabase";
import "../../styles/admin.css";

export default function AdminLogin() {
  const { isAdmin, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAdmin) navigate("/admin", { replace: true });
  }, [isAdmin, isLoading, navigate]);

  if (isAdmin) return <Navigate to="/admin" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setIsSubmitting(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("admin_profiles")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();
    if (profileError || !profile) {
      await supabase.auth.signOut();
      setError(
        profileError
          ? `Could not verify admin access: ${profileError.message}`
          : "This account is not authorized to manage the portfolio.",
      );
      setIsSubmitting(false);
      return;
    }

    navigate("/admin", { replace: true });
  }

  return (
    <main className="admin_login_page">
      <section className="admin_login_card" aria-labelledby="admin-login-title">
        <Link className="admin_brand" to="/">
          Theed<span>.dev</span><small>ADMIN</small>
        </Link>
        <p className="admin_kicker">PRIVATE WORKSPACE</p>
        <h1 id="admin-login-title">Admin sign in</h1>
        <p className="admin_login_intro">Sign in with the administrator account provisioned for this portfolio.</p>
        {!supabaseConfigured ? (
          <p className="admin_notice is_error" role="alert">
            Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, then apply the included database migration.
          </p>
        ) : null}
        <form className="admin_form" onSubmit={handleSubmit}>
          <label htmlFor="admin-email">EMAIL</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={!supabaseConfigured || isSubmitting}
          />
          <label htmlFor="admin-password">PASSWORD</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={!supabaseConfigured || isSubmitting}
          />
          {error ? <p className="admin_notice is_error" role="alert">{error}</p> : null}
          <button className="admin_primary_button" type="submit" disabled={!supabaseConfigured || isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <Link className="admin_back_link" to="/">Back to portfolio</Link>
      </section>
    </main>
  );
}
