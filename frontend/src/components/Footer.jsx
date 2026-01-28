import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";

export default function Footer({ user }) {
    const navigate = useNavigate();
    const { mode } = useTheme();

    // STYLES
    const isDark = mode === 'dark';
    const textColor = isDark ? '#a1a1aa' : '#52525b';
    const headingColor = isDark ? '#fff' : '#000';

    // The "Thinnest" Line (0.5px equivalent)
    const thinBorder = isDark ? '1px solid rgba(200, 192, 45, 0.2)' : '1px solid rgba(46, 46, 41, 0.13)';

    // Main Container - Full Width, Slim, Modern
    const footerStyle = {
        width: "100%",
        borderTop: thinBorder,
        background: "transparent",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "30px 40px",
        marginTop: "auto",
        position: "relative"
    };

    // Modern, Informal Links (Lowercase)
    const LinkItem = ({ label, path }) => {
        const [hover, setHover] = useState(false);
        return (
            <span
                onClick={() => navigate(path)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    color: hover ? headingColor : textColor,
                    transition: "all 0.2s ease",
                    letterSpacing: "0.2px",
                    // Subtle "more" interaction -> slight shift
                    transform: hover ? "translateY(-1px)" : "none"
                }}
            >
                {label}
            </span>
        );
    };

    const SocialIcon = ({ path, url }) => {
        const [hover, setHover] = useState(false);
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    color: hover ? headingColor : textColor,
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    transform: hover ? "scale(1.1)" : "scale(1)"
                }}
            >
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    {path}
                </svg>
            </a>
        );
    };

    const getLinks = () => {
        let links = [];
        if (!user) {
            links = [
                { label: "explore", path: "/explore" },
                { label: "gallery", path: "/gallery" },
                { label: "login", path: "/login" }
            ];
        } else {
            links = [
                { label: "library", path: "/components" },
                { label: "requests", path: "/requests" },
                { label: "profile", path: "/profile" }
            ];
        }
        return links;
    };

    const icons = {
        github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22">https://github.com/adrojadhruv</path>,
        twitter: <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z">https://x.com/AdrojaDhruv</path>,
        linkedin: <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2A2 2 0 1 1 4 6 2 2 0 0 1 4 2z">https://www.linkedin.com/in/gecr-comp240203107001</path>,
        instagram: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z">https://www.instagram.com/dhruv_19y</path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></>,
    };

    return (
        <footer style={footerStyle}>

            {/* Left: Full Branding (Like Navbar) */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <img src="/golden_circle.png" alt="Sudarshana" style={{ height: "32px", width: "32px", objectFit: "contain" }} />
                <h1 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", letterSpacing: "0.2px" }}>
                    <span style={{
                        background: "linear-gradient(to right, #FFD200, #F7971E)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        textTransform: "uppercase"
                    }}>SUDARSHANA</span>
                    <span style={{
                        background: "linear-gradient(to right, #FF512F, #DD2476)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        marginLeft: "4px", textTransform: "uppercase"
                    }}>UI</span>
                </h1>
            </div>

            {/* Center: Links (Informal, Lowercase) */}
            <div style={{ display: "flex", gap: "40px" }}>
                {getLinks().map((link, i) => (
                    <LinkItem key={i} label={link.label} path={link.path} />
                ))}
            </div>

            {/* Right: Connect (With LinkedIn) */}
            <div style={{ display: "flex", gap: "24px", position: "relative", zIndex: 10 }}>
                <SocialIcon path={icons.github} url="https://github.com" />
                <SocialIcon path={icons.twitter} url="https://x.com" />
                <SocialIcon path={icons.linkedin} url="https://linkedin.com" />
                <SocialIcon path={icons.instagram} url="https://instagram.com" />
            </div>

            {/* Large Decorative Footer Graphic */}
            <img
                src={isDark ? "/footerimgdark.png" : "/footerimglight.png"}
                alt="Footer Graphic"
                style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    height: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    opacity: isDark ? 0.9 : 0.8,
                    pointerEvents: "none",
                    zIndex: 0
                }}
            />

        </footer>
    );
}
