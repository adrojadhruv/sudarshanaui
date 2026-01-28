import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import ComponentCard from '../components/ComponentCard';

export default function Profile({ user, setUser }) {
    const { colors, mode } = useTheme();
    const isDark = mode === 'dark';
    const navigate = useNavigate();

    // State
    const [stats, setStats] = useState({ components: 0, views: 0, likes: 0 });
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [activeTab, setActiveTab] = useState("created"); // 'created' | 'collaborations'

    // Edit Form State
    const [editForm, setEditForm] = useState({ name: "", password: "", avatar: "" });

    // Mock Data for tabs (Replace with API fetch later)
    const [myComponents, setMyComponents] = useState([]);
    const [collabComponents, setCollabComponents] = useState([]); // Contributions
    const [teamProjects, setTeamProjects] = useState([]); // My projects with team
    const [collabTab, setCollabTab] = useState("contribs"); // 'contribs' | 'team'

    // Refs
    const containerRef = useRef(null);
    const modalRef = useRef(null);

    // Initial Animation
    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".glass-card", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        })
            .from(".tab-button", {
                y: 10,
                opacity: 0,
                duration: 0.5,
                stagger: 0.05
            }, "-=0.4");
    }, { scope: containerRef });

    useEffect(() => {
        if (user) {
            setEditForm({ name: user.name, password: "", avatar: user.avatar || "" });
            setAvatarUrl(user.avatar || "");
            fetchComponents();
        }
    }, [user]);

    const fetchComponents = async () => {
        try {
            // In a real app, you might have separate endpoints or filters
            // For now, we'll fetch all and filter client-side based on the schema update we just made
            // Or just mock it if the backend endpoint isn't ready for complex filtering yet.
            // Let's assume getComponents returns relevant data.
            const res = await api.get('/components');
            if (res.data.success) {
                const all = res.data.components;

                // 1. My Creations (All owned by me)
                const created = all.filter(c => c.owner._id === user._id);
                setMyComponents(created);

                // 2. Contributions (Owned by others, I am a collaborator)
                const contribs = all.filter(c => {
                    if (c.owner._id === user._id) return false;
                    if (!c.collaborators || c.collaborators.length === 0) return false;
                    return c.collaborators.some(collab => {
                        const collabId = typeof collab === 'object' ? collab._id : collab;
                        return collabId === user._id;
                    });
                });
                setCollabComponents(contribs); // Primary "Collaborations" list (Contributions)

                // 3. Team Projects (Owned by me, but has collaborators)
                const team = created.filter(c => c.collaborators && c.collaborators.length > 0);
                setTeamProjects(team); // New state needed

                setStats({
                    components: created.length,
                    views: created.reduce((acc, curr) => acc + (curr.views || 0), 0), // Mock views if not in DB
                    likes: created.reduce((acc, curr) => acc + (curr.likes || 0), 0)  // Mock likes if not in DB
                });
            }
        } catch (err) {
            console.error("Failed to fetch components");
        }
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleUpdateProfile = async () => {
        try {
            setIsSaving(true);
            // Update Avatar separately if needed or all in one go depending on endpoint preference
            // We have /update-profile for name/pass and /update-avatar 

            // 1. Update Avatar first if changed
            if (editForm.avatar !== user.avatar) {
                await api.put('/update-avatar', { avatar: editForm.avatar });
            }

            // 2. Update Details
            if (editForm.name !== user.name || editForm.password) {
                const res = await api.put('/update-profile', {
                    name: editForm.name,
                    password: editForm.password
                });
                if (res.data.success) {
                    const updatedUser = { ...user, ...res.data.user, avatar: editForm.avatar };
                    if (setUser) setUser(updatedUser);
                    if (window.localStorage) localStorage.setItem('user', JSON.stringify(updatedUser));
                }
            } else {
                // Refresh user context just in case avatar changed
                const updatedUser = { ...user, avatar: editForm.avatar };
                if (setUser) setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            setIsEditingProfile(false);
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const generateRandomAvatar = () => {
        const seed = Math.random().toString(36).substring(7);
        const url = `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`;
        setEditForm({ ...editForm, avatar: url });
        setAvatarUrl(url);
    };

    if (!user) return <div style={{ padding: "40px", textAlign: "center", color: colors.text }}>Please login.</div>;

    const TabButton = ({ id, label, count }) => (
        <button
            className="tab-button"
            onClick={() => setActiveTab(id)}
            style={{
                flex: 1,
                padding: "16px",
                background: activeTab === id ? colors.glass.background : "transparent",
                border: "none",
                borderBottom: activeTab === id ? `2px solid ${colors.accent}` : "2px solid transparent",
                color: activeTab === id ? colors.accent : colors.text,
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
            }}
        >
            {label}
            <span style={{
                background: activeTab === id ? colors.accent : "rgba(128,128,128,0.2)",
                color: activeTab === id ? "#fff" : colors.text,
                padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem"
            }}>{count}</span>
        </button>
    );

    return (
        <div ref={containerRef} style={{
            padding: "40px 20px",
            maxWidth: "1400px",
            margin: "0 auto",
            color: colors.text,
            minHeight: "100vh",
            display: "grid",
            gridTemplateColumns: "350px 1fr", // Sidebar : Content
            gap: "40px",
            alignItems: "start" // Prevent stretching
        }}>
            <style>{`
                @media (max-width: 900px) {
                    div[style*="grid-template-columns"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            {/* LEFT COLUMN: IDENTITY CARD (Glass Architect) */}
            <div className="glass-card" style={{
                position: "sticky", top: "100px",
                padding: "40px",
                background: colors.glass.background,
                backdropFilter: "blur(20px)",
                border: colors.glass.border,
                borderRadius: "24px",
                display: "flex", flexDirection: "column", alignItems: "center",
                textAlign: "center",
                boxShadow: isDark ? "0 20px 40px -10px rgba(0,0,0,0.4)" : "0 20px 40px -10px rgba(0,0,0,0.1)"
            }}>
                {/* Holographic Avatar */}
                <div style={{ position: "relative", marginBottom: "24px" }}>
                    <div style={{
                        width: "120px", height: "120px", borderRadius: "50%",
                        padding: "3px",
                        background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                        boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)"
                    }}>
                        <img
                            src={avatarUrl || `https://ui-avatars.com/api/?name=${user.name}`}
                            alt="Avatar"
                            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: `3px solid ${colors.background}` }}
                        />
                    </div>
                </div>

                <h2 style={{ margin: "0 0 8px", fontSize: "1.8rem", fontWeight: "800" }}>{user.name}</h2>
                <div style={{
                    padding: "6px 14px", borderRadius: "100px",
                    background: "rgba(251, 191, 36, 0.1)", color: "#fbbf24", border: "1px solid rgba(251, 191, 36, 0.2)",
                    fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px",
                    marginBottom: "24px"
                }}>
                    {user.role}
                </div>

                <div style={{ width: "100%", textAlign: "left", marginBottom: "32px" }}>
                    <div style={{ padding: "16px", background: "rgba(0,0,0,0.03)", borderRadius: "12px", marginBottom: "12px" }}>
                        <span style={{ display: "block", fontSize: "0.8rem", opacity: 0.6, marginBottom: "4px" }}>EMAIL</span>
                        <div style={{ fontWeight: "600" }}>{user.email}</div>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <div style={{ flex: 1, padding: "16px", background: "rgba(0,0,0,0.03)", borderRadius: "12px", textAlign: "center" }}>
                            <div style={{ fontSize: "1.5rem", fontWeight: "800", color: colors.accent }}>{stats.components}</div>
                            <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>PROJECTS</div>
                        </div>
                        <div style={{ flex: 1, padding: "16px", background: "rgba(0,0,0,0.03)", borderRadius: "12px", textAlign: "center" }}>
                            <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#10b981" }}>{stats.views}</div>
                            <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>VIEWS</div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsEditingProfile(true)}
                    style={{
                        width: "100%", padding: "14px",
                        background: colors.text, color: colors.background,
                        border: "none", borderRadius: "12px",
                        fontWeight: "700", cursor: "pointer", transition: "transform 0.2s"
                    }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.02)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                >
                    Edit Profile
                </button>
            </div>

            {/* RIGHT COLUMN: WORKSPACE */}
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>

                {/* TABS */}
                <div style={{
                    display: "flex",
                    background: "rgba(128,128,128,0.05)",
                    borderRadius: "16px", overflow: "hidden", border: `1px solid ${colors.border}`
                }}>
                    <TabButton id="created" label="My Creations" count={myComponents.length} />
                    <TabButton id="collaborations" label="Collaborations" count={collabComponents.length} />
                </div>

                {/* CONTENT GRID */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px"
                }}>
                    {activeTab === "created" ? (
                        myComponents.map(comp => <ComponentCard key={comp._id} component={comp} user={user} navigate={navigate} />)
                    ) : (
                        /* COLLABORATIONS TAB CONTENT */
                        <div style={{ gridColumn: "1/-1" }}>
                            {/* SUB-TABS for Collaborations */}
                            <div style={{ display: "flex", gap: "20px", marginBottom: "30px", borderBottom: `1px solid ${colors.border}`, paddingBottom: "10px" }}>
                                <button
                                    onClick={() => setCollabTab("contribs")}
                                    style={{
                                        background: "none", border: "none", cursor: "pointer",
                                        color: collabTab === "contribs" ? colors.accent : colors.text,
                                        fontWeight: collabTab === "contribs" ? "700" : "500",
                                        opacity: collabTab === "contribs" ? 1 : 0.6,
                                        fontSize: "1.1rem"
                                    }}
                                >
                                    Contributions <span style={{ fontSize: "0.8em", opacity: 0.7 }}>({collabComponents.length})</span>
                                </button>
                                <button
                                    onClick={() => setCollabTab("team")}
                                    style={{
                                        background: "none", border: "none", cursor: "pointer",
                                        color: collabTab === "team" ? colors.accent : colors.text,
                                        fontWeight: collabTab === "team" ? "700" : "500",
                                        opacity: collabTab === "team" ? 1 : 0.6,
                                        fontSize: "1.1rem"
                                    }}
                                >
                                    My Team Projects <span style={{ fontSize: "0.8em", opacity: 0.7 }}>({teamProjects.length})</span>
                                </button>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                                {collabTab === "contribs" ? (
                                    collabComponents.length > 0 ? (
                                        collabComponents.map(comp => <ComponentCard key={comp._id} component={comp} user={user} navigate={navigate} />)
                                    ) : <div style={{ opacity: 0.5 }}>You haven't contributed to other projects yet.</div>
                                ) : (
                                    teamProjects.length > 0 ? (
                                        teamProjects.map(comp => <ComponentCard key={comp._id} component={comp} user={user} navigate={navigate} />)
                                    ) : <div style={{ opacity: 0.5 }}>None of your projects have collaborators yet.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {((activeTab === "created" && myComponents.length === 0) || (activeTab === "collaborations" && collabComponents.length === 0)) && (
                        <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", opacity: 0.5, border: "2px dashed " + colors.border, borderRadius: "24px" }}>
                            <h3>No components found.</h3>
                            {activeTab === "created" && <button onClick={() => navigate("/components")} style={{ marginTop: "16px", padding: "10px 20px", background: colors.accent, border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>Create New</button>}
                        </div>
                    )}
                </div>
            </div>

            {/* EDIT MODAL */}
            {isEditingProfile && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    background: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)",
                    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 3000
                }}>
                    <div ref={modalRef} style={{
                        width: "100%", maxWidth: "500px",
                        background: colors.background,
                        padding: "32px",
                        borderRadius: "24px",
                        border: `1px solid ${colors.border}`,
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
                    }}>
                        <h2 style={{ marginTop: 0 }}>Edit Profile</h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", margin: "24px 0" }}>

                            {/* Avatar Input */}
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "600" }}>Avatar</label>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {/* Preview */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                        <div style={{
                                            width: "60px", height: "60px", borderRadius: "50%",
                                            overflow: "hidden", border: `2px solid ${colors.border}`,
                                            background: colors.glass.background
                                        }}>
                                            <img src={editForm.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </div>

                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <label style={{
                                                padding: "8px 16px", background: colors.text,
                                                color: colors.background, borderRadius: "8px",
                                                fontWeight: "600", cursor: "pointer", fontSize: "0.85rem"
                                            }}>
                                                Upload Image
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: "none" }}
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setEditForm({ ...editForm, avatar: reader.result });
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </label>
                                            <button onClick={generateRandomAvatar} type="button" style={{
                                                padding: "8px 16px", background: "transparent",
                                                border: `1px solid ${colors.accent}`, color: colors.accent,
                                                borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem"
                                            }}>
                                                Random 🎲
                                            </button>
                                        </div>
                                    </div>

                                    {/* Manual URL Fallback */}
                                    <details>
                                        <summary style={{ fontSize: "0.8rem", cursor: "pointer", opacity: 0.7, marginBottom: "8px" }}>Or paste URL</summary>
                                        <input
                                            type="text" value={editForm.avatar}
                                            placeholder="https://..."
                                            onChange={e => setEditForm({ ...editForm, avatar: e.target.value })}
                                            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${colors.border}`, background: "transparent", color: colors.text }}
                                        />
                                    </details>
                                </div>
                            </div>

                            {/* Name Input */}
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "600" }}>Display Name</label>
                                <input
                                    type="text" value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${colors.border}`, background: "transparent", color: colors.text }}
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "600" }}>New Password <span style={{ opacity: 0.5, fontWeight: 400 }}>(Optional)</span></label>
                                <input
                                    type="password" placeholder="Leave blank to keep current"
                                    value={editForm.password}
                                    onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${colors.border}`, background: "transparent", color: colors.text }}
                                />
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                            <button onClick={() => setIsEditingProfile(false)} style={{ padding: "12px 24px", background: "transparent", border: `1px solid ${colors.border}`, borderRadius: "8px", color: colors.text, fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                            <button onClick={handleUpdateProfile} disabled={isSaving} style={{ padding: "12px 24px", background: colors.text, border: "none", borderRadius: "8px", color: colors.background, fontWeight: "700", cursor: isSaving ? "wait" : "pointer", opacity: isSaving ? 0.7 : 1 }}>
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



