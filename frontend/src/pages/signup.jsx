import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

// --- ICONS ---
const EyeIcon = ({ visible }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {visible ? (
            <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ) : (
            <>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07-2.3 2.3" />
                <line x1="1" y1="1" x2="23" y2="23" />
            </>
        )}
    </svg>
);

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);



export default function Signup() {
    const navigate = useNavigate();
    const { colors, mode } = useTheme();
    const isDark = mode === 'dark';
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await api.post("/signup", { name, email, password });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuth = (provider) => {
        const baseURL = api.defaults.baseURL || "http://localhost:3000/api/v1";
        const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
        window.location.href = `${cleanBaseURL}/auth/${provider}`;
    };

    // BUSINESS COMPACT STYLES
    const containerStyle = {
        minHeight: 'calc(100vh - 72px)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: colors.background,
        fontFamily: "'Inter', sans-serif",
    };

    const cardStyle = {
        width: '100%',
        maxWidth: '380px',
        padding: '32px',
        background: isDark ? '#141416' : '#ffffff',
        border: colors.border,
        borderRadius: '2px',
        boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' : '0 1px 3px rgba(0,0,0,0.05)',
    };

    const headerStyle = {
        marginBottom: '24px',
        textAlign: 'left'
    };

    const titleStyle = {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: colors.text,
        letterSpacing: '-0.02em',
        fontFamily: "'Space Grotesk', sans-serif",
        marginBottom: '4px'
    };

    const subtitleStyle = {
        fontSize: '0.85rem',
        color: isDark ? '#a1a1aa' : '#6b7280',
        fontWeight: '400'
    };

    const inputGroupStyle = {
        marginBottom: '16px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '4px',
        fontSize: '0.7rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: isDark ? '#71717a' : '#6b7280'
    };

    const inputStyle = {
        width: '100%',
        padding: '8px 0',
        fontSize: '0.9rem',
        background: 'transparent',
        border: 'none',
        borderBottom: isDark ? '1px solid #333' : '1px solid #e5e7eb',
        color: colors.text,
        borderRadius: '0',
        outline: 'none',
        transition: 'border-color 0.2s ease',
    };

    const buttonStyle = {
        width: '100%',
        padding: '12px',
        borderRadius: '2px',
        border: 'none',
        background: isDark ? '#ffffff' : '#111827',
        color: isDark ? '#000000' : '#ffffff',
        fontSize: '0.85rem',
        fontWeight: '500',
        cursor: 'pointer',
        marginTop: '12px',
        letterSpacing: '0.02em',
        transition: 'opacity 0.2s ease',
    };

    const socialBtnStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
        padding: '8px',
        borderRadius: '2px',
        border: isDark ? '1px solid #333' : '1px solid #e5e7eb',
        background: 'transparent',
        color: colors.text,
        fontSize: '0.8rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
    };

    return (
        <div style={containerStyle}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={cardStyle}
            >
                <div style={headerStyle}>
                    <h1 style={titleStyle}>
                        Join
                    </h1>
                    <p style={subtitleStyle}>
                        Start building.
                    </p>
                </div>

                {error && (
                    <div style={{
                        padding: '10px',
                        background: 'rgba(239, 68, 68, 0.05)',
                        borderLeft: '2px solid #ef4444',
                        color: '#ef4444',
                        fontSize: '0.8rem',
                        marginBottom: '16px',
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={inputStyle}
                            onFocus={(e) => e.target.style.borderBottomColor = isDark ? '#fff' : '#000'}
                            onBlur={(e) => e.target.style.borderBottomColor = isDark ? '#333' : '#e5e7eb'}
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                            onFocus={(e) => e.target.style.borderBottomColor = isDark ? '#fff' : '#000'}
                            onBlur={(e) => e.target.style.borderBottomColor = isDark ? '#333' : '#e5e7eb'}
                        />
                    </div>

                    <div style={{ ...inputGroupStyle, position: 'relative' }}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ ...inputStyle, paddingRight: '30px' }}
                            onFocus={(e) => e.target.style.borderBottomColor = isDark ? '#fff' : '#000'}
                            onBlur={(e) => e.target.style.borderBottomColor = isDark ? '#333' : '#e5e7eb'}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '0',
                                top: '30px',
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: isDark ? '#71717a' : '#9ca3af',
                                cursor: 'pointer'
                            }}
                        >
                            <EyeIcon visible={showPassword} />
                        </button>
                    </div>


                    <div style={{ marginBottom: '16px' }}>
                        <p style={{
                            fontSize: "0.7rem",
                            color: isDark ? "#a1a1aa" : "#6b7280",
                            lineHeight: "1.4"
                        }}>
                            I agree to Terms & Privacy.
                        </p>
                    </div>

                    <button
                        type="submit"
                        style={buttonStyle}
                        disabled={isLoading}
                        onMouseOver={(e) => e.target.style.opacity = '0.9'}
                        onMouseOut={(e) => e.target.style.opacity = '1'}
                    >
                        {isLoading ? "..." : "JOIN"}
                    </button>
                </form>

                <div style={{ margin: '24px 0', borderTop: isDark ? '1px solid #27272a' : '1px solid #e5e7eb', position: 'relative' }}>
                    <span style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: isDark ? '#141416' : '#ffffff',
                        padding: '0 8px',
                        fontSize: '0.7rem',
                        color: isDark ? '#52525b' : '#9ca3af'
                    }}>
                        OR
                    </span>
                </div>

                <div style={{ marginTop: '16px' }}>
                    <button type="button" onClick={() => handleOAuth('google')} style={socialBtnStyle}>
                        <GoogleIcon />
                        <span style={{ marginLeft: '6px' }}>Google</span>
                    </button>
                </div>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.8rem', color: isDark ? '#71717a' : '#6b7280' }}>
                    <Link to="/login" style={{ color: colors.text, fontWeight: '600', textDecoration: 'none' }}>Have an account?</Link>
                </div>
            </motion.div>
        </div>
    );
}
