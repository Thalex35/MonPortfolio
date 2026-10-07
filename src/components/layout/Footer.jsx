import "../../styles/footer.css";

export default function Footer() {
  return (
    <footer className="site_footer">
      <p className="site_footer_brand">Theed<span>.dev</span></p>
      <p className="site_footer_copy">
        Theodore Louisjuste · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
