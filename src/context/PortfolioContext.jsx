import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fallbackAbout, fallbackContactLinks, fallbackProjects } from "../lib/portfolio";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { AuthContext, PortfolioContext } from "./contexts";

export function PortfolioProvider({ children }) {
  const [content, setContent] = useState({
    projects: fallbackProjects,
    about: fallbackAbout,
    contactLinks: fallbackContactLinks,
    error: "",
    isLoading: supabaseConfigured,
  });

  const refresh = useCallback(async () => {
    if (!supabaseConfigured) return;

    let projectsResult;
    let aboutResult;
    let linksResult;
    try {
      [projectsResult, aboutResult, linksResult] = await Promise.all([
        supabase.from("projects").select("*").order("sort_order"),
        supabase.from("site_content").select("content").eq("id", "about").maybeSingle(),
        supabase.from("contact_links").select("*").order("sort_order"),
      ]);
    } catch (loadError) {
      console.error("Portfolio content load failed:", loadError);
      setContent((current) => ({
        ...current,
        error: "Saved portfolio content could not be loaded.",
        isLoading: false,
      }));
      return;
    }
    const errors = [
      projectsResult.error,
      aboutResult.error,
      linksResult.error,
    ].filter(Boolean);

    if (errors.length) {
      errors.forEach((error) => console.error("Portfolio content load failed:", error));
      setContent((current) => ({
        ...current,
        error: "Some saved portfolio content could not be loaded.",
        isLoading: false,
      }));
      return;
    }

    setContent({
      projects: projectsResult.data.map((project) => ({
        ...project,
        technologies: project.technologies || [],
      })),
      about: aboutResult.data?.content || fallbackAbout,
      contactLinks: linksResult.data || [],
      error: "",
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) return;
    let active = true;
    const load = async () => {
      await Promise.resolve();
      if (active) await refresh();
    };
    void load();
    return () => {
      active = false;
    };
  }, [refresh]);

  const value = useMemo(
    () => ({ ...content, refresh }),
    [content, refresh],
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    session: null,
    user: null,
    isAdmin: false,
    isLoading: Boolean(supabaseConfigured),
    error: "",
  });

  const loadSession = useCallback(async (session) => {
    if (!session) {
      setAuth({ session: null, user: null, isAdmin: false, isLoading: false, error: "" });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("admin_profiles")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      setAuth({
        session,
        user: session.user,
        isAdmin: Boolean(data && !error),
        isLoading: false,
        error: error?.message || "",
      });
    } catch (loadError) {
      setAuth({
        session,
        user: session.user,
        isAdmin: false,
        isLoading: false,
        error: `Could not verify admin access: ${loadError.message}`,
      });
    }
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) return undefined;

    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setAuth({ session: null, user: null, isAdmin: false, isLoading: false, error: error.message });
        return;
      }
      loadSession(data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        window.setTimeout(() => {
          if (active) void loadSession(session);
        }, 0);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadSession]);

  const value = useMemo(() => ({ ...auth }), [auth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
