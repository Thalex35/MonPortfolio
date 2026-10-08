import "../../styles/footer.css";
import { usePortfolio } from "../../hooks/usePortfolio";
import { contactHref } from "../../lib/portfolio";

export default function Footer() {
  const { contactLinks } = usePortfolio();

  return (
    <footer className="site_footer">
      <p className="site_footer_brand">Theed<span>.dev</span></p>
      <nav className="site_footer_links" aria-label="Social and contact links">
        {contactLinks.filter((link) => link.enabled).map((link) => (
          <a
            href={contactHref(link)}
            key={link.id}
            target={link.kind === "url" ? "_blank" : undefined}
            rel={link.kind === "url" ? "noopener noreferrer" : undefined}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <p className="site_footer_copy">
        Theodore Louisjuste · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
