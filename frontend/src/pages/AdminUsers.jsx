import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ComponentCard from "../components/ComponentCard";
import { useNavigate } from "react-router-dom";

export default function AdminUsers({ user }) {
    const { colors, mode } = useTheme();
    const isDark = mode === 'dark';
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const detailRef = useRef(null);

    // Main List State
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Detail View State
    const [selectedUser, setSelectedUser] = useState(null);
    const [userComponents, setUserComponents] = useState({ created: [], contributions: [], team: [] });
    const [detailLoading, setDetailLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("created");

    // Initial Fetch
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/users");
            const userList = res.data.users || res.data || [];
            if (Array.isArray(userList)) {
                setUsers(userList);
            } else {
                setUsers([]);
            }
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    // GSAP Animation for Grid Entrance
    useGSAP(() => {
        if (!loading && users.length > 0) {
            gsap.fromTo(".user-card",
                { y: 100, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "power4.out" }
            );
        }
    }, [loading, users.length]);

    // Detail View Animation
    useGSAP(() => {
        if (selectedUser) {
            gsap.fromTo(detailRef.current,
                { y: "100%", opacity: 0 },
                { y: "0%", opacity: 1, duration: 0.6, ease: "power3.out" }
            );
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [selectedUser]);

    const handleUserClick = (u) => {
        setSelectedUser(u);
        fetchUserDetails(u);
    };

    const closeDetail = () => {
        gsap.to(detailRef.current, {
            y: "100%", opacity: 0, duration: 0.4, ease: "power3.in",
            onComplete: () => setSelectedUser(null)
        });
    };

    const fetchUserDetails = async (targetUser) => {
        setDetailLoading(true);
        try {
            const res = await api.get('/components');
            if (res.data.success) {
                const all = res.data.components;
                const created = all.filter(c => c.owner._id === targetUser._id);
                const contributions = all.filter(c => {
                    if (c.owner._id === targetUser._id) return false;
                    if (!c.collaborators || c.collaborators.length === 0) return false;
                    return c.collaborators.some(collab => {
                        const collabId = typeof collab === 'object' ? collab._id : collab;
                        return collabId === targetUser._id;
                    });
                });
                const team = created.filter(c => c.collaborators && c.collaborators.length > 0);
                setUserComponents({ created, contributions, team });
            }
        } catch (err) {
            console.error("Failed to fetch user details", err);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleAction = async (userId, action) => {
        try {
            if (action === "delete") {
                if (!window.confirm("Permanent deletion. Proceed?")) return;
                await api.delete(`/admin/users/${userId}`);
                setUsers(prev => prev.filter(u => u._id !== userId));
                if (selectedUser?._id === userId) closeDetail();
            } else if (action === "verify") {
                await api.put(`/admin/users/${userId}/verify`);
                fetchUsers();
                if (selectedUser?._id === userId) setSelectedUser(prev => ({ ...prev, role: "verifieduser" }));
            } else if (action === "revoke") {
                await api.put(`/admin/users/${userId}/revoke`);
                fetchUsers();
                if (selectedUser?._id === userId) setSelectedUser(prev => ({ ...prev, role: "user" }));
            }
        } catch (err) {
            alert("Action failed: " + (err.response?.data?.message || err.message));
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: colors.text }}>
                Access Denied
            </div>
        );
    }

    return (
        <div ref={containerRef} className={`admin-container ${isDark ? 'dark' : 'light'}`} style={{ color: colors.text }}>
            <div className="admin-content-wrapper">
                {/* Header */}
                <div className="admin-header">
                    <h1 className="admin-title">
                        The <span className="admin-title-highlight">Talent</span><br /> Collective
                    </h1>
                    <div className="admin-divider"></div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "100px", opacity: 0.5 }}>Fetching talent...</div>
                ) : (
                    <div className="user-grid">
                        {users.map(u => (
                            <div key={u._id} className="user-card" onClick={() => handleUserClick(u)}>
                                <img
                                    src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=random&size=400`}
                                    alt={u.name}
                                    className="user-avatar"
                                />
                                <div className="user-info-overlay">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <h3>{u.name}</h3>
                                        {u.isVerificationCandidate && <span title="Suggested for Verification" style={{ fontSize: "1.2rem", cursor: "help" }}>⭐</span>}
                                    </div>
                                    <p>{u.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* DETAIL OVERLAY */}
            {selectedUser && (
                <div className="detail-modal-backdrop" onClick={closeDetail}>
                    <div ref={detailRef} className="detail-modal" onClick={e => e.stopPropagation()} style={{ background: isDark ? "#0a0a0a" : "#fff" }}>
                        {/* Overlay Header */}
                        <div className="detail-header" style={{ borderBottom: `1px solid ${colors.border}` }}>
                            <div className="detail-user-profile">
                                <img
                                    src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${selectedUser.name}&background=random`}
                                    style={{ border: `2px solid ${colors.border}` }}
                                    className="detail-avatar"
                                />
                                <div>
                                    <h2 className="detail-name">{selectedUser.name}</h2>
                                    <p className="detail-email">{selectedUser.email}</p>
                                    <div className="detail-role-badge">
                                        {selectedUser.role}
                                    </div>
                                    {selectedUser.isVerificationCandidate && selectedUser.role === 'user' && (
                                        <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                                            <span>⭐ Suggested for Verification</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="detail-actions">
                                <button className={`action-btn ${selectedUser.role === 'verifieduser' ? 'revoke' : 'verify'}`}
                                    onClick={() => handleAction(selectedUser._id, selectedUser.role === 'verifieduser' ? 'revoke' : 'verify')}>
                                    {selectedUser.role === 'verifieduser' ? "Revoke" : "Verify"}
                                </button>
                                <button className="action-btn delete" onClick={() => handleAction(selectedUser._id, 'delete')}>
                                    Delete
                                </button>
                                <button className="close-btn" onClick={closeDetail} style={{ color: colors.text, borderColor: colors.border }}>✕</button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="detail-tabs-wrapper" style={{ borderBottom: `1px solid ${colors.border}` }}>
                            <div className="detail-tabs">
                                {['created', 'contributions', 'team'].map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)}
                                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                        style={{ color: activeTab === tab ? colors.text : colors.gray }}
                                    >
                                        {tab} ({userComponents[tab]?.length || 0})
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="detail-content" style={{ background: isDark ? "#050505" : "#fafafa" }}>
                            {detailLoading ? (
                                <p style={{ opacity: 0.5 }}>Loading details...</p>
                            ) : userComponents[activeTab].length > 0 ? (
                                <div className="detail-grid">
                                    {userComponents[activeTab].map(comp => (
                                        <ComponentCard key={comp._id} component={comp} user={user} navigate={navigate} />
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state" style={{ border: `1px dashed ${colors.border}` }}>
                                    No items found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .admin-container {
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                    box-sizing: border-box;
                    width: 100%;
                    /* max-width removed to prevent 100vw scrollbar issue */
                    background: #f0f0f0;
                    padding: 40px 20px;
                    overflow-x: hidden;
                    margin: 0;
                }
                .admin-container.dark {
                    background: #050505;
                }
                .admin-content-wrapper {
                    max-width: 1600px;
                    margin: 0 auto;
                    width: 100%;
                }
                
                /* Responsive Header */
                .admin-header { margin-bottom: 60px; }
                .admin-title {
                    font-size: 5rem;
                    font-weight: 900;
                    line-height: 0.9;
                    margin: 0 0 20px;
                    text-transform: uppercase;
                    color: #111;
                }
                .dark .admin-title { color: #fff; }
                .admin-title-highlight {
                    color: transparent;
                    -webkit-text-stroke: 2px #111;
                }
                .dark .admin-title-highlight { -webkit-text-stroke: 2px #fff; }
                .admin-divider { height: 4px; width: 100px; background: #fbbf24; margin-top: 20px; }

                /* Grid Layout */
                .user-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 24px;
                }
                .user-card {
                    position: relative;
                    cursor: pointer;
                    background: #fff;
                    aspect-ratio: 3/4;
                    overflow: hidden;
                    box-shadow: 0 0 0 1px #ddd;
                }
                .dark .user-card {
                    background: #111;
                    box-shadow: 0 0 0 1px #333;
                }
                .user-avatar {
                    width: 100%; height: 100%; object-fit: cover;
                    transition: transform 0.5s;
                }
                .user-card:hover .user-avatar { transform: scale(1.05); }
                .user-info-overlay {
                    position: absolute; bottom: 0; left: 0; width: 100%;
                    padding: 20px;
                    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
                    color: white;
                }
                .user-info-overlay h3 { margin: 0; font-size: 1.4rem; font-weight: 700; }
                .user-info-overlay p { margin: 4px 0 0; font-size: 0.8rem; opacity: 0.8; text-transform: uppercase; }

                /* Detail Modal */
                .detail-modal-backdrop {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    z-index: 1000;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(5px);
                }
                .detail-modal {
                    position: absolute; bottom: 0; left: 10px; right: 10px; top: 20px;
                    border-top-left-radius: 24px; border-top-right-radius: 24px;
                    box-shadow: 0 -20px 50px rgba(0,0,0,0.5);
                    overflow: hidden; display: flex; flex-direction: column;
                }

                .detail-header {
                    padding: 30px 40px;
                    display: flex; justify-content: space-between; align-items: flex-start;
                }
                .detail-user-profile { display: flex; gap: 20px; align-items: center; }
                .detail-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; }
                .detail-name { font-size: 2rem; margin: 0; font-weight: 800; }
                .detail-email { margin: 4px 0 0; opacity: 0.6; }
                .detail-role-badge {
                    margin-top: 10px; display: inline-block; padding: 4px 10px;
                    background: #333; color: white; border-radius: 4px; 
                    font-size: 0.8rem; text-transform: uppercase;
                }

                .detail-actions { display: flex; gap: 10px; }
                .action-btn {
                    padding: 10px 20px; border: none; border-radius: 8px; 
                    font-weight: 700; cursor: pointer;
                }
                .action-btn.verify { background: #fbbf24; color: #000; }
                .action-btn.revoke { background: #333; color: #fff; }
                .action-btn.delete { background: #ef4444; color: white; }
                .close-btn {
                    padding: 10px; background: transparent; border: 1px solid;
                    border-radius: 8px; cursor: pointer;
                }

                .detail-tabs-wrapper { padding: 0 40px; }
                .detail-tabs { display: flex; gap: 30px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
                .tab-btn {
                    padding: 20px 0; background: none; border: none;
                    border-bottom: 2px solid transparent;
                    font-size: 1rem; font-weight: 600; cursor: pointer; text-transform: capitalize;
                    white-space: nowrap;
                }
                .tab-btn.active { border-bottom-color: #fbbf24; }

                .detail-content { flex: 1; overflow-y: auto; padding: 40px; }
                .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
                .empty-state { padding: 40px; text-align: center; opacity: 0.5; border-radius: 12px; }

                /* --- MOBILE RESPONSIVENESS --- */
                @media (max-width: 768px) {
                    .admin-container { padding: 20px 10px; }
                    .admin-title { font-size: 3rem; }
                    
                    /* Grid adjustments */
                    .user-grid {
                        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); /* Smaller cards on mobile */
                        gap: 12px;
                    }
                    .user-info-overlay { padding: 12px; }
                    .user-info-overlay h3 { font-size: 1rem; }
                    .user-info-overlay p { font-size: 0.7rem; }

                    /* Detail Modal Mobile */
                    .detail-modal { top: 10px; left: 0; right: 0; border-radius: 20px 20px 0 0; }
                    .detail-header {
                        flex-direction: column; gap: 20px; padding: 20px;
                    }
                    .detail-user-profile { width: 100%; }
                    .detail-avatar { width: 60px; height: 60px; }
                    .detail-name { font-size: 1.5rem; }
                    
                    .detail-actions {
                        width: 100%; display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px;
                    }
                    .action-btn { padding: 12px; font-size: 0.9rem; }
                    
                    .detail-tabs-wrapper { padding: 0 20px; }
                    .detail-content { padding: 20px; }
                    .detail-grid { grid-template-columns: 1fr; } /* Stack components on mobile */
                }
            `}</style>
        </div>
    );
}
