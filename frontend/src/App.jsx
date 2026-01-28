import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Components from "./pages/Components";
import Editor from "./pages/editor";

import AdminUsers from "./pages/AdminUsers";
import api from "./services/api";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import Requests from "./pages/Requests";
import LandingPage from "./pages/LandingPage";
import Docs from "./pages/Docs";
import Boilerplate from "./pages/Boilerplate";
import NotFound from "./pages/NotFound";
import Loader from "./components/Loader";
import Footer from "./components/Footer";

import Profile from "./pages/Profile";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      // Create a promise that resolves after 500ms
      const minLoadTime = new Promise(resolve => setTimeout(resolve, 200));

      // Create the API promise, catching errors so it doesn't reject Promise.all
      const authRequest = api.get("/me").catch(() => null);

      try {
        // Wait for both the API request and the minimum load time
        const [res] = await Promise.all([authRequest, minLoadTime]);

        if (res && res.data && res.data.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Public Routes that don't need Navbar or Auth


  return (
    <div style={{ position: "relative", width: "100%", overflowX: "hidden" }}>
      {/* Global Loader Overlay */}
      {loading && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10000, pointerEvents: 'none' }}>
          <Loader fullScreen={true} />
        </div>
      )}

      {/* Main Content - Blurred when loading */}
      <div style={{
        filter: loading ? 'blur(8px)' : 'none',
        transition: 'filter 0.3s ease-out',
        pointerEvents: loading ? 'none' : 'auto',
        minHeight: '100vh'
      }}>
        {/* Navbar outside container for full width */}
        <Navbar user={user} setUser={setUser} />

        {/* Main content - Full width for Landing Page, Constrained for App */}
        <main style={
          (location.pathname === "/" && !user) || location.pathname.startsWith("/admin/users") || location.pathname === "/login" || location.pathname === "/signup"
            ? { width: "100%", margin: "0", padding: "0", overflowX: "hidden", minHeight: "100vh" }
            : { maxWidth: "1600px", width: "95%", margin: "0 auto", padding: "20px 0" }
        }>
          <Routes>
            <Route path="/login" element={<Login onLogin={(u) => { setUser(u); navigate("/"); }} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={user ? <Navigate to="/components" replace /> : <LandingPage />} />
            <Route path="/components" element={<Components user={user} />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/explore" element={<Explore user={user} />} />

            <Route path="/profile" element={(user || loading) ? <Profile user={user} /> : <Navigate to="/login" />} />
            <Route path="/requests" element={(user || loading) ? <Requests user={user} /> : <Navigate to="/login" />} />
            <Route path="/admin/users" element={(user && user.role === 'admin') || loading ? <AdminUsers user={user} /> : <Navigate to="/" />} />
            <Route path="/boilerplate" element={(user && user.role === 'admin') || loading ? <Boilerplate /> : <Navigate to="/" />} />
            <Route path="/editor/:id" element={<Editor user={user} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Conditional Footer (Hidden on Editor, Profile, Login, and Signup) */}
          {!location.pathname.startsWith('/editor') && !location.pathname.startsWith('/profile') && location.pathname !== '/login' && location.pathname !== '/signup' && <Footer user={user} />}
        </main>
      </div>
    </div>
  );
}
