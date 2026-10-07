import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="site_shell">
      <a className="skip_link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" className="site_main">{children}</main>
      <Footer />
    </div>
  );
}
