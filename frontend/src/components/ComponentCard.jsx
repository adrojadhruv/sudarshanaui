import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export default function ComponentCard({ component: c, user, navigate, onApprove, onSubmit, minimal = false }) {
    const cardRef = useRef(null);
    const previewRef = useRef(null);
    const { contextSafe } = useGSAP({ scope: cardRef });
    const { colors, mode } = useTheme();
    const isDark = mode === 'dark';

    // Modern Hover Effect: Card Lift + Preview Zoom
    const onCardEnter = contextSafe(() => {
        gsap.to(cardRef.current, {
            y: -6,
            boxShadow: isDark
                ? "0 20px 40px -5px rgba(0,0,0,0.5), 0 0 0 1px rgba(251, 191, 36, 0.5)"
                : "0 20px 40px -5px rgba(0,0,0,0.1), 0 0 0 1px rgba(245, 158, 11, 0.3)",
            borderColor: "transparent",
            duration: 0.4,
            ease: "power3.out"
        });
        gsap.to(previewRef.current, { scale: 1.05, duration: 0.6, ease: "power2.out" });
    });

    const onCardLeave = contextSafe(() => {
        gsap.to(cardRef.current, {
            y: 0,
            boxShadow: "none",
            borderColor: isDark ? "rgba(251, 191, 36, 0.3)" : "rgba(217, 119, 6, 0.2)",
            duration: 0.4,
            ease: "power3.out"
        });
        gsap.to(previewRef.current, { scale: 1, duration: 0.6, ease: "power2.out" });
    });

    const generatePreview = () => {
        if (!c.definition) return "";
        try {
            const def = c.definition;
            let { markup, styles, defaultProps } = def || {};
            if (!markup) return "";
            let html = markup;
            if (defaultProps) for (let k in defaultProps) html = html.replaceAll(`{{${k}}}`, defaultProps[k]);
            let css = "";
            if (styles) { for (let s in styles) { css += `${s}{`; for (let r in styles[s]) css += `${r}:${styles[s][r]};`; css += `}`; } }

            const embeddedStyles = `
        html,body { margin:0; padding:0; height:100%; width:100%; }
        body { 
          font-family: 'Inter', sans-serif; 
          display: flex; justify-content: center; align-items: center; 
          background: transparent; color: ${isDark ? 'white' : 'black'}; overflow: hidden; 
        }
        /* Zoom out for preview scale (High Visibility Mode) */
        body > * { transform: scale(0.9); transform-origin: center; } 
        ${css}
      `;
            return `<html><head><style>${embeddedStyles}</style></head><body>${html}</body></html>`;
        } catch (e) { return ""; }
    };

    return (
        <div
            ref={cardRef}
            onMouseEnter={!minimal ? onCardEnter : undefined}
            onMouseLeave={!minimal ? onCardLeave : undefined}
            style={{
                borderRadius: minimal ? "12px" : "24px",
                background: minimal ? "transparent" : (isDark ? "rgba(20,20,20,0.6)" : "rgba(255,255,255,0.8)"),
                backdropFilter: minimal ? "none" : "blur(12px)",
                border: minimal ? "none" : (isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)"),
                boxShadow: minimal ? "none" : (isDark ? "none" : "0 4px 20px rgba(0,0,0,0.04)"),
                minHeight: "auto",
                height: "fit-content",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                position: 'relative',
                transition: "all 0.3s ease",
                padding: minimal ? "0" : "8px",
                gap: minimal ? "0" : "5px"
            }}
        >
            {/* 1. PREVIEW AREA (The "Render Component" Box) */}
            <div style={{
                height: minimal ? "100%" : "200px", // Expand in minimal mode, Taller for live preview
                minHeight: minimal ? "300px" : "200px", // Taller for showcase
                width: "100%",
                borderRadius: minimal ? "16px" : "16px",
                background: isDark ? "#000" : "#f3f4f6", // Higher contrast
                overflow: "hidden",
                border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
                position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0
            }}>
                <div ref={previewRef} style={{ width: "100%", height: "100%", display: "flex", pointerEvents: "auto" }}>
                    <iframe
                        title={c.name}
                        srcDoc={generatePreview().replace('scale(0.9)', minimal ? 'scale(1)' : 'scale(0.9)')}
                        style={{ width: "100%", height: "100%", border: "none" }}
                        sandbox="allow-scripts"
                    />
                </div>

                {/* Title Overlay (Hidden in Minimal) */}
                {!minimal && <div style={{
                    position: "absolute", top: "16px", left: "16px",
                    background: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(4px)",
                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                    padding: "6px 14px", borderRadius: "100px",
                    fontSize: "0.75rem", fontWeight: "700",
                    color: isDark ? "#fff" : "#1f2937",
                    pointerEvents: "none",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                }}>
                    {c.name}
                </div>}

                {/* Status Dot (Hidden in Minimal) */}
                {!minimal && (user && (user.id === c.owner?._id || user._id === c.owner?._id || user.role === 'admin')) && (
                    <div style={{
                        position: "absolute", top: "16px", right: "16px",
                        width: "8px", height: "8px", borderRadius: "50%",
                        background: c.status === 'approved' ? "#10b981" : "#f59e0b",
                        boxShadow: "0 0 0 2px rgba(255,255,255,0.5)"
                    }} title={`Status: ${c.status}`}></div>
                )}
            </div>

            {/* 2. ACTION BAR (Hidden in Minimal) */}
            {!minimal && <div style={{
                minHeight: "44px",
                height: "auto",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px"
            }}>
                {/* ACTION 1: OPEN EDITOR (Always High Contrast) */}
                <button
                    onClick={() => {
                        if (!user) {
                            navigate('/login');
                            return;
                        }
                        navigate(`/editor/${c._id}`);
                    }}
                    style={{
                        width: "100%", height: "100%",
                        borderRadius: "14px",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}`,
                        background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
                        color: colors.text,
                        fontWeight: "700",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        display: "flex", justifyContent: "center", alignItems: "center",
                        transition: "all 0.2s ease",
                        boxShadow: isDark ? "none" : "0 2px 5px rgba(0,0,0,0.05)"
                    }}
                    onMouseEnter={e => {
                        e.target.style.background = isDark ? "#fff" : "#000";
                        e.target.style.color = isDark ? "#000" : "#fff";
                    }}
                    onMouseLeave={e => {
                        e.target.style.background = isDark ? "rgba(255,255,255,0.05)" : "#fff";
                        e.target.style.color = colors.text;
                    }}
                >
                    Open
                </button>

                {/* ACTION 2: DYNAMIC (Role Based) */}

                {/* A. PUBLIC: COLLABORATE */}
                {(!user || (user && user.id !== c.owner?._id && user._id !== c.owner?._id && user.role !== 'admin')) && (
                    <button
                        onClick={() => {
                            if (!user) {
                                navigate('/login');
                                return;
                            }
                            navigate(`/editor/${c._id}?mode=collab`);
                        }}
                        style={{
                            width: "100%", height: "100%",
                            borderRadius: "14px",
                            border: "none",
                            background: isDark ? "rgba(139, 92, 246, 0.2)" : "#f3f0ff", // Purple tint
                            color: "#8b5cf6",
                            fontWeight: "700",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "flex", justifyContent: "center", alignItems: "center"
                        }}
                        onMouseEnter={e => {
                            e.target.style.background = "#8b5cf6";
                            e.target.style.color = "#fff";
                        }}
                        onMouseLeave={e => {
                            e.target.style.background = isDark ? "rgba(139, 92, 246, 0.2)" : "#f3f0ff";
                            e.target.style.color = "#8b5cf6";
                        }}
                    >
                        Collab
                    </button>
                )}

                {/* B. OWNER: SUBMIT (If Draft/Rejected) */}
                {(user && (user.id === c.owner?._id || user._id === c.owner?._id) && (c.status === 'draft' || c.status === 'rejected')) && (
                    <button
                        onClick={() => onSubmit(c)}
                        style={{
                            width: "100%", height: "100%",
                            borderRadius: "16px", border: "none",
                            background: "#2563eb", color: "#fff",
                            fontWeight: "700", cursor: "pointer"
                        }}
                    >
                        Submit
                    </button>
                )}

                {/* C. ADMIN: APPROVE (If Pending) */}
                {(user && user.role === 'admin' && c.status === 'pending') && (
                    <button
                        onClick={() => onApprove(c)}
                        style={{
                            width: "100%", height: "100%",
                            borderRadius: "16px", border: "none",
                            background: "#059669", color: "#fff",
                            fontWeight: "700", cursor: "pointer"
                        }}
                    >
                        Approve
                    </button>
                )}

                {/* D. FALLBACK (If Owner/Admin and no action needed, e.g. Approved) */}
                {(user && (user.id === c.owner?._id || user._id === c.owner?._id || user.role === 'admin') && c.status === 'approved') && (
                    <div style={{
                        width: "100%", height: "100%",
                        borderRadius: "16px",
                        background: colors.glass.surface,
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#10b981", fontWeight: "700", fontSize: "0.9rem"
                    }}>
                        Active
                    </div>
                )}

                {/* E. FALLBACK (If Owner and Pending) */}
                {(user && (user.id === c.owner?._id || user._id === c.owner?._id) && c.status === 'pending') && (
                    <div style={{
                        width: "100%", height: "100%",
                        borderRadius: "16px",
                        background: colors.glass.surface,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#f59e0b", fontWeight: "700", fontSize: "0.9rem"
                    }}>
                        Pending
                    </div>
                )}

                {/* F. NPM PUBLISH WORKFLOW (New) */}
                {/* 1. ADMIN: PUBLISH (Requested OR Force Publish) */}
                {(user && user.role === 'admin' && (c.npmStatus === 'requested' || (c.status === 'approved' && c.npmStatus === 'none'))) && (
                    <button
                        onClick={async () => {
                            if (window.confirm("Confirm publish to NPM? This will make the component public.")) {
                                try {
                                    const token = localStorage.getItem('token');
                                    const res = await api.post(`/components/${c._id}/npm-publish`, {}, {
                                        headers: { 'Authorization': `Bearer ${token}` }
                                    });
                                    if (res.data.success) {
                                        // Generate Scripts
                                        const pkgName = res.data.component.npmPackageName || `@sudarshanaui/${c.name.toLowerCase().replace(/\s+/g, '-')}`;
                                        const uploadScript = `npm publish --access public`;
                                        const installScript = `npm i ${pkgName}`;

                                        // Copy to clipboard
                                        navigator.clipboard.writeText(`${uploadScript}\n${installScript}`);

                                        alert("Published! Upload & Install scripts copied to clipboard.");
                                        window.location.reload();
                                    } else {
                                        alert(res.data.message);
                                    }
                                } catch (e) {
                                    console.error(e);
                                    alert("Error publishing");
                                }
                            }
                        }}
                        style={{
                            width: "100%", height: "100%",
                            borderRadius: "16px", border: "none",
                            background: "#cb3cff", // Special PURPLE for NPM
                            color: "#fff",
                            fontWeight: "700", cursor: "pointer",
                            gridColumn: "span 2", // Full width
                            minHeight: "44px",
                            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "2px"
                        }}
                    >
                        <span>Approve & Publish</span>
                        <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>(Copies Scripts)</span>
                    </button>
                )}

                {/* 2. OWNER: REQUEST PUBLISH (If Approved & Not Published) */}
                {(user && (user.id === c.owner?._id || user._id === c.owner?._id) && c.status === 'approved' && c.npmStatus === 'none') && (
                    <button
                        onClick={async () => {
                            if (window.confirm("Request to publish this component to NPM?")) {
                                try {
                                    // Use api service to handle port/auth automatically
                                    const token = localStorage.getItem('token');
                                    const res = await api.post(`/components/${c._id}/npm-request`, {}, {
                                        headers: { 'Authorization': `Bearer ${token}` }
                                    });
                                    if (res.data.success) {
                                        alert("Request sent successfully!");
                                        window.location.reload();
                                    }
                                } catch (e) {
                                    console.error(e);
                                    alert("Failed to request NPM publish. Check console.");
                                }
                            }
                        }}
                        style={{
                            width: "100%", height: "100%",
                            borderRadius: "16px", border: "none",
                            background: isDark ? "rgba(203, 60, 255, 0.2)" : "#fce7ff",
                            color: "#cb3cff",
                            fontWeight: "700", cursor: "pointer",
                            fontSize: "0.8rem",
                            gridColumn: "span 2", // Full width
                            minHeight: "44px"
                        }}
                    >
                        Request NPM
                    </button>
                )}

                {/* 3. OWNER: REQUEST UPDATE (If Published & New Version Available) */}
                {(
                    user && (user.id === c.owner?._id || user._id === c.owner?._id) &&
                    c.status === 'approved' &&
                    c.npmStatus === 'published' &&
                    c.publishedVersion !== c.version
                ) && (
                        <button
                            onClick={async () => {
                                if (window.confirm(`Request update to v${c.version} on NPM?`)) {
                                    try {
                                        const res = await api.post(`/components/${c._id}/npm-request`);
                                        if (res.status === 200) window.location.reload();
                                    } catch (e) { }
                                }
                            }}
                            style={{
                                width: "100%", height: "100%",
                                borderRadius: "16px", border: "none",
                                background: isDark ? "rgba(203, 60, 255, 0.2)" : "#fce7ff",
                                color: "#cb3cff",
                                fontWeight: "700", cursor: "pointer",
                                fontSize: "0.8rem",
                                gridColumn: "span 2",
                                minHeight: "44px"
                            }}
                        >
                            Update NPM
                        </button>
                    )}

                {/* 4. PUBLIC: COPY INSTALL COMMAND (If Published) - Terminal Style Snippet */}
                {(!user || (user && user.role !== 'admin' && user.id !== c.owner?._id)) && c.npmStatus === 'published' && (
                    <div
                        onClick={(e) => {
                            // Copy to clipboard
                            const cmd = `npm i ${c.npmPackageName || `@sudarshanaui/${c.name.toLowerCase().replace(/\s+/g, '-')}`}`;
                            navigator.clipboard.writeText(cmd);

                            // Visual Feedback (Target the specific 'Copied!' span if possible or just rely on simple feedback)
                            const target = e.currentTarget;
                            target.style.borderColor = "#10b981"; // Green border
                            setTimeout(() => {
                                target.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
                            }, 1000);
                        }}
                        style={{
                            gridColumn: "span 2", // Full width
                            width: "100%",
                            minHeight: "44px",
                            borderRadius: "12px",
                            background: "#1e1e1e", // Terminal Black
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 14px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            fontFamily: "'Space Mono', monospace",
                            position: "relative",
                            overflow: "hidden"
                        }}
                        title="Click to copy"
                    >
                        {/* Command Text */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: "8px",
                            color: "#e5e7eb", fontSize: "0.75rem", overflow: "hidden", whiteSpace: "nowrap"
                        }}>
                            <span style={{ color: "#cb3cff", userSelect: "none" }}>&gt;</span>
                            <span style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                                npm i {c.npmPackageName || `@sudarshanaui/${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                            </span>
                        </div>

                        {/* Copy Icon */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </div>
                )}

                {/* 4. STATUS: REQUESTED (Disabled) */}
                {(c.npmStatus === 'requested') && (
                    <div style={{
                        width: "100%", height: "100%",
                        borderRadius: "16px",
                        background: colors.glass.surface,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#cb3cff", fontWeight: "700", fontSize: "0.8rem",
                        gridColumn: "span 2",
                        minHeight: "44px"
                    }}>
                        NPM Pending
                    </div>
                )}
            </div>}
        </div>
    );
}
