import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from 'lenis';
import RotatingIcon from "../components/RotatingIcon";
import ComponentCard from "../components/ComponentCard";

gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------------------------
// MOCK DATA FOR SHOWCASE (REALISTIC AWARD-WINNING COMPONENTS)
// ----------------------------------------------------------------------
const SHOWCASE_COMPONENTS = [
    {
        _id: "1",
        name: "Prism Button",
        description: "A holographic glassmorphism button with light refraction effects.",
        owner: { _id: "admin", username: "Sudarshana" },
        status: "approved",
        npmStatus: "published", // Pretend it's published for the "Correct Components" feel
        npmPackageName: "@sudarshana/prism-button",
        definition: {
            markup: `
<button class="sd-prism-btn">
    <span class="sd-btn-text">Explore</span>
    <div class="sd-shine"></div>
</button>
        `,
            styles: {
                ".sd-prism-btn": {
                    "position": "relative",
                    "padding": "16px 36px",
                    "background": "rgba(255, 255, 255, 0.05)",
                    "border": "1px solid rgba(255, 255, 255, 0.1)",
                    "border-radius": "100px",
                    "color": "#fff",
                    "font-family": "'Space Grotesk', sans-serif",
                    "font-size": "16px",
                    "font-weight": "600",
                    "letter-spacing": "1px",
                    "cursor": "pointer",
                    "overflow": "hidden",
                    "backdrop-filter": "blur(10px)",
                    "box-shadow": "0 10px 40px rgba(0, 0, 0, 0.2)",
                    "transition": "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)"
                },
                ".sd-prism-btn:hover": {
                    "transform": "translateY(-4px) scale(1.02)",
                    "box-shadow": "0 20px 60px rgba(139, 92, 246, 0.3), inset 0 0 0 2px rgba(255,255,255,0.2)"
                },
                ".sd-shine": {
                    "position": "absolute",
                    "top": "0", "left": "-100%",
                    "width": "50%", "height": "100%",
                    "background": "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    "transform": "skewX(-20deg)",
                    "transition": "0.5s"
                },
                ".sd-prism-btn:hover .sd-shine": {
                    "left": "200%",
                    "transition": "0.5s ease-in-out"
                }
            }
        }
    },
    {
        _id: "2",
        name: "Void Card",
        description: "Deep dark UI card with neon glow accents.",
        owner: { _id: "admin", username: "Sudarshana" },
        status: "approved",
        npmStatus: "published",
        npmPackageName: "@sudarshana/void-card",
        definition: {
            markup: `
<div class="sd-void-card">
    <div class="sd-glow"></div>
    <h3 class="sd-title">System Ready</h3>
    <p class="sd-subtitle">All systems operational. Waiting for input.</p>
</div>
        `,
            styles: {
                ".sd-void-card": {
                    "width": "280px",
                    "padding": "32px",
                    "background": "#050505",
                    "border-radius": "24px",
                    "border": "1px solid #1a1a1a",
                    "position": "relative",
                    "overflow": "hidden",
                    "display": "flex",
                    "flex-direction": "column",
                    "gap": "12px"
                },
                ".sd-title": {
                    "margin": "0",
                    "color": "#fff",
                    "font-size": "20px",
                    "font-weight": "700",
                    "z-index": "2"
                },
                ".sd-subtitle": {
                    "margin": "0",
                    "color": "#666",
                    "font-size": "14px",
                    "line-height": "1.5",
                    "z-index": "2"
                },
                ".sd-glow": {
                    "position": "absolute",
                    "top": "-50%", "left": "-50%",
                    "width": "200%", "height": "200%",
                    "background": "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15), transparent 60%)",
                    "opacity": "0.6",
                    "pointer-events": "none",
                    "transition": "opacity 0.3s"
                },
                ".sd-void-card:hover .sd-glow": {
                    "background": "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.25), transparent 50%)",
                    "opacity": "1"
                },
                ".sd-void-card::before": {
                    "content": "''", "position": "absolute", "inset": "0",
                    "border-radius": "24px", "padding": "1px",
                    "background": "linear-gradient(45deg, #10b981, transparent)",
                    "-webkit-mask": "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    "-webkit-mask-composite": "xor",
                    "mask-composite": "exclude",
                    "pointer-events": "none"
                }
            }
        }
    },
    {
        _id: "3",
        name: "Liquid Toggle",
        description: "Organic toggle switch with fluid animation.",
        owner: { _id: "admin", username: "Sudarshana" },
        status: "approved",
        npmStatus: "published",
        npmPackageName: "@sudarshana/liquid-toggle",
        definition: {
            markup: `
  <label class="sd-switch">
      <input type="checkbox" checked />
      <span class="sd-slider"></span>
  </label>
          `,
            styles: {
                ".sd-switch": {
                    "position": "relative",
                    "display": "inline-block",
                    "width": "80px",
                    "height": "44px"
                },
                ".sd-switch input": { "opacity": "0", "width": "0", "height": "0" },
                ".sd-slider": {
                    "position": "absolute",
                    "cursor": "pointer",
                    "top": "0", "left": "0", "right": "0", "bottom": "0",
                    "background-color": "#e2e8f0",
                    "transition": "0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    "border-radius": "34px",
                    "box-shadow": "inset 0 2px 4px rgba(0,0,0,0.1)"
                },
                ".sd-slider:before": {
                    "position": "absolute",
                    "content": "''",
                    "height": "36px", "width": "36px",
                    "left": "4px", "bottom": "4px",
                    "background-color": "white",
                    "transition": "0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    "border-radius": "50%",
                    "box-shadow": "0 2px 5px rgba(0,0,0,0.2)"
                },
                "input:checked + .sd-slider": { "background-color": "#3b82f6" },
                "input:checked + .sd-slider:before": { "transform": "translateX(36px)" }
            }
        }
    }
];

export default function LandingPage() {
    const navigate = useNavigate();
    const { colors, mode } = useTheme();
    const containerRef = useRef(null);
    const scrollContainerRef = useRef(null); // For horizontal scroll
    const isDark = mode === 'dark';

    // SMOOTH SCROLL ONE-TIME SETUP
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    // ----------------------------------------------------------------------
    // SCROLL ANIMATIONS (GSAP)
    // ----------------------------------------------------------------------
    useGSAP(() => {

        // 4. HORIZONTAL SCROLL (Showcase)
        const scrollContainer = scrollContainerRef.current;
        const sections = gsap.utils.toArray(".horizontal-item");

        if (scrollContainer && sections.length > 0) {
            // Calculate movement based on number of sections
            // We need to move logic: -(totalWidth - viewportWidth)
            // Ideally: -(sections.length - 1) * 100vw

            gsap.to(scrollContainer, {
                xPercent: -100 * (sections.length - 1) / sections.length,
                ease: "none",
                scrollTrigger: {
                    trigger: ".horizontal-section",
                    pin: true,
                    scrub: 1,
                    // Snap to each section (1 / (count - 1))
                    snap: {
                        snapTo: 1 / (sections.length - 1),
                        duration: { min: 0.2, max: 0.8 },
                        ease: "power2.inOut"
                    },
                    // Scroll duration: make it proportional to number of slides for natural feel
                    end: () => "+=" + (sections.length * 100) + "%",
                    invalidateOnRefresh: true
                }
            });
        }

    }, { scope: containerRef });

    const HeroLine = ({ children }) => (
        <div style={{ overflow: "hidden", lineHeight: 0.9 }}>
            <div className="hero-line-inner" style={{ display: "block" }}>
                {children}
            </div>
        </div>
    );

    return (
        <div ref={containerRef} style={{
            background: colors.background,
            color: colors.text,
            fontFamily: "'Inter', sans-serif",
            overflow: "hidden"
        }}>

            {/* --- HERO SECTION --- */}
            <section className="hero-section" style={{
                height: "100vh",
                position: "relative",
                overflow: "hidden",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "space-between",
                textAlign: "center",
                padding: "40px 20px"
            }}>
                <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundColor: isDark ? "#000000" : "transparent" }}>
                    <div className="sd-hero-bg-img" style={{
                        position: "absolute", inset: "0",
                        backgroundImage: `url(${isDark ? '/darklanding.png' : '/lightlanding.png'})`,
                        // backgroundSize moved to CSS for responsiveness
                        filter: isDark ? "brightness(0.9)" : "brightness(1)",
                        opacity: 1
                    }} />
                    <div style={{ position: "absolute", inset: 0, background: isDark ? "radial-gradient(circle, transparent 40%, #0c0c0c 100%)" : "radial-gradient(circle, transparent 40%, rgba(255,255,255,0.8) 100%)" }} />
                </div>

                <div style={{ position: "relative", zIndex: 10, marginTop: "60px" }}>
                    <h1 style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "clamp(3rem, 10vw, 8rem)",
                        fontWeight: "800",
                        textTransform: "uppercase",
                        letterSpacing: "-0.04em",
                        margin: 0,
                        mixBlendMode: isDark ? "lighten" : "darken",
                        opacity: 0.9
                    }}>
                        <HeroLine>Forging</HeroLine>
                        <HeroLine>The Future</HeroLine>
                    </h1>
                </div>

                <div style={{
                    position: "absolute",
                    top: "54%", left: "50%", transform: "translate(-50%, -50%)",
                    zIndex: 20, pointerEvents: "none",
                    mixBlendMode: "screen",
                    filter: "drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))"
                }}>
                    <RotatingIcon size={140} />
                </div>

                <div className="hero-btn" style={{ position: "relative", zIndex: 10, marginBottom: "40px", display: "flex", gap: "20px" }}>
                    <Link to="/login" style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        height: "56px", padding: "0 36px", borderRadius: "100px", background: "#fbbf24", color: "#000",
                        fontSize: "0.95rem", fontWeight: "700", textDecoration: "none",
                        boxShadow: "0 10px 40px -10px rgba(251, 191, 36, 0.5)", transition: "transform 0.2s"
                    }}>Start Building</Link>
                </div>
            </section>

            {/* --- EDITOR SHOWCASE (Godly Style) --- */}
            <section className="fade-section" style={{ padding: "100px 20px", maxWidth: "1400px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "20px" }}>
                        The Visual Studio.
                    </h2>
                    <p style={{ fontSize: "1.2rem", opacity: 0.7, maxWidth: "600px", margin: "0 auto" }}>
                        Edit JSON directly and watch your UI forge itself in real-time. No compilation, just instant creation.
                    </p>
                </div>
                <div style={{
                    borderRadius: "24px", overflow: "hidden", border: isDark ? "1px solid #333" : "1px solid #eee",
                    boxShadow: "0 40px 100px -20px rgba(0,0,0,0.5)",
                    background: isDark ? "#0c0c0c" : "#f8f9fa",
                    position: "relative"
                }}>
                    <div style={{ padding: "10px 20px", borderBottom: isDark ? "1px solid #333" : "1px solid #eee", display: "flex", gap: "8px", alignItems: "center" }}>
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f56" }}></div>
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }}></div>
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27c93f" }}></div>
                        <span style={{ fontSize: "0.8rem", opacity: 0.5, marginLeft: "10px", fontFamily: "monospace" }}>editor.exe</span>
                    </div>
                    <img src="/editor.png" alt="Sudarshana Editor" style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
            </section>

            {/* --- SHOWCASE SECTION (HORIZONTAL SCROLL) --- */}
            <section className="horizontal-section" style={{
                height: "100vh",
                width: "100%",
                overflow: "hidden",
                position: "relative", // Crucial for pinning
                background: isDark ? "#000" : "#fff"
            }}>
                {/* Scrollable Container (Moves Left) */}
                <div ref={scrollContainerRef} style={{
                    display: "flex",
                    flexWrap: "nowrap",
                    height: "100%",
                    width: "fit-content" // Allow content to dictate width
                }}>
                    {/* Intro Slide */}
                    <div className="horizontal-item" style={{
                        minWidth: "100vw", height: "100vh",
                        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                        padding: "40px", flexShrink: 0
                    }}>
                        <h2 style={{
                            fontSize: "clamp(3rem, 6vw, 5rem)",
                            fontWeight: "900",
                            textAlign: "center",
                            lineHeight: "1",
                            marginBottom: "20px",
                            background: "linear-gradient(135deg, #fff 0%, #94a3b8 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: isDark ? "transparent" : "#111"
                        }}>
                            Live<br />Preview
                        </h2>
                        <p style={{
                            fontSize: "1.2rem", color: isDark ? "#9ca3b8" : "#4b5563", maxWidth: "500px", textAlign: "center"
                        }}>
                            Experience the next generation of UI components. <br />Interactivity baked in.
                        </p>
                        {/* Scroll Indicator */}
                        <div style={{ marginTop: "40px", animation: "bounce 2s infinite" }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Component Slides */}
                    {SHOWCASE_COMPONENTS.map((component, index) => (
                        <div key={component._id} className="horizontal-item" style={{
                            minWidth: "100vw", height: "100vh",
                            display: "flex", justifyContent: "center", alignItems: "center",
                            position: "relative", flexShrink: 0
                        }}>
                            {/* Background Number */}
                            <span style={{
                                position: "absolute", top: "10%", left: "5%",
                                fontSize: "20vw", fontWeight: "900", opacity: 0.03,
                                pointerEvents: "none", zIndex: 0
                            }}>0{index + 1}</span>

                            {/* Wrapper to control width/presentation */}
                            <div style={{
                                width: "clamp(300px, 80vw, 600px)", // Limit width for "Center of Attraction" feel
                                display: "flex", flexDirection: "column", gap: "24px",
                                zIndex: 1
                            }}>
                                <h3 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0", textAlign: "center" }}>
                                    {component.name}
                                </h3>

                                {/* Minimal Card Component */}
                                <div style={{
                                    transform: "scale(1.1)", // Scale up slightly to be the hero
                                    transition: "all 0.5s ease"
                                }}>
                                    <ComponentCard
                                        component={component}
                                        user={{ role: 'guest' }}
                                        navigate={navigate}
                                        minimal={true} // Clean, code-focused view
                                    />
                                </div>

                                <p style={{ textAlign: "center", opacity: 0.7, fontSize: "1rem" }}>
                                    {component.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- TECHNICAL PIPELINE (Lifecycle) --- */}
            <section className="fade-section" style={{ padding: "100px 20px", maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ marginBottom: "80px", textAlign: "center" }}>
                    <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: "20px", background: "rgba(203, 60, 255, 0.1)", color: "#cb3cff", fontSize: "0.8rem", fontWeight: "700", marginBottom: "20px", letterSpacing: "1px" }}>
                        SYSTEM ARCHITECTURE
                    </div>
                    <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "20px" }}>
                        The Publishing Pipeline.
                    </h2>
                    <p style={{ maxWidth: "600px", margin: "0 auto", opacity: 0.6, fontSize: "1.1rem" }}>
                        From local definition to specific NPM artifact. The actual process, visualized.
                    </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "100px" }}>
                    {/* Step 1 */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "60px", alignItems: "center" }}>
                        <div style={{ order: 1 }}>
                            <div style={{ fontSize: "6rem", fontWeight: "800", color: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", lineHeight: 1 }}>01</div>
                            <h3 style={{ fontSize: "2rem", marginBottom: "15px", fontFamily: "'Space Grotesk', sans-serif" }}>Manifest Submission</h3>
                            <p style={{ lineHeight: 1.7, opacity: 0.7, marginBottom: "20px" }}>
                                Initiate a component request. Our engine validates your schema against the strict Sudarshana UI spec, ensuring prop-type safety and theme compatibility before acceptance.
                            </p>
                        </div>
                        <div style={{ order: 2, background: isDark ? "#111" : "#f5f5f5", padding: "40px", borderRadius: "24px", textAlign: "center" }}>
                            <img src="/reuqestcomponent.png" alt="Request Interface" style={{ maxWidth: "100%", height: "auto", borderRadius: "8px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", maxHeight: "400px", objectFit: "contain" }} />
                            <div style={{ marginTop: "20px", fontSize: "0.75rem", opacity: 0.4, fontFamily: "monospace" }}>FIG 1.0 - REQUEST COMPONENT</div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "60px", alignItems: "center" }}>
                        <div style={{ order: 2 }}>
                            <div style={{ fontSize: "6rem", fontWeight: "800", color: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", lineHeight: 1 }}>02</div>
                            <h3 style={{ fontSize: "2rem", marginBottom: "15px", fontFamily: "'Space Grotesk', sans-serif" }}>NPM Registry</h3>
                            <p style={{ lineHeight: 1.7, opacity: 0.7, marginBottom: "20px" }}>
                                Once validated, the build server compiles the component and publishes a scoped package to the public NPM registry. It is immediately available for installation in any React project.
                            </p>
                        </div>
                        <div style={{ order: 1, background: isDark ? "#111" : "#f5f5f5", padding: "40px", borderRadius: "24px", textAlign: "center" }}>
                            <img src="/npmcomponent.png" alt="NPM Package" style={{ maxWidth: "100%", height: "auto", borderRadius: "8px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", maxHeight: "400px", objectFit: "contain" }} />
                            <div style={{ marginTop: "20px", fontSize: "0.75rem", opacity: 0.4, fontFamily: "monospace" }}>FIG 2.0 - REGISTRY ARTIFACT</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- USER ROLES --- */}
            <section className="fade-section" style={{ padding: "100px 20px", background: isDark ? "#111" : "#f9f9f9" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "80px" }}>
                        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontFamily: "'Space Grotesk', sans-serif" }}>Access Levels</h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>

                        {/* Normal User */}
                        {/* Normal User (Explorer) - Borderless & Subordinate */}
                        <div style={{
                            padding: "20px 0",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            minHeight: "400px" // Match Verified height roughly
                        }}>
                            <h3 style={{
                                fontSize: "clamp(2rem, 4vw, 2.5rem)",
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                color: isDark ? "#333" : "#e5e5e5", // Very muted
                                margin: "0 0 10px 0"
                            }}>
                                Explorer
                            </h3>
                            <h4 style={{
                                fontSize: "1.5rem",
                                fontWeight: "500",
                                color: isDark ? "#fff" : "#000",
                                margin: "0 0 20px 0",
                                fontFamily: "'Space Grotesk', sans-serif"
                            }}>
                                Standard Access
                            </h4>

                            <p style={{
                                opacity: 0.5,
                                fontSize: "0.95rem",
                                marginBottom: "40px",
                                lineHeight: "1.6",
                                maxWidth: "350px"
                            }}>
                                The foundation. Browse, view, and use components from the verified registry.
                            </p>

                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {["Browse Gallery", "View Source", "Copy Configs", "Download Assets"].map(i => (
                                    <li key={i} style={{
                                        marginBottom: "15px",
                                        display: "flex",
                                        gap: "15px",
                                        alignItems: "center",
                                        opacity: 0.6,
                                        fontSize: "0.9rem",
                                        fontWeight: "500"
                                    }}>
                                        <span style={{
                                            width: "4px",
                                            height: "4px",
                                            background: isDark ? "#fff" : "#000",
                                            borderRadius: "50%"
                                        }}></span>
                                        {i}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Verified User */}
                        <VerifiedTierCard isDark={isDark} />

                    </div>
                </div>
            </section>

            {/* --- INSTALLATION --- */}
            <section className="fade-section" style={{ padding: "120px 20px", textAlign: "center" }}>
                <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "10px" }}>
                    Start Forging.
                </h2>
                <p style={{ fontSize: "1.1rem", opacity: 0.6, marginBottom: "30px" }}>Get full access to the entire component ecosystem.</p>

                <div style={{
                    maxWidth: "600px", margin: "0 auto", padding: "20px",
                    background: "#000", color: "#fff", borderRadius: "12px",
                    fontFamily: "monospace", fontSize: "1.1rem", border: "1px solid #333",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    boxShadow: "0 20px 50px -10px rgba(203, 60, 255, 0.2)"
                }}>
                    <span style={{ color: "#cb3cff" }}>&gt; <span style={{ color: "#fff" }}>npm i @sudarshanaui/ui</span></span>
                    <CopyButton />
                </div>
                <p style={{ marginTop: "20px", opacity: 0.5, fontSize: "0.9rem" }}>Universal package. Includes Core, Icons, and Hooks.</p>
            </section>

        </div>
    );
}

function CopyButton() {
    const [copied, setCopied] = useState(false);

    return (
        <button
            onClick={() => {
                navigator.clipboard.writeText("npm i @sudarshanaui/ui");
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }}
            style={{
                background: copied ? "#10b981" : "#000000ff",
                border: copied ? "1px solid #10b981" : "1px solid #333",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.8rem",
                marginLeft: "20px",
                transition: "all 0.2s ease",
                minWidth: "80px"
            }}
        >
            {copied ? "COPIED" : "COPY"}
        </button>
    );
}

function VerifiedTierCard({ isDark }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{
            position: "relative",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "20px 0" // Vertical padding only
        }}>
            {/* Background Blob for subtle separation */}
            <div style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: "120%", height: "120%",
                background: isDark
                    ? "radial-gradient(circle, rgba(16, 185, 129, 0.03) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)",
                zIndex: 0,
                pointerEvents: "none"
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
                {/* Massive Typographic Header */}
                <h3 style={{
                    fontSize: "clamp(3rem, 5vw, 4.5rem)",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: "800",
                    lineHeight: "0.9",
                    margin: "0 0 20px 0",
                    letterSpacing: "-0.04em",
                    color: isDark ? "#fff" : "#000"
                }}>
                    VERIFIED<br />
                    <span style={{
                        color: "transparent",
                        WebkitTextStroke: isDark ? "1px #10b981" : "1px #059669",
                        opacity: 0.8
                    }}>CREATOR</span>
                </h3>

                <p style={{
                    fontSize: "1.1rem",
                    maxWidth: "400px",
                    lineHeight: "1.6",
                    opacity: 0.8,
                    marginBottom: "40px",
                    fontFamily: "'Inter', sans-serif"
                }}>
                    The architects. The builders. Access the power to <span style={{ borderBottom: "2px solid #10b981" }}>create and publish</span>.
                </p>

                {/* Minimal List */}
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "40px" }}>
                    {["Create", "Publish", "Collaborate"].map((item, i) => (
                        <div key={i} style={{
                            display: "flex", alignItems: "center", gap: "8px",
                            fontSize: "0.9rem", fontWeight: "600",
                            textTransform: "uppercase", letterSpacing: "1px",
                            opacity: 0.7
                        }}>
                            <span style={{ width: "6px", height: "6px", background: "#10b981", borderRadius: "50%" }} />
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Interaction Trigger */}
            <div style={{ position: "relative", zIndex: 2 }}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        background: "none",
                        border: "none",
                        padding: "0",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        group: "trigger"
                    }}
                >
                    <div style={{
                        width: "50px", height: "50px",
                        borderRadius: "50%",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
                        background: isOpen ? "#10b981" : "transparent"
                    }}>
                        <svg
                            width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke={isOpen ? "#000" : (isDark ? "#fff" : "#000")}
                            strokeWidth="2"
                            style={{
                                transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
                                transform: isOpen ? "rotate(45deg)" : "rotate(0deg)"
                            }}
                        >
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                    </div>
                    <span style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        color: isDark ? "#fff" : "#000"
                    }}>
                        {isOpen ? "Close Details" : "How to Access"}
                    </span>
                </button>

                {/* The Reveal */}
                <div style={{
                    marginTop: "20px",
                    overflow: "hidden",
                    height: isOpen ? "auto" : "0",
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? "translateY(0)" : "translateY(20px)",
                    transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)"
                }}>
                    <div style={{
                        borderLeft: "2px solid #10b981",
                        paddingLeft: "30px",
                        marginLeft: "24px" // Align with button center
                    }}>
                        <p style={{
                            fontSize: "1.2rem",
                            lineHeight: "1.4",
                            fontWeight: "300",
                            margin: "0 0 10px 0",
                            color: isDark ? "#e2e8f0" : "#1e293b"
                        }}>
                            Membership is <strong style={{ fontWeight: "700", color: "#10b981" }}>invite-only</strong>.
                        </p>
                        <p style={{
                            fontSize: "0.95rem",
                            opacity: 0.6,
                            margin: 0,
                            maxWidth: "300px"
                        }}>
                            To join the verified circle, you must collaborate with an existing creator on a component.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
