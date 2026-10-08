import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, PortfolioProvider } from "./context/PortfolioContext";
import Home from "./pages/Home";
import Layout from "./components/layout/Layout";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminContact from "./pages/admin/AdminContact";
import AdminAccount from "./pages/admin/AdminAccount";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PortfolioProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route
              path="/about"
              element={
                <Layout>
                  <About />
                </Layout>
              }
            />
            <Route
              path="/projects"
              element={
                <Layout>
                  <Projects />
                </Layout>
              }
            />
            <Route
              path="/skills"
              element={
                <Layout>
                  <Skills />
                </Layout>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="about" element={<AdminAbout />} />
              <Route path="contact" element={<AdminContact />} />
              <Route path="account" element={<AdminAccount />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Routes>
        </PortfolioProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
