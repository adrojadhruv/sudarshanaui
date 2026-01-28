import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import api from "../services/api";
import ComponentCard from "../components/ComponentCard";
import { useTheme } from '../context/ThemeContext';

import Loader from "../components/Loader";

import WelcomeIntro from "../components/WelcomeIntro";
import RotatingIcon from "../components/RotatingIcon";

export default function Components({ user }) {
  const navigate = useNavigate();
  const { colors, mode } = useTheme();

  // Data State
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // UI State
  const [isCreating, setIsCreating] = useState(false);
  const [newComp, setNewComp] = useState({ name: "", category: "General", definition: {} });
  const [searchTerm, setSearchTerm] = useState("");

  // Refs
  const loaderRef = useRef(null);

  // Fetch Components
  const fetchComponents = async (pageNum, isReset = false) => {
    if (isReset) {
      if (components.length === 0) {
        setLoading(true);
      } else {
        setIsSearching(true);
      }
    } else {
      setLoadingMore(true);
    }

    try {
      const endpoint = user ? "/components" : "/public";
      const params = {
        page: pageNum,
        limit: ITEMS_PER_PAGE,
        search: searchTerm
      };

      const res = await api.get(endpoint, { params });
      const newData = res.data.components || [];

      if (isReset) {
        setComponents(newData);
        setPage(1);
        setHasMore(newData.length === ITEMS_PER_PAGE);
      } else {
        setComponents(prev => [...prev, ...newData]);
        setPage(pageNum);
        if (newData.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching components:", error);
    } finally {
      setLoading(false);
      setIsSearching(false);
      setLoadingMore(false);
    }
  };

  // Initial Load & Search Debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchComponents(1, true);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, user]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading && !loadingMore && !isSearching) {
        fetchComponents(page + 1, false);
      }
    }, {
      root: null,
      rootMargin: "200px",
      threshold: 0
    });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, isSearching, page, searchTerm]);

  // Actions
  const refreshList = () => fetchComponents(1, true);

  const handleSubmit = async (component) => {
    if (!window.confirm(`Submit "${component.name}" for approval?`)) return;
    try {
      await api.post(`/components/${component._id}/submit`);
      refreshList();
    } catch (err) {
      alert("Failed to submit: " + (err.response?.data?.message || err.message));
    }
  };

  const handleApprove = async (component) => {
    if (!window.confirm(`Approve "${component.name}"?`)) return;
    try {
      await api.post(`/components/${component._id}/approve`);
      refreshList();
    } catch (err) {
      alert("Failed to approve: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/components", newComp);
      setIsCreating(false);
      setNewComp({ name: "", category: "General", definition: {} });
      refreshList();
    } catch (err) {
      alert("Failed to create: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ padding: "20px 0", width: "100%", color: colors.text, position: "relative", minHeight: "80vh" }}>
      <WelcomeIntro />
      {loading && <Loader fullScreen={false} />}
      <div style={{ transition: "filter 0.3s" }}> {/* Blur Effect REMOVED for smooth search */}

        {/* COMPONENT CREATE & LIST SECTION */}
        <div style={{ padding: "0 20px" }}>

          {/* HERO SECTION - Clickable for Verified Users (Hidden for Admin) */}
          {(!user || user.role !== 'admin') && (
            <div
              onClick={() => {
                if (user && user.role === 'verifieduser' && !isCreating) {
                  setIsCreating(true);
                }
              }}
              style={{
                position: "relative",
                width: "100%",
                height: "300px",
                marginBottom: "40px",
                borderRadius: "20px",
                overflow: "hidden",
                backgroundImage: `url(${user && user.role === 'verifieduser'
                  ? (mode === 'dark' ? '/darkhero1.png' : '/lighthero1.png')
                  : (mode === 'dark' ? '/darkherofornormal.png' : '/lightherofornormal.png')
                  })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: mode === 'dark' ? "0 10px 40px rgba(0,0,0,0.6)" : "0 10px 30px rgba(0,0,0,0.15)",
                border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                cursor: (user && user.role === 'verifieduser' && !isCreating) ? "pointer" : "default",
                transition: "transform 0.3s ease, box-shadow 0.3s ease"
              }}
              onMouseEnter={(e) => {
                if (user && user.role === 'verifieduser' && !isCreating) {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = mode === 'dark' ? "0 15px 50px rgba(0,0,0,0.7)" : "0 15px 40px rgba(0,0,0,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = mode === 'dark' ? "0 10px 40px rgba(0,0,0,0.6)" : "0 10px 30px rgba(0,0,0,0.15)";
              }}
            >
              {/* No Inner Button - Whole Section is Trigger */}
            </div>
          )}

          {isCreating && (
            <div style={{
              marginBottom: "30px", padding: "20px", border: "1px solid #ccc",
              borderRadius: "12px", backgroundColor: "rgba(0,0,0,0.02)"
            }}>
              <h3>Create New Component</h3>
              <form onSubmit={handleCreate} style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Component Name"
                  value={newComp.name}
                  onChange={e => setNewComp({ ...newComp, name: e.target.value })}
                  required
                  style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", minWidth: "200px" }}
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Buttons)"
                  value={newComp.category}
                  onChange={e => setNewComp({ ...newComp, category: e.target.value })}
                  required
                  style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", minWidth: "150px" }}
                />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Create</button>
                  <button type="button" onClick={() => setIsCreating(false)} style={{ padding: "10px 20px", backgroundColor: "#666", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "2rem" }}>{user ? "Component Library" : "Explore Components"}</h2>

            <div style={{ display: "flex", gap: "10px", flex: 1, justifyContent: "flex-end", minWidth: "300px" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
                <input
                  type="text"
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: "10px 15px", borderRadius: "20px", border: "1px solid #ccc",
                    width: "100%", fontSize: "1rem", paddingRight: "40px"
                  }}
                />
                {isSearching && (
                  <div style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    width: "16px", height: "16px", borderRadius: "50%",
                    border: "2px solid #ccc", borderTopColor: "#000",
                    animation: "spin 1s linear infinite"
                  }}></div>
                )}
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>

              {user && (
                user.role === 'admin' ? (
                  <button
                    onClick={() => navigate('/admin/users')}
                    style={{
                      backgroundColor: "#ef4444", color: "white", border: "none",
                      padding: "10px 20px", fontWeight: "bold", borderRadius: "8px", cursor: "pointer"
                    }}
                  >
                    Manage Users
                  </button>
                ) : (
                  (user.role === 'verifieduser' && !isCreating) && null
                )
              )}
            </div>
          </div>



          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", // Responsive Grid (280px)
            gap: "40px",
            perspective: "1000px"
          }}>
            {components.length > 0 ? (
              components.map((c, i) => (
                <ComponentCard
                  key={c._id}
                  component={c}
                  user={user}
                  navigate={navigate}
                  onApprove={handleApprove}
                  onSubmit={handleSubmit}
                />
              ))
            ) : (
              !loading && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: colors.text, opacity: 0.5 }}>
                  <h3>No components found</h3>
                  <p>Try creating one or searching for something else.</p>
                </div>
              )
            )}
          </div>

          {/* INFINITE SCROLL TRIGGER */}
          <div ref={loaderRef} style={{ height: "80px", marginTop: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {loadingMore && <RotatingIcon size={60} />}
            {!hasMore && components.length > 0 && null}
          </div>

        </div>
      </div>
    </div>
  );
}
