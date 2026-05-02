import Navbar from "./Navbar";
import Footer from "./Footer";
import Hero from "../sections/Hero";

export default function Layout({ children, btnGIT = true }) {
  return (
    <div>
      <Navbar />
      <div>
        <Hero btnGIT={btnGIT} />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
