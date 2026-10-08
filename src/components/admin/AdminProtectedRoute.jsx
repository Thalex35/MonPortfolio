import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { supabaseConfigured } from "../../lib/supabase";

export default function AdminProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { isAdmin, isLoading, session } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && supabaseConfigured && !session) {
      navigate("/admin/login", { replace: true });
    } else if (!isLoading && session && !isAdmin) {
      navigate("/", { replace: true });
    }
  }, [isAdmin, isLoading, navigate, session]);

  if (!supabaseConfigured) {
    return (
      <main className="admin_setup">
        <h1>Admin setup required</h1>
        <p>Configure the Supabase URL and publishable/anon key, then apply the included migration.</p>
      </main>
    );
  }
  if (isLoading || !isAdmin) {
    return <main className="admin_loading" aria-live="polite">Checking admin access…</main>;
  }
  return children;
}
