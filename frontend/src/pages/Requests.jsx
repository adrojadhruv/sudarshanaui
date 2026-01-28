import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function Requests({ user }) {
    const navigate = useNavigate();
    const { colors, mode } = useTheme();
    const isDark = mode === 'dark';
    const [activeTab, setActiveTab] = useState("incoming"); // incoming, admin, sent
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, [activeTab]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            let endpoint = "/collab/pending/owner"; // Default incoming
            if (activeTab === "admin") endpoint = "/collab/pending/admin";
            if (activeTab === "sent") endpoint = "/collab/my-requests";

            const res = await api.get(endpoint);
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        const confirmMsg = action === 'approve' ? "Approve this request?" : "Reject this request?";
        if (!window.confirm(confirmMsg)) return;

        try {
            // Determine endpoint based on role and stage
            // If Owner approving: /approve/owner
            // If Admin approving: /approve/admin
            // If Rejecting: /reject

            let endpoint = "";
            if (action === "reject") {
                endpoint = `/collab/${id}/reject`;
            } else {
                if (activeTab === "incoming") endpoint = `/collab/${id}/approve/owner`;
                if (activeTab === "admin") endpoint = `/collab/${id}/approve/admin`;
            }

            await api.put(endpoint, {});
            alert("Action successful!");
            fetchRequests();
        } catch (err) {
            alert("Action failed: " + (err.response?.data?.message || err.message));
        }
    };

    // TABS
    const tabs = [
        { id: "incoming", label: "My Incoming Reviews" },
        { id: "sent", label: "My Sent Proposals" },
    ];
    if (user?.role === 'admin') tabs.push({ id: "admin", label: "Admin Merge Queue" });

    return (
        <div style={{ padding: "40px 0", maxWidth: "1000px", margin: "0 auto", color: colors.text }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "30px", background: "linear-gradient(to right, #fbbf24, #d97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Collaboration Center
            </h1>

            {/* TABS */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "30px", borderBottom: `1px solid ${colors.border}` }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: "10px 0",
                            background: "none",
                            border: "none",
                            borderBottom: activeTab === tab.id ? `2px solid ${colors.accent}` : "2px solid transparent",
                            color: activeTab === tab.id ? colors.accent : colors.text,
                            opacity: activeTab === tab.id ? 1 : 0.6,
                            fontSize: "1rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s"
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* LIST */}
            {loading ? (
                <p>Loading requests...</p>
            ) : requests.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", background: colors.glass.background, borderRadius: "12px", border: colors.border }}>
                    <p style={{ opacity: 0.7 }}>No requests found in this section.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {requests.map(req => (
                        <div key={req._id} style={{
                            padding: "24px",
                            background: colors.glass.background,
                            backdropFilter: "blur(10px)",
                            border: colors.border,
                            borderRadius: "16px",
                            display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}>
                            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                                {/* AVATAR - Only show if actual avatar exists */}
                                {req.requester?.avatar && (
                                    <div style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        border: `2px solid ${colors.border}`,
                                        backgroundColor: colors.surface,
                                        flexShrink: 0
                                    }}>
                                        <img
                                            src={req.requester.avatar}
                                            alt="Avatar"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </div>
                                )}

                                <div>
                                    <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem" }}>
                                        Change to <strong>{req.component?.name || "Unknown Component"}</strong>
                                    </h3>
                                    <p style={{ margin: "2px 0 0 0", opacity: 0.75, fontSize: "0.9rem", color: colors.text }}>
                                        {activeTab !== 'sent' ? (
                                            <>Proposed by <strong>{req.requester?.name}</strong> • </>
                                        ) : (
                                            <>Sent on </>
                                        )}
                                        <span style={{ opacity: 0.8, fontSize: "0.85rem" }}>{new Date(req.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    </p>


                                    <div style={{ marginTop: "8px", fontSize: "0.75rem", padding: "2px 8px", background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)", borderRadius: "4px", width: "fit-content" }}>
                                        Status: {req.status.replace("_", " ").toUpperCase()}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "10px", flexDirection: "column", minWidth: "140px" }}>
                                {activeTab !== "sent" ? (
                                    <>
                                        {/* Review Button */}
                                        <button
                                            onClick={() => navigate(`/editor/${req.component?._id}?mode=review&requestId=${req._id}`)}
                                            style={{ padding: "8px 16px", background: "transparent", border: `1px solid ${colors.text}`, color: colors.text, borderRadius: "8px", cursor: "pointer" }}
                                        >
                                            View Code
                                        </button>

                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <button
                                                onClick={() => handleAction(req._id, 'approve')}
                                                style={{ flex: 1, padding: "8px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(req._id, 'reject')}
                                                style={{ flex: 1, padding: "8px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <span style={{
                                        fontSize: "0.9rem",
                                        fontWeight: "600",
                                        color: req.status === 'approved' ? "#10b981" : req.status === 'rejected' ? "#ef4444" : colors.text,
                                        opacity: req.status === 'pending' ? 0.6 : 1
                                    }}>
                                        {req.status === 'approved' ? "Approved ✅" : req.status === 'rejected' ? "Rejected ❌" : "Waiting for review..."}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
