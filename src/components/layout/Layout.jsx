import Navbar from "./Navbar";
import Footer from "./Footer";
import Hero from "../sections/Hero";

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div>
        <Hero />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
