import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/about", label: "About" },
  { to: "/admin/contact", label: "Contact / Social Links" },
  { to: "/admin/account", label: "Settings / Account" },
];

export default function AdminLayout() {
  const [error, setError] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    setError("");
    setIsSigningOut(true);
    const { error: signOutError } = await supabase.auth.signOut();
    setIsSigningOut(false);
    if (signOutError) {
      setError(`Could not sign out: ${signOutError.message}`);
      return;
    }
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin_shell">
      <aside className="admin_sidebar">
        <Link className="admin_brand" to="/admin" aria-label="Theed.dev admin dashboard">
          Theed<span>.dev</span><small>ADMIN</small>
        </Link>
        <nav className="admin_navigation" aria-label="Admin">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `admin_nav_link${isActive ? " is_active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="admin_logout" type="button" onClick={handleLogout} disabled={isSigningOut}>
          {isSigningOut ? "Signing out…" : "Log out"}
        </button>
      </aside>
      <main className="admin_main">
        {error ? <p className="admin_notice is_error" role="alert">{error}</p> : null}
        <Outlet />
      </main>
    </div>
  );
}
