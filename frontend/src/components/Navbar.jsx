import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { useState, useRef, useEffect } from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ user, setUser }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { mode, toggle, colors } = useTheme();
    const isDark = mode === 'dark';

    // Mobile Menu State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Refs for Animations
    const navRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const { contextSafe } = useGSAP({ scope: navRef });

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const handleLogout = async () => {
        try {
            await api.post("/logout");
            if (setUser) setUser(null);
            window.location.href = "/";
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    // Micro-interaction: Hover Line Animation (Pure CSS/GSAP, no state re-renders)
    const onLinkEnter = contextSafe((e) => {
        gsap.to(e.currentTarget.querySelector('.nav-underline'), {
            scaleX: 1,
            transformOrigin: "left",
            duration: 0.3,
            ease: "power2.out"
        });
    });

    const onLinkLeave = contextSafe((e) => {
        gsap.to(e.currentTarget.querySelector('.nav-underline'), {
            scaleX: 0,
            transformOrigin: "right",
            duration: 0.3,
            ease: "power2.out"
        });
    });

    // Mobile Menu Toggle Animation
    useEffect(() => {
        if (isMobileMenuOpen) {
            gsap.to(mobileMenuRef.current, { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
        } else {
            gsap.to(mobileMenuRef.current, { x: "100%", opacity: 0, duration: 0.3, ease: "power3.in" });
        }
    }, [isMobileMenuOpen]);

    const NavLink = ({ to, label, isMobile = false }) => {
        const isActive = location.pathname === to;

        return (
            <Link
                to={to}
                className="nav-link"
                onMouseEnter={!isMobile ? onLinkEnter : undefined}
                onMouseLeave={!isMobile ? onLinkLeave : undefined}
                style={{
                    textDecoration: 'none',
                    position: 'relative',
                    padding: isMobile ? '16px 0' : '8px 0',
                    fontSize: isMobile ? '1.5rem' : '0.95rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? colors.accent : colors.text,
                    display: 'block'
                }}
            >
                {label}
                {!isMobile && (
                    <span className="nav-underline" style={{
                        position: "absolute", bottom: "-2px", left: "0", height: "2px", width: "100%",
                        background: colors.accent,
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: isActive ? "center" : "left",
                        transition: "transform 0.3s ease"
                    }}></span>
                )}
            </Link>
        );
    };

    return (
        <nav ref={navRef} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0 24px", height: "72px",
            background: location.pathname === "/" ? "transparent" : colors.glass.background,
            backdropFilter: location.pathname === "/" ? "none" : "blur(16px)",
            WebkitBackdropFilter: location.pathname === "/" ? "none" : "blur(16px)",
            borderBottom: location.pathname === "/" ? "none" : colors.glass.border,
            position: 'sticky', top: 0, zIndex: 1000,
            transition: "all 0.3s ease",
            width: "100%"
        }}>
            {/* BRANDING */}
            <Link to={user ? "/components" : "/"} style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
                <img src="/golden_circle.png" alt="Sudarshana" style={{ height: "36px", width: "36px", objectFit: "contain" }} />
                <div style={{ margin: 0, fontSize: "20px", fontWeight: "800", letterSpacing: "0.5px", fontFamily: "'Inter', sans-serif" }}>
                    <span style={{
                        background: "linear-gradient(to right, #FFD200, #F7971E)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        textTransform: "uppercase"
                    }}>SUDARSHANA</span>
                    <span style={{
                        background: "linear-gradient(to right, #FF512F, #DD2476)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        marginLeft: "6px", textTransform: "uppercase"
                    }}>UI</span>
                </div>
            </Link>

            {/* DESKTOP MENU (>768px via CSS usually, but here inline styles/JS media query often needed in pure JS solutions.
                For simplicity in this environment, we'll use a hidden class approach or just Flexbox logic.) 
            */}
            <div className="desktop-menu" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                <style>{`
                    @media (max-width: 768px) {
                        .desktop-menu { display: none !important; }
                        .mobile-toggle { display: block !important; }
                    }
                    @media (min-width: 769px) {
                        .mobile-toggle { display: none !important; }
                    }
                `}</style>

                <div style={{ display: "flex", gap: "24px" }}>
                    {/* Hide nav links on Landing Page for guests to reduce distraction */}
                    {!(location.pathname === "/" && !user) && (
                        <>
                            <>
                                {user && <NavLink to="/components" label="Dashboard" />}
                                <NavLink to="/explore" label="Explore" />
                                <NavLink to="/docs" label="Docs" />
                            </>
                        </>
                    )}
                    {user && user.role === 'admin' && <NavLink to="/boilerplate" label="Boilerplate" />}
                    {user && <NavLink to="/requests" label="Requests" />}
                </div>

                {!(location.pathname === "/" && !user) && (
                    <div style={{ width: "1px", height: "24px", background: colors.border }}></div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* Theme Toggle */}
                    <button
                        onClick={(e) => {
                            // Animate Rotation
                            gsap.fromTo(e.currentTarget, { rotation: 0 }, { rotation: 360, duration: 0.5, ease: "back.out(1.7)" });
                            toggle(e);
                        }}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", color: colors.text }}
                    >
                        {isDark ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        )}
                    </button>

                    {user ? (
                        <>
                            <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                                <img
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                    alt="User"
                                    style={{ width: "32px", height: "32px", borderRadius: "50%", border: `2px solid ${colors.accent}`, objectFit: "cover" }}
                                />
                            </Link>
                            <button onClick={handleLogout} style={{
                                padding: "6px 14px", background: "transparent", color: "#dc3545",
                                border: "1px solid rgba(220, 53, 69, 0.3)", borderRadius: "6px",
                                fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s"
                            }}>Logout</button>
                        </>
                    ) : (
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <Link to="/login" className="sd-btn-simple sd-btn-simple-secondary" style={{ color: colors.text, borderColor: colors.border }}>Login</Link>
                            <Link to="/signup" className="sd-btn-simple sd-btn-simple-primary" style={{ background: colors.text, color: colors.background, borderColor: colors.text }}>Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* MOBILE TOGGLE */}
            <button
                className="mobile-toggle"
                onClick={() => setIsMobileMenuOpen(true)}
                style={{ background: "none", border: "none", cursor: "pointer", color: colors.text }}
            >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>

            {/* MOBILE MENU OVERLAY */}
            <div
                ref={mobileMenuRef}
                style={{
                    position: "fixed", top: 0, right: 0, width: "100%", height: "100vh",
                    background: colors.background, zIndex: 2000,
                    display: "flex", flexDirection: "column", padding: "30px",
                    transform: "translateX(100%)", opacity: 0 // Init hidden
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: "800", color: colors.text }}>MENU</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: colors.text }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {!(location.pathname === "/" && !user) && (
                        <>
                            <>
                                {user && <NavLink to="/components" label="Dashboard" isMobile />}
                                <NavLink to="/explore" label="Explore" isMobile />
                                <NavLink to="/docs" label="Docs" isMobile />
                            </>
                        </>
                    )}
                    {user && user.role === 'admin' && <NavLink to="/boilerplate" label="Boilerplate" isMobile />}
                    {user && <NavLink to="/requests" label="Requests" isMobile />}
                    {user && <NavLink to="/profile" label="Profile" isMobile />}
                </div>

                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
                    <button onClick={(e) => toggle(e)} style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        background: "rgba(0,0,0,0.05)", padding: "15px", borderRadius: "12px",
                        border: "none", color: colors.text, fontSize: "1rem", fontWeight: "600"
                    }}>
                        {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
                    </button>

                    {user ? (
                        <button onClick={handleLogout} style={{
                            padding: "15px", background: "#dc3545", color: "white",
                            border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: "600"
                        }}>Logout</button>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Link to="/login" style={{ textAlign: "center", textDecoration: "none", color: colors.text, fontWeight: "600", padding: "15px", border: `1px solid ${colors.border}`, borderRadius: "12px" }}>Login</Link>
                            <Link to="/signup" style={{ textAlign: "center", textDecoration: "none", background: colors.text, color: colors.background, padding: "15px", borderRadius: "12px", fontWeight: "600" }}>Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
